require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/student");

const app = express();
app.use(express.json());
app.use(express.static("public"));

// ---------- Connect to MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// ---------- Common error handler ----------
function handleError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({ error: "Student ID or email already exists" });
  }
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ error: msg });
  }
  console.error(err);
  res.status(500).json({ error: "Server error" });
}

// ---------- CREATE ----------
app.post("/api/students", async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const student = await Student.create(req.body);
    res.status(201).json({
      message: "Student added successfully",
      data: student
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- READ ALL ----------
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.json({ count: students.length, data: students });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- READ ONE ----------
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ data: student });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- UPDATE ----------
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student updated successfully", data: student });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- DELETE ----------
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentId: req.params.id });
    if (!student) return res.status(404).json({ error: "Student not found" });
    res.json({ message: "Student deleted successfully", data: student });
  } catch (err) {
    handleError(res, err);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
