const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/users");
const Task = require("../../src/models/tasks");

const useroneId = new mongoose.Types.ObjectId();
const userone = {
  _id: useroneId,
  name: "amit",
  email: "amit@aubank.com",
  password: "aubanks",
  tokens: [
    {
      token: jwt.sign({ _id: useroneId }, process.env.JWT_SECRET),
    },
  ],
};

const usertwoId = new mongoose.Types.ObjectId();
const usertwo = {
  _id: usertwoId,
  name: "Bruce",
  email: "bruce@wayne.com",
  password: "bwindustries",
  tokens: [
    {
      token: jwt.sign({ _id: usertwoId }, process.env.JWT_SECRET),
    },
  ],
};

const taskOne = {
  _id: new mongoose.Types.ObjectId(),
  description: "first task",
  Completed: "true",
  owner: userone._id,
};

const taskTwo = {
  _id: new mongoose.Types.ObjectId(),
  description: "second task",
  Completed: "false",
  owner: userone._id,
};

const taskThree = {
  _id: new mongoose.Types.ObjectId(),
  description: "third task",
  Completed: "true",
  owner: usertwo._id,
};

const setupDatabase = async () => {
  await User.deleteMany();
  await Task.deleteMany();
  await new User(userone).save();
  await new User(usertwo).save();
  await new Task(taskOne).save();
  await new Task(taskTwo).save();
  await new Task(taskThree).save();
};

module.exports = {
  usertwoId,
  usertwo,
  setupDatabase,
  userone,
  useroneId,
  taskOne,
  taskTwo,
  taskThree,
};
