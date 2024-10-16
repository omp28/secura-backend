// // const express = require("express");
// // const { ethers } = require("ethers");
// // const User = require("../models/User");
// // const router = express.Router();

// // // @route  POST /signup
// // // @desc   Register a new user
// // router.post("/signup", async (req, res) => {
// //   const { mnemonic } = req.body;

// //   try {
// //     // Generate wallet from mnemonic
// //     const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// //     const publicKey = wallet.address;

// //     // Check if the user already exists
// //     let user = await User.findOne({ publicKey });
// //     if (user) {
// //       return res.status(400).json({ msg: "User already exists" });
// //     }

// //     // Create a new user and store publicKey and mnemonic hash
// //     user = new User({
// //       publicKey,
// //       mnemonicHash: mnemonic,
// //     });

// //     await user.save();

// //     res.status(201).json({ msg: "User registered successfully", publicKey });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send("Server error");
// //   }
// // });

// // // @route  POST /login
// // // @desc   Authenticate a user
// // router.post("/login", async (req, res) => {
// //   const { mnemonic } = req.body;

// //   try {
// //     // Generate wallet from mnemonic
// //     const wallet = ethers.Wallet.fromMnemonic(mnemonic);
// //     const publicKey = wallet.address;

// //     // Find user by public key
// //     let user = await User.findOne({ publicKey });
// //     if (!user) {
// //       return res.status(400).json({ msg: "Invalid credentials" });
// //     }

// //     // Compare the provided mnemonic with the stored mnemonic hash
// //     const isMatch = await user.compareMnemonic(mnemonic);
// //     if (!isMatch) {
// //       return res.status(400).json({ msg: "Invalid credentials" });
// //     }

// //     res.json({ msg: "Login successful", publicKey });
// //   } catch (err) {
// //     console.error(err.message);
// //     res.status(500).send("Server error");
// //   }
// // });

// // module.exports = router;
// const express = require("express");
// const { ethers } = require("ethers");
// const User = require("../models/User");
// const router = express.Router();

// // @route  POST /signup
// // @desc   Register a new user
// router.post("/signup", async (req, res) => {
//   const { mnemonic } = req.body;

//   try {
//     const wallet = ethers.Wallet.fromMnemonic(mnemonic);
//     const publicKey = wallet.address;

//     let user = await User.findOne({ publicKey });
//     if (user) {
//       return res.status(400).json({ msg: "User already exists" });
//     }

//     user = new User({
//       publicKey,
//       mnemonicHash: mnemonic, // Should be hashed in model pre-save hook
//     });

//     await user.save();
//     res.status(201).json({ msg: "User registered successfully", publicKey });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// // @route  POST /login
// // @desc   Authenticate a user
// router.post("/login", async (req, res) => {
//   const { mnemonic } = req.body;

//   try {
//     const wallet = ethers.Wallet.fromMnemonic(mnemonic);
//     const publicKey = wallet.address;

//     let user = await User.findOne({ publicKey });
//     if (!user) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     const isMatch = await user.compareMnemonic(mnemonic);
//     if (!isMatch) {
//       return res.status(400).json({ msg: "Invalid credentials" });
//     }

//     res.json({ msg: "Login successful", publicKey });
//   } catch (err) {
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Route for user signup (saving publicKey)
router.post("/signup", async (req, res) => {
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ message: "Public key is required" });
  }

  try {
    const userExists = await User.findOne({ publicKey });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({ publicKey });
    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

// Route for user login (checking publicKey)
router.post("/login", async (req, res) => {
  const { publicKey } = req.body;

  if (!publicKey) {
    return res.status(400).json({ message: "Public key is required" });
  }

  try {
    const user = await User.findOne({ publicKey });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.status(200).json({ message: "Login successful", publicKey });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
