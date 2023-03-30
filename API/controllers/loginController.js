const jwt = require("jsonwebtoken");
const User = require("../models/user");

const Room = require("../models/room");

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    res.json(rooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const bcrypt = require("bcrypt");

async function signup(req, res) {
  try {
    const { email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user

    const user = new User({ email, password: hashedPassword });
    await user.save();

    // Return success message
    res.status(201).json({ message: "User created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Login controller

async function login(req, res) {
  const { email, password } = req.body;

  try {
    //console.log(req);
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Invalid email or password" });
    }
    // Generate JWT token
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(200).json({ message: "Invalid email or password" });
    }
    const accessToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });

    // Send token in response
    return res.json({ accessToken, href: "/" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}

const showRoomById = async (req, res) => {
  try {
    console.log("in showRoomById");
    const { roomId, token } = req.body;
    console.log("roomId", roomId);
    console.log("token", token);

    // Verify the token using jwt.verify method
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);

    if (decoded) {
      console.log("in decoded");
      return res.status(201).json({message:"all ok"});
    }

  } catch (err) {
    console.log(err);

  }
};


const getRoomById = async(req,res)=>{
  res.render('index');
}

  const renderroom = async(req,res)=>{
    let roomId = req.query.roomId;
    res.render('index');
  }
  

module.exports = { login, signup, getRooms, showRoomById,renderroom, getRoomById };
