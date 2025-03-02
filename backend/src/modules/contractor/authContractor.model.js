import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isContractor: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", contractorSchema);

export default Contractor;
