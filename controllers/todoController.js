const Todo = require("../models/Todo");

// Create Todo
exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      user: req.user._id,
      title: req.body.title,
      description: req.body.description,
    });
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Todo
exports.updateTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Todo
exports.deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json({ message: "Todo removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Toggle Status
exports.toggleStatus = async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    todo.status = todo.status === "pending" ? "completed" : "pending";
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stats
exports.getStats = async (req, res) => {
  try {
    const total = await Todo.countDocuments({ user: req.user._id });
    const completed = await Todo.countDocuments({ user: req.user._id, status: "completed" });
    const pending = await Todo.countDocuments({ user: req.user._id, status: "pending" });

    const monthly = await Todo.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ total, completed, pending, monthly });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
