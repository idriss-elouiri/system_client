import express from "express";
import * as projectController from "./project.controller.js";

const router = express.Router();

router.post(
  "/create",
  projectController.createHandler
);
router.get("/", projectController.getHandler);
router.put("/:id", projectController.updateHandler);
router.delete("/:id", projectController.deleteHandler);

export default router;