import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/email.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashed });

    const verifyLink = `${process.env.BASE_URL}/verify/${user._id}`;

    await sendEmail(
      email,
      "Verify Your Email",
      `<p>Click here to verify:</p> <a href="${verifyLink}">${verifyLink}</a>`
    );

    res.json({ message: "Verification email sent!" });
  } catch (e) {
    res.json({ error: e.message });
  }
};

export const verify = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.send("Invalid link");

  user.verified = true;
  await user.save();

  res.send("Email verified!");
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.json({ message: "User not found" });
  if (!user.verified) return res.json({ message: "Email not verified" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token });
};
