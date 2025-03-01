import express from "express";
import * as contractorController from "./contractor.controller.js";

const router = express.Router();

router.post(
  "/create",
  contractorController.createContractor
);
router.get("/get",  contractorController.getContractor);
router.put("/:id",  contractorController.editContractor);
router.delete("/delete/:id",  contractorController.deleteContractor);

export default router;