import express from "express";
import {
  createWorker,
  updateWorker,
  deleteWorker,
  getWorkers,
  getWorkerById,
} from "./workers.controller.js"

const router = express.Router();

// مسارات العمال
router.post("/", createWorker);
router.put("/:id", updateWorker);
router.delete("/:id", deleteWorker);
router.get("/", getWorkers);
router.get("/:id", getWorkerById);


export default router;