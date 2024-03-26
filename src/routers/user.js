const express = require("express");
const User = require("../models/users");
const sharp= require('sharp')
const router = express.Router();
const auth = require("../middleware/auth");
const{SendWelcomeMail,sendCancelationMail } = require('../emails/account')
const multer = require("multer");

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});

router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ Error: "Invalid Updates!" });
  }

  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    //   const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //    new: true,
    //    runValidators: true,
    //  });

    res.send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/users", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    SendWelcomeMail(user.email,user.name)
    const token = await user.getAuthToken();
    res.status(200).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/users/login", async (req, res) => {
  try {
    // Attempt to authenticate the user using the provided email and password
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.getAuthToken();

    // If authentication is successful, send back the user data in the response
    res.send({ user, token });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during login:", error);

    // Send back a more informative error response
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.token = [];
    req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(); 
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    
    await req.user.remove();
    sendCancelationMail(req.user.email,req.user.name)
    res.status(200).send(req.user);
  } catch (error) {
    res.status(500).send(error);
  }
});
// <------------------------UPLOADING FILES USING MULTER----------------------------->
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please Upload an Image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {

    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
   req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ Error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (error) {
    res.status(404).send();
  }
});

module.exports = router;
