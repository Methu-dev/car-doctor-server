const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// midleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res)=>{
    res.send('doctor is running')
})


console.log(process.env.DB_USER);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PaSS}@cluster0.dkacxyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
   
    const servicesCollection = client.db('carDoctor').collection('services');
    const bookingCollection = client.db('carDoctor').collection('bookings');
      
    app.get('/services', async(req, res)=>{
        const cursor = servicesCollection.find();
        const result = await cursor.toArray()
        res.send(result)
    })
     

    app.get('/services/:id', async (req, res)=>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
          console.log(query);
          
        const options = {
           
            projection: { title: 1, 
                price: 1, 
                service_id: 1,
                 },
          };


        const result = await servicesCollection.findOne(query, options);
        res.send(result)
    })

    //bokings
    app.post('/bookings', async (req, res)=>{
      const boking = req.body;
      console.log(boking)
      const result = await bookingCollection.insertOne(boking)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, ()=>{
    console.log(`doctor server is running port on: ${port}`)
})