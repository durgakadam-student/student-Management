
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/student");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// ---------- Connect to MongoDB ----------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// ---------- Common Error Handler ----------
function handleError(res, err) {
  if (err.code === 11000) {
    return res.status(409).json({
      error: "Student ID or email already exists"
    });
  }

  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");

    return res.status(400).json({ error: msg });
  }

  console.error(err);

  return res.status(500).json({
    error: "Server error"
  });
}

// ---------- CREATE STUDENT ----------
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

// ---------- READ ALL STUDENTS ----------
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find();

    res.status(200).json({
      count: students.length,
      data: students
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- READ ONE STUDENT ----------
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.id
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(200).json({ data: student });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- UPDATE STUDENT ----------
app.put("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student updated successfully",
      data: student
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- DELETE STUDENT ----------
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({
      studentId: req.params.id
    });

    if (!student) {
      return res.status(404).json({
        error: "Student not found"
      });
    }

    res.status(200).json({
      message: "Student deleted successfully",
      data: student
    });
  } catch (err) {
    handleError(res, err);
  }
});

// ---------- START SERVER (RENDER) ----------
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
