const express = require('express');
const app = express();
const cors = require("cors");
require("./db/mongoConnect");
require('dotenv').config();

app.use(express.json());
app.use(cors())

const indexR = require("./routes/index") ;
const tasksR = require("./routes/tasks") ;
const usersR = require("./routes/users") ;
const projectsR = require("./routes/projects");


app.use("/", indexR);
app.use("/users", usersR);
app.use("/projects", projectsR);
app.use("/tasks", tasksR);

let port = process.env.PORT || "4000";
app.listen(port);