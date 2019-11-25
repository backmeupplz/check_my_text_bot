import { prop, getModelForClass, arrayProp } from '@typegoose/typegoose'

export class User {
  @prop({ required: true, index: true, unique: true })
  id: number

  @prop({ required: true, default: 'en' })
  language: string
  @prop({ required: true, default: true })
  english: boolean

  @arrayProp({ items: Number, index: true, required: true, default: [] })
  channels: number[]

  @prop({ required: true, default: false })
  glvrd: boolean
}

// Get User model
export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
})

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
