import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  password?: string; // Password is required on creation but not returned on query
  role: string;
}

const UserSchema: Schema<IUser> = new Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name.'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number.'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    select: false, // Do not return password by default
  },
  role: {
    type: String,
    required: [true, 'Please provide a role.'],
    default: 'Employee',
  },
}, { timestamps: true });

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
