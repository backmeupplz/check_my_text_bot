import { Schema, model } from 'mongoose'

export class GlvrdHint {
  id: string

  name: string
  description: string
}

// Get GlvrdHint model
export const GlvrdHintModel = model<GlvrdHint>(
  'GlvrdHint',
  new Schema<GlvrdHint>(
    {
      id: { type: String, required: true, index: true, unique: true },
      name: { type: String, required: true },
      description: { type: String, required: true },
    },
    { timestamps: true }
  )
)
