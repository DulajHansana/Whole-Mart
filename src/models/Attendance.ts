import mongoose, { Schema, Document, models, Model, Types } from 'mongoose';

export interface IAttendance extends Document {
  userId: Types.ObjectId;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number;
}

const AttendanceSchema: Schema<IAttendance> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  checkIn: {
    type: Date,
    required: true,
  },
  checkOut: {
    type: Date,
  },
  totalHours: {
    type: Number,
  },
}, { timestamps: true });

const Attendance: Model<IAttendance> = models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);

export default Attendance;
