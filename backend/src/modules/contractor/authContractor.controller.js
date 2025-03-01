import Contractor from "./authContractor.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const registerHandler = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newContractor = new Contractor({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newContractor.save();
    res.json("login successFully");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validContractor = await Contractor.findOne({ email });
    if (!validContractor) {
      return next(errorHandler(404, "Account Contractor not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validContractor.password);
    if (!validPassword) {
      return next(errorHandler(400, "password incorrect"));
    }

    const token = jwt.sign(
      { id: validContractor._id, isContractor: validContractor.isContractor },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validContractor._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
