import express from "express";
import { generateResume } from "../controllers/resumeController.js";

const router = express.Router();

router.post("/generate-resume", generateResume);

export default router;
