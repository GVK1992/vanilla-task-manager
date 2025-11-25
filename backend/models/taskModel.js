import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  time: { type: Date, required: true },
  reminderSent: { type: Boolean, default: false }
});

export default mongoose.model("Task", taskSchema);
