const express = require("express");
const {
  createTask,
  getTasks,
  getTasksByProject,
  updateTask,
  deleteTask,
  getTaskById,
} = require("../controllers/taskController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.get("/project/:projectId", protect, getTasksByProject);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.get("/:id", protect, getTaskById);


module.exports = router;
