import Comown from "./authComown.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const registerHandler = async (req, res, next) => {
  const { companyId, name, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newComown = new Comown({
    companyId,
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newComown.save();
    res.json("register successFully");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validComown = await Comown.findOne({ email });
    if (!validComown) {
      return next(errorHandler(404, "Account Comown not found"));
    }

    const validPassword = bcryptjs.compareSync(password, validComown.password);
    if (!validPassword) {
      return next(errorHandler(400, "password incorrect"));
    }

    const token = jwt.sign(
      { id: validComown._id, isComown: validComown.isComown },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validComown._doc;

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

export const getHandler = async (req, res, next) => {
  try {
    const comowns = await Comown.find();
    res.json(comowns);
  } catch (error) {
    next(error);
  }
};
