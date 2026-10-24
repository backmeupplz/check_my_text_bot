import * as mongoose from 'mongoose'

// Keep Mongoose 6's strict filters and silence its Mongoose 7 deprecation warning
mongoose.set('strictQuery', true)

mongoose.connect(process.env.MONGO)

export * from './User'
export * from './GlvrdHint'
