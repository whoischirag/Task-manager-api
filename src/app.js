const express = require("express");
require("./db/mongoose");

const UserRouter = require("./routers/user");
const TasksRouter = require("./routers/task");

const app = express();


app.use(express.json());

app.use(UserRouter);
app.use(TasksRouter);


module.exports=app