import express from "express";
import { castVote, getStats } from "../controllers/voteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, castVote);
router.get("/stats", protect, getStats);

export default router;
