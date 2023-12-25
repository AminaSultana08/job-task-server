const express = require('express');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

//middleware

app.use(cors())
app.use(express.json())



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wua58o9.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
   // await client.connect();

   const taskCollection = client.db("jobTask").collection("tasks")

   app.put('/tasks/:id', async(req,res)=>{
    const id = req.params.id
    const status = req.body.status
    const query = {_id : new ObjectId(id)}
    const updateDoc = {
      $set: {
        status:status
      },
    };
    const result = await taskCollection.updateOne(query,updateDoc)
    res.send(result)
   })
   app.get('/tasks',async(req,res)=>{
   const email = req.query.email
     const query = {email : email}
    const result= await taskCollection.find(query).toArray()
    res.send(result)
   })

   app.put("/tasks/update/:id", async (req, res) => {
    const id = req.params.id;
    const titles = req.body.titles;
    const descriptions = req.body.descriptions;
    const deadlines = req.body.deadlines;
    const priority = req.body.priority;
    const status = req.body.status;
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        titles: titles,
        descriptions: descriptions,
        status: status,
        deadlines: deadlines,
        priority: priority,
      },
    };
    const result = await taskCollection.updateOne(filter, updateDoc);
    res.send(result);
  });

   app.post('/tasks',async(req,res)=>{
    const listItems = req.body
    const result = await taskCollection.insertOne(listItems)
    res.send(result)
   })

   app.delete('/tasks/:id', async(req,res)=>{
    const id = req.params.id
    const query = {_id:new ObjectId(id)}
    const result = await taskCollection.deleteOne(query)
    res.send(result)
   })
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
  //   console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req,res)=>{
    res.send('job task is running')
})
app.listen(port,()=>{
    console.log(`job task in running on port : ${port}`);
})