import express from "express";
import { createTask, getTasks } from "../controllers/taskController.js";

const router = express.Router();

router.post("/create", createTask);
router.get("/all", getTasks);

export default router;
