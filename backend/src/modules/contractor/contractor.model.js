import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", contractorSchema);

export default Contractor;
