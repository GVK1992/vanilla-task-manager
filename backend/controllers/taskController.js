import Task from "../models/taskModel.js";
import jwt from "jsonwebtoken";

export const createTask = async (req, res) => {
  const { title, time } = req.body;
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);

  const task = await Task.create({
    userId: user.id,
    title,
    time
  });

  res.json(task);
};

export const getTasks = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_SECRET);

  const tasks = await Task.find({ userId: user.id });

  res.json(tasks);
};
