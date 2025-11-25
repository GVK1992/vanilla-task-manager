const Task = require("../models/taskModel");
const User = require("../models/userModel");
const transporter = require("../email");

module.exports = async function sendTaskReminders() {
  const now = new Date();

  const tasks = await Task.find({
    reminderTime: { $lte: now },
    reminded: false
  });

  for (const task of tasks) {
    const user = await User.findById(task.userId);

    await transporter.sendMail({
      to: user.email,
      subject: "Task Reminder",
      text: `Reminder: ${task.title} is due soon!`
    });

    task.reminded = true;
    await task.save();
  }
};
