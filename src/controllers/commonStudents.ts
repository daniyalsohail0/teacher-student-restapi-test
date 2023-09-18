import { Request, Response } from "express";
import TeacherModel, { ITeacher } from "../models/teacherModel";
import StudentModel, { IStudent } from "../models/studentModel";

const getCommonStudents = async (req: Request, res: Response) => {
  const { teacher: teachersParam } = req.query;

  try {
    // Ensure that the teacher query parameter is an array
    const teachers = Array.isArray(teachersParam)
      ? teachersParam
      : [teachersParam];

    // Find teacher records by their email addresses
    const teacherRecords: ITeacher[] = await TeacherModel.find({
      email: { $in: teachers },
    });

    // Check if the given teachers exist
    if (teacherRecords.length !== teachers.length) {
      const missingTeachers = teachers.filter(
        (t) => !teacherRecords.some((teacher) => teacher.email === t)
      );
      return res
        .status(400)
        .json({ error: `Teachers not found: ${missingTeachers.join(", ")}` });
    }

    // Find common students by finding the intersection of students arrays
    const commonStudentEmails = teacherRecords.reduce(
      (common: string[], teacher) => {
        const teacherStudentEmails = teacher.students.map((studentEmail) =>
          studentEmail.toString()
        );
        return common.length === 0
          ? teacherStudentEmails
          : common.filter((studentEmail) =>
              teacherStudentEmails.includes(studentEmail)
            );
      },
      []
    );

    // Respond with the list of common student emails
    res.status(200).json({ students: commonStudentEmails });
  } catch (error) {
    console.error(error);
    // Respond with an error message
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default getCommonStudents;
