import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // اسم العامل
    contractor_id: {
      type: mongoose.Schema.Types.ObjectId, // تغيير النوع إلى ObjectId
      ref: "Contractor",
      required: true,
    }, // معرف المقاول
    project_id: {
      type: mongoose.Schema.Types.ObjectId, // تغيير النوع إلى ObjectId
      ref: "Project",
      required: true,
    }, // معرف المشروع
    contact_info: {
      email: { type: String, required: false }, // الايميل (اختياري)
      phone: { type: String, required: true }, // رقم الهاتف
    },
    job_title: { type: String, required: true }, // المسمى الوظيفي
  },
  { timestamps: true } // إضافة created_at و updated_at تلقائيًا
);

const Worker = mongoose.model("Worker", workerSchema);

export default Worker;