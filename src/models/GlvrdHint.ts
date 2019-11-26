import { prop, getModelForClass } from '@typegoose/typegoose'

export class GlvrdHint {
  @prop({ required: true, index: true, unique: true })
  id: string

  @prop({ required: true })
  name: string
  @prop({ required: true })
  description: string
}

// Get GlvrdHint model
export const GlvrdHintModel = getModelForClass(GlvrdHint, {
  schemaOptions: { timestamps: true },
})
