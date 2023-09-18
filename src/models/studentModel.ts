import mongoose, { Document, Schema } from "mongoose";

export interface IStudent extends Document {
  email: string;
  teachers: string[];
  suspended: boolean;
  notifications: string[];
}

const studentSchema = new Schema<IStudent>({
  email: { type: String, required: true },
  teachers: [{ type: String }],
  suspended: { type: Boolean, default: false },
  notifications: [{ type: String }],
});

export default mongoose.model<IStudent>("Student", studentSchema);
