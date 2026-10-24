import { Schema, model } from 'mongoose'

export class User {
  id: number

  language: string
  english: boolean

  channels: number[]

  glvrd: boolean
}

// Get User model
export const UserModel = model<User>(
  'User',
  new Schema<User>(
    {
      id: { type: Number, required: true, index: true, unique: true },
      language: { type: String, required: true, default: 'en' },
      english: { type: Boolean, required: true, default: true },
      channels: { type: [Number], index: true, required: true, default: [] },
      glvrd: { type: Boolean, required: true, default: false },
    },
    { timestamps: true }
  )
)

// Get or create user
export async function findUser(id: number) {
  let user = await UserModel.findOne({ id })
  if (!user) {
    try {
      user = await new UserModel({ id }).save()
    } catch (err) {
      user = await UserModel.findOne({ id })
    }
  }
  return user
}
