const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();      
const PORT = process.env.PORT || 3000;  //either use port no. form env or the default one

//middlware
app.use(bodyParser.json());
app.use(cors()); //when frontend(running on one domain) tries to make a request to the backend server(running on another domain) and the backend server dosnt't allow such requests .





// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error("Error connecting to mongoDB : ",err));



//defining SChema 
const taskSchema = new mongoose.Schema({
    taskName : String,
    deadline : Number
});


//Defining a model
const Task = mongoose.model('Task',taskSchema);



//Get all the tasks in the get route
app.get('/tasks' , async (req,res)=>{
    try{
        const tasks = await Task.find();        //find all
        res.json(tasks);                        //return all tasks found
    } catch(err){
        res.status(500).json({message : err.message});
    }
});



//create a task in post
app.post('/tasks' , async (req,res) => {
    const task = new Task({

        //fetching taskname and deadline from the request body
        taskName : req.body.taskName,       
        deadline : req.body.deadline
    });
    try{
        const newTask = await task.save();      //saving our task object
        res.status(201).json(newTask);
    }
    catch(err){
        res.status(400).json({message: err.message});
    }
});


//deleting a task
app.delete('/tasks/:id' , async (req,res) =>{
    try {
        const taskId = req.params.id;   //storing the _id from parameter to a variable

        const task = await Task.findByIdAndDelete(taskId);      //find the task with _id passed and delete that task

        res.json({ message: 'Task successfully deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


//start the server
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});