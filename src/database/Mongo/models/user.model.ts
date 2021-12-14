import { model, Schema } from 'mongoose'

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    username: { type: String, unique: true, required: true },
    fullname: { type: String, required: true },
    password: { type: String, required: true },
    birthdate: { type: String, required: true },
    phone: { type: String, required: true },
    avatar: { type: String, required: true },
    role: [{ type: String, ref: 'Role' }],
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
  },
  { timestamps: { createdAt: 'created_at' } }
)

export default model('User', UserSchema)
