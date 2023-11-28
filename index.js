const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.01a84k1.mongodb.net/?retryWrites=true&w=majority`;

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

    const addCampCollection = client.db('MedicalCamp').collection('addCamp');
    const userCollection = client.db('MedicalCamp').collection('users');
    const joinCampCollection = client.db('MedicalCamp').collection('joinCamp');



    // user related item

    app.get('/users', async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.post('/users', async (req, res) => {
      const user = req.body;
      const query = { email: user.email }
      const existingUser = await userCollection.findOne(query)
      if (existingUser) {
        return res.send({message: 'User Already Exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user)
      res.send(result);
    })


    // join camp related api item

    app.post('/joinCamp', async (req, res) => {
      const item = req.body;
      const result = await joinCampCollection.insertOne(item);
      res.send(result);
    })



    // Add Camp Related Item ...

    app.get('/addCamp', async (req, res) => {
      const result = await addCampCollection.find().toArray();
      res.send(result);
    })

    app.get('/addCamp/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await addCampCollection.findOne(query)
      res.send(result);
    })

    app.post('/addCamp', async (req, res) => {
      const item = req.body;
      const result = await addCampCollection.insertOne(item);
      res.send(result);
    })

    app.patch('/addCamp/:id', async (req, res) => {
      const item = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          name: item.name,
          date: item.date,
          audience: item.audience,
          fees: item.fees,
          health: item.health,
          location: item.location,
          service: item.service,
          description: item.description,
          image: item.image
        }
      }
      const result = await addCampCollection.updateOne(filter, updateDoc)
      res.send(result);
    })

    app.delete('/addCamp/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCampCollection.deleteOne(query);
      res.send(result);
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


app.get('/', (req, res) => {
  res.send('Medical Camp is Running')
})

app.listen(port, () => {
  console.log(`Medical Camp is Running on port ${port}`);
})