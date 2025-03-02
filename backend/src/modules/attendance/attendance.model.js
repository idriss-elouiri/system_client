import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    }, // معرف العامل
    project_id: {
      type: String,
      ref: "Project",
      required: true,
    }, // معرف المشروع
    date: { type: Date, required: true }, // تاريخ الحضور
    status: {
      type: String,
      enum: ["حاضر", "غائب"],
      required: true,
    }, // حالة الحضور
    worker_name: { type: String, required: true }, // اسم العامل
    nationality: {
      type: String,
      enum: ["سعودي", "غير سعودي"],
      required: true,
    }, // الجنسية
    job_title: { type: String, required: true }, // المسمى الوظيفي
  },
  { timestamps: true } // إضافة created_at و updated_at تلقائيًا
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;