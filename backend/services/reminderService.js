import cron from "node-cron";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import { sendEmail } from "../utils/email.js";

cron.schedule("* * * * *", async () => {
  console.log("Checking reminders...");

  const now = new Date();
  const fiveMinutes = new Date(now.getTime() + 5 * 60000);

  const tasks = await Task.find({
    time: { $lte: fiveMinutes },
    reminderSent: false
  });

  for (const task of tasks) {
    const user = await User.findById(task.userId);

    await sendEmail(
      user.email,
      "Task Reminder",
      `<p>Your task "${task.title}" is due soon!</p>`
    );

    task.reminderSent = true;
    await task.save();
  }
});
