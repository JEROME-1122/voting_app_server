const express = require("express");
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleStatus,
  getStats,
} = require("../controllers/todoController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTodo);
router.get("/", protect, getTodos);
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);
router.put("/:id/toggle", protect, toggleStatus);
router.get("/stats/summary", protect, getStats);

module.exports = router;
