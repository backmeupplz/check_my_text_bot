import Axios from 'axios'

let session: string | undefined

const base = 'https://api.glvrd.ru/v2'

async function getNewSession() {
  try {
    const sessionResponse = (
      await Axios.post(`${base}/session?app=check_my_text_bot/1.0`)
    ).data
    session = sessionResponse.session
  } catch (err) {
    console.error(err)
  }
}
getNewSession()
setInterval(getNewSession, 30 * 60 * 1000) // get new session every 30 mins

const queue = []

export function proofRead(text: string): Promise<string> {
  const promise = new Promise(() => {}) as Promise<string>

  queue.push({
    promise,
    text,
  })

  return promise
}

let proofreadLocked = false
async function completeProofRead() {
  if (proofreadLocked) {
    return
  }
  proofreadLocked = true
  try {
  } finally {
    proofreadLocked = false
  }
}

setInterval(completeProofRead, 1 * 1000)
