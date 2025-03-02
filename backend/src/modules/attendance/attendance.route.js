import express from "express";
import {
  createAttendance,
  updateAttendance,
  deleteAttendance,
  getAttendance,
  getAttendanceById,
} from "./attendance.controller.js";

const router = express.Router();

// مسارات الحضور
router.post("/", createAttendance);
router.put("/:id", updateAttendance);
router.delete("/:id", deleteAttendance);
router.get("/", getAttendance);
router.get("/:id", getAttendanceById);

export default router;
