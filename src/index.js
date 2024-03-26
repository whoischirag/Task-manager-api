const express = require("express");
require("./db/mongoose");

const UserRouter = require("./routers/user");
const TasksRouter = require("./routers/task");

const app = express();
const port = process.env.PORT 

// app.use((req,res,next)=>{
// console.log(req.method,req.path)

// next()
// })

app.use(express.json());

app.use(UserRouter);
app.use(TasksRouter);

app.listen(port, () => {
  console.log("Server is up and running on port " + port);
});

//<--------------HOW TO USE HASH THE PASSWORD------------------------>
//const bcrypt = require("bcryptjs");

// const myfunction = async () => {
//   const password = "HelloWorld6969";
//   const hashedPassword = await bcrypt.hash(password, 8);

//   console.log(password);
//   console.log(hashedPassword);

// const IsMatch=await bcrypt.compare("HelloWorld6969",hashedPassword)

// console.log(IsMatch)

// };
//<--------------HOW TO USE CREATE WEBTOKEN------------------------>
// const jwt=require('jsonwebtoken')

// const myfunction= async ()=>{

// const token= jwt.sign({_id:'therealslimshady'},'thisismynewcourse')
// console.log(token)

// const data = jwt.verify(token,'thisismynewcourse')
// console.log(data)

// }

// myfunction()

// <--------------HOW TO USE POPULATE------------------------>

// const User=require('./models/users')
// const Task =require('./models/tasks')

// const main = async ()=>{

//    const task = await Task.findById('65f16791cc12ac26486e633a')
//  await task.populate('owner').execPopulate()
//   console.log(task.owner)

// const user =await User.findById('65f162392520d417dc913d4d')
// await user.populate('tasks').execPopulate()
// console.log(user.tasks)

// const task = await Task.find({'owner':'65f46c97817b7c75dc4a487a'})
//await task.populate('owner').execPopulate()
// console.log(task)

//}
// main()
//<--------------------------Uploading Images USing MUlter-------------------------------->
// const multer = require("multer");
// const upload = multer({
//   dest: "images",
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, cb) {

//     if(!file.originalname.match(/\.(doc|docx)$/)){
//       cb( new Error('Please upload Your Word Document!'))
//     }

// cb(undefined,true)

//     //cb(new Error('file must be pdf'))
//     //cb(undefined,true)
//     //cb(undefined,false)
//   }
// });

// app.post("/upload", upload.single("upload"), (req, res) => {
//   res.send();
// },(error,req,res,next)=>{
//    res.status(400).send({Error:error.message})
  
// });
