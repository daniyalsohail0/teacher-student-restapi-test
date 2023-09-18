import mongoose, { Document, Schema } from "mongoose";

export interface ITeacher extends Document {
  email: string;
  students: string[];
}

const teacherSchema = new Schema<ITeacher>({
  email: { type: String, required: true },
  students: [{ type: String, }],
});

export default mongoose.model<ITeacher>("Teacher", teacherSchema);
