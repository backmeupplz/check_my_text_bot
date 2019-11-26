import Axios from 'axios'
import * as request from 'request-promise-native'
import { GlvrdHintModel } from '../models'

let session: string | undefined

const base = 'https://api.glvrd.ru/v2'
const app = 'app=check_my_text_bot/1.0'

async function getNewSession() {
  try {
    const sessionResponse = (await Axios.post(`${base}/session/?${app}`)).data
    session = sessionResponse.session
    console.log(`Got new glvrd session: ${session}`)
  } catch (err) {
    console.error(err)
  }
}
getNewSession()
async function updateSession() {
  try {
    await Axios.post(`${base}/status/?${app}&session=${session}`)
    console.log(`Updated glvrd session: ${session}`)
  } catch (err) {
    console.error(err)
  }
}
setInterval(updateSession, 30 * 60 * 1000) // get new session every 30 mins

const queue = []

interface Hint {
  start: number
  end: number
  name: string
  description: string
}

interface GlvrdResponse {
  score: number
  hints: Hint[]
}

export function proofRead(text: string): Promise<GlvrdResponse> {
  return new Promise((res, rej) => {
    queue.push({
      res,
      rej,
      text,
    })
  })
}

let proofreadLocked = false
async function completeProofRead() {
  if (proofreadLocked) {
    return
  }
  proofreadLocked = true
  try {
    const proofReadCandidates = queue.splice(0, 1)
    if (!proofReadCandidates.length) {
      return
    }
    const { text, res, rej } = proofReadCandidates[0]
    try {
      let glvrdResult = JSON.parse(
        await request({
          url: `${base}/proofread/?${app}&session=${session}`,
          method: 'post',
          form: {
            text,
          },
        })
      )
      if (glvrdResult.status === 'error') {
        throw new Error(`${glvrdResult.code}: ${glvrdResult.message}`)
      }
      const result = {
        score: glvrdResult.score,
        hints: [],
      }
      for (const hint of glvrdResult.fragments) {
        let hintResult = {} as any
        const dbhint = await GlvrdHintModel.findOne({ id: hint.hint_id })
        if (dbhint) {
          hintResult = {
            name: dbhint.name,
            description: dbhint.description,
          }
        } else {
          try {
            console.log(
              `${base}/hints/?${app}&session=${session}`,
              hint.hint_id
            )
            const hintResponse = JSON.parse(
              await request({
                url: `${base}/hints/?${app}&session=${session}`,
                method: 'post',
                form: {
                  ids: hint.hint_id,
                },
              })
            )
            hintResult = hintResponse.hints[hint.hint_id]
            await new GlvrdHintModel({
              id: hint.hint_id,
              name: hintResult.name,
              description: hintResult.description,
            }).save()
          } catch (err) {
            continue
          }
        }
        result.hints.push({
          start: hint.start,
          end: hint.end,
          ...hintResult,
        })
      }
      res(result)
    } catch (err) {
      rej(err)
    }
  } finally {
    proofreadLocked = false
  }
}

setInterval(completeProofRead, 1 * 1000)
