import express from "express";
import register from "../controllers/registration";
import getCommonStudents from "../controllers/commonStudents";
import suspendStudent from "../controllers/suspendedStudent";
import retrieveForNotifications from "../controllers/retrieveNotifications";

const router = express.Router();

router.post("/register", register);
router.get("/commonstudents", getCommonStudents);
router.post("/suspend", suspendStudent);
router.post("/retrievefornotifications", retrieveForNotifications);

export default router;
