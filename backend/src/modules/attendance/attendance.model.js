import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    worker_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    }, // معرف العامل
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    }, // معرف المشروع
    date: { type: Date, required: true }, // تاريخ الحضور
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
    nationality: {
      type: String,
      enum: ["Saudi", "Non-Saudi"],
      required: true,
    },

    worker_name: { type: String, required: true }, // اسم العامل
    job_title: { type: String, required: true }, // المسمى الوظيفي
  },
  { timestamps: true } // إضافة created_at و updated_at تلقائيًا
);

// التحقق من صحة البيانات قبل الحفظ
attendanceSchema.pre("save", function (next) {
  if (!this.worker_id || !this.project_id || !this.date || !this.status) {
    throw new Error("جميع الحقول مطلوبة");
  }
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
