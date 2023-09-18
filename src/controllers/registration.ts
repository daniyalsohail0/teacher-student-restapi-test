// registrationController.ts
import { Request, Response } from "express";
import TeacherModel, { ITeacher } from "../models/teacherModel";
import StudentModel, { IStudent } from "../models/studentModel";

const register = async (req: Request, res: Response) => {
  const { teacher, students } = req.body;

  try {
    // Check if the teacher exists; if not, create a new teacher
    let teacherRecord: ITeacher | null = await TeacherModel.findOne({
      email: teacher,
    });
    if (!teacherRecord) {
      teacherRecord = new TeacherModel({ email: teacher, students: [] });
      await teacherRecord.save();
    }

    const registeredStudents: string[] = [];

    // Register each student
    for (const studentEmail of students) {
      // Check if the student exists; if not, create a new student
      let studentRecord: IStudent | null = await StudentModel.findOne({
        email: studentEmail,
      });
      if (!studentRecord) {
        studentRecord = new StudentModel({ email: studentEmail, teachers: [] });
        await studentRecord.save();
      }

      // Add the student to the teacher's list of students
      if (!teacherRecord.students.includes(studentRecord.email)) {
        teacherRecord.students.push(studentRecord.email);
        await teacherRecord.save();
      }

      // Add the teacher to the student's list of teachers
      if (!studentRecord.teachers.includes(teacherRecord.email)) {
        studentRecord.teachers.push(teacherRecord.email);
        await studentRecord.save();
      }

      // Add the student to the list of successfully registered students
      registeredStudents.push(studentEmail);
    }

    // Populate the students array with email addresses
    const populatedTeacher = await TeacherModel.findById(
      teacherRecord._id
    ).populate("students", "email");

    // Check if populatedTeacher is null
    if (!populatedTeacher) {
      throw new Error("Teacher not found");
    }

    // Respond with the list of successfully registered students
    res.status(200).json({ message: "Registration successful", students });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default register;
