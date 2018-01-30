import mongoose, { Schema } from 'mongoose'

const CurrencySchema = new Schema({
  name: { type: String, required: true, unique: true },
  converted: { type: Number, required: true },
  requests: { type: Number, required: true },
})

export default mongoose.model('Currency', CurrencySchema)
