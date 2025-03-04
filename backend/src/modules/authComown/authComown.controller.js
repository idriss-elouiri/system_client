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

export const getComowns = async (req, res, next) => {
  try {
    const comowns = await Comown.find();
    res.json(comowns);
  } catch (error) {
    next(error);
  }
};

export const updateComown = async (req, res, next) => {
  try {
    const comown = await Comown.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!comown) {
      return res.status(404).json({ message: "Comown not found" });
    }
    res.json({ message: "Comown updated successfully", comown });
  } catch (error) {
    next(error);
  }
};

export const deleteComown = async (req, res, next) => {
  try {
    const comown = await Comown.findByIdAndDelete(req.params.id);
    if (!comown) {
      return res.status(404).json({ message: "Comown not found" });
    }
    res.json({ message: "Comown deleted successfully" });
  } catch (error) {
    next(error);
  }
};