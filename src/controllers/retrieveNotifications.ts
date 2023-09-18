import { Request, Response } from "express";
import TeacherModel, { ITeacher } from "../models/teacherModel";
import StudentModel, { IStudent } from "../models/studentModel";

const retrieveForNotifications = async (req: Request, res: Response) => {
  try {
    // Parse the request body
    const { teacher, notification } = req.body;

    // Find the teacher by their email address
    const teacherRecord: ITeacher | null = await TeacherModel.findOne({
      email: teacher,
    });

    // Check if the teacher exists
    if (!teacherRecord) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Split the notification text into words to identify mentions
    const words: string[] = notification.split(" ");

    // Extract mentioned student email addresses
    const mentionedStudents: string[] = words
      .filter((word) => word.startsWith("@"))
      .map((mention) => mention.slice(1));

    console.log("Mentioned Students:", mentionedStudents);

    // Query eligible students based on mentioned students and teacher's students
    const eligibleStudents: IStudent[] = await StudentModel.find({
      $or: [
        {
          email: { $in: mentionedStudents },
          suspended: false,
        },
        {
          email: { $in: teacherRecord.students },
          suspended: false,
        },
      ],
      suspended: false,
    });

    // Extract unique email addresses of eligible students
    const uniqueRecipients: string[] = [
      ...new Set(eligibleStudents.map((student) => student.email)),
    ];

    // Push the notification message to the notification array of eligible students
    eligibleStudents.forEach(async (student) => {
        student.notifications.push(notification);
        await student.save();
      });

    // Respond with the list of eligible students
    return res.status(200).json({ recipients: uniqueRecipients });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default retrieveForNotifications;
