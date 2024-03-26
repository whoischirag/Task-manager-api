const express = require("express");
const tasks = require("../models/tasks");
const router = express.Router();
const auth = require("../middleware/auth");

router.patch("/tasks/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "Completed"];

  const IsValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!IsValidUpdate) {
    return res.status(400).send({ Error: "Invalid Update" });
  }

  try {
    const task = await tasks.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    // const task = await tasks.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send({ Error: "User not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();

    res.send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
// GET /tasks?sortBy=createdAt: desc

// router.get("/tasks", auth, async (req, res) => {

//const match={}
// const sort={}
//if(req.query.completed){
//       match.completed=req.query.completed === 'true'

// //}
//    if(req.query.sortBy){
//     const parts= req.query.sortBy.split(':')
//     sort[parts[0]]=parts[1] ==='desc' ?-1:1
//    }


//   try {
//     await req.user.populate({
//      path:'tasks'
//      match,
//       option:{
//         limit:parseInt(req.query.limit),
//           skip:parseINt(req.query.skip),
//          sort
//}

//}).execPopulate()
//       .then(user => {
//         // Perform additional logic here
//         console.log("Tasks populated for user:", user);
//         // Now send the tasks in the response
//         res.send(user.tasks);
//       })
//       .catch(error => {
//         throw error;
//       });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

router.get("/tasks", auth, async (req, res) => {
  try {
    const task = await tasks.find({ owner: req.user._id });
    res.status(200).send(task);

    // await req.user.populate('tasks').execPopulate()

    //    res.send(req.user.tasks)
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;

  const task = await tasks.findOne({ _id, owner: req.user._id });
  if (!task) {
    return res.status(404).send();
  }
  res.send(task);
});

router.post("/tasks", auth, async (req, res) => {
  // const task = new tasks(req.body);       //old solution

  const task = new tasks({
    ...req.body,
    owner: req.user._id,
  });

  try {
    await task.save();
    res.status(200).send(task);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await tasks.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    // const task = await tasks.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).send({ Error: "No task found" });
    }

    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
