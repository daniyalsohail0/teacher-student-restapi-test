// suspendStudentController.ts
import { Request, Response } from "express";
import StudentModel, { IStudent } from "../models/studentModel";

const suspendStudent = async (req: Request, res: Response) => {
  const { student } = req.body;

  try {
    // Find the student by their email address
    const studentRecord: IStudent | null = await StudentModel.findOne({
      email: student,
    });

    // Check if the student exists
    if (!studentRecord) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Mark the student as suspended (you may have a 'suspended' field in your schema)
    studentRecord.suspended = true;

    // Save the updated student record
    await studentRecord.save();

    // Respond with the suspended student
    res.status(200).json({ message: "Student suspended", student: studentRecord });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default suspendStudent;
