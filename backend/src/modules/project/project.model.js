import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  project_number: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: {
    type: String,
    enum: ["Active", "Expired", "Completed"],
    default: "Active",
  },
  location: { type: String, required: true },
  assigned_location: { type: String, required: true },
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true },
  contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
}, { timestamps: true });

// التحقق من حالة المشروع بناءً على تاريخ الانتهاء
projectSchema.pre('save', function (next) {
  if (this.end_date < Date.now()) {
    this.status = "Expired";
  }
  next();
});

const Project = mongoose.model("Project", projectSchema);

export default Project;