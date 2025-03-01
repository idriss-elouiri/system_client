import { errorHandler } from "../../utils/error.js";
import Contractor from "./contractor.model.js";

export const createContractor = async (req, res, next) => {
  try {
    const contractor = new Contractor({
      name: req.body.name,
      number: req.body.number,
    });
    const savedContractor = await contractor.save();
    res.json(savedContractor);
  } catch (error) {
    next(error);
  }
};

export const getContractor = async (req, res, next) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors);
  } catch (error) {
    next(error);
  }
};

export const editContractor = async (req, res, next) => {
  try {
    const updatedContractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, number: req.body.number },
      { new: true }
    );
    res.json(updatedContractor);
  } catch (error) {
    next(error);
  }
};

export const deleteContractor = async (req, res, next) => {
  try {
    await Contractor.findByIdAndDelete(req.params.id);
    res.json("It was completed deleting contractor");
  } catch (error) {
    next(error);
  }
};
