const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const dataPath = path.join(__dirname, "../data.json");

const readData = () => {
  const data = fs.readFileSync(dataPath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

exports.signup = async (req, res) => {
  const user = req.body;
  console.log(user)
  if (!user.name || !user.password || !user.email) {
    return res
      .status(400)
      .json({ message: "Username, email, and password are required." });
  }

  const users = readData();
  const existingUser = users.find((user_) => user_.useremail === user.email);

  if (existingUser) {
    return res.status(409).json({ message: "Email already exists." });
  }

  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = {
      id: Date.now(), // Alternatively, use a UUID
      username: user.name,
      useremail: user.email,
      password: hashedPassword,
      gender: user.gender || "not added",
      phone: user.phone || "not added"
    };

    users.push(newUser);
    writeData(users);
    res.status(201).json({ message: "Signup successful!", user: newUser });
    
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateUser = async (req, res) => {
  const { id, username, useremail, password, gender, phone } = req.body;

  if (!id || !username || !useremail) {
    return res
      .status(400)
      .json({ message: "User ID, username, and email are required." });
  }

  const users = readData();
  const userIndex = users.findIndex((user_) => user_.id === id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "User not found." });
  }

  const existingUserWithEmail = users.find(
    (user_) => user_.useremail === useremail && user_.id !== id
  );
  if (existingUserWithEmail) {
    return res.status(409).json({ message: "Email already in use by another account." });
  }

  try {
    users[userIndex] = {
      ...users[userIndex],
      username: username,
      useremail: useremail,
      gender: gender || users[userIndex].gender,
      phone: phone || users[userIndex].phone,
    };

    // Save updated users list
    writeData(users);

    res.status(200).json({ message: "User updated successfully!", user: users[userIndex] });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.login = async (req, res) => {
  const { useremail, password } = req.body;
  

  if (!useremail || !password) {
    return res
      .status(400)
      .json({ message: "useremail and password are required." });
  }

  const users = readData();
  const user = users.find((user) => user.useremail === useremail);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid useremail or password." });
  }
  console.log(user)
  res.status(200).json({ message: "Login successful!", data: user });
};

exports.getData = async (req, res) => {
  try {
    const users = await readData();
    const sanitizedData = Array.isArray(users)
      ? users.map(({ password, ...userData }) => userData)
      : users;

    res
      .status(200)
      .json({ message: "Data retrieval successful!", data: sanitizedData });
  } catch (error) {
    console.error("Error reading data:", error);
    res
      .status(500)
      .json({ message: "Failed to retrieve data", error: error.message });
  }
};
