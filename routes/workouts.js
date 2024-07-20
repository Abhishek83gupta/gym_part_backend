const express = require("express");
const router = express.Router();

const {
  createWorkout,
  getWorkouts,
  getWorkout,
  deleteWorkout,
  updateWorkout,
} = require("../Controller/workoutControllers");

const requireAuth = require('../middleware/requireAuth')

// require auth for all workout routes
router.use(requireAuth)

// GET all workouts
router.get("/", getWorkouts);

// GET a single workout
router.get("/:id", getWorkout);

// POST a new workout
router.post("/", createWorkout); // post req to send data to server

// DELETE a workout
router.delete("/:id", deleteWorkout);

// UPDATE a workout
router.patch("/:id", updateWorkout);

module.exports = router;
