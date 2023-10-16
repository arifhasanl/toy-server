const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const e = require('express');
require('dotenv').config()
const port = process.env.PORT || 5000;

//middelawer

// const corsConfig = {
//   origin: '*',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE']
// }
app.use(cors())
// app.options("", cors(corsConfig))
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.2qyatsn.mongodb.net/?retryWrites=true&w=majority`;

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
    const toysCloction = client.db('ToyShop').collection('alltoy')
    //update
    // app.get('/toys/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const query={_id:new ObjectId(id)};
    //   const result=await toysCloction.findOne(query);
    //   res.send(result)
    // })
    // app.put('/updateToys/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const filter={_id:new ObjectId(id)};
    //   const options={upsert:true};
    //   const updateToy=req.body;
    //    const toy={
    //     $set:{
    //       toyName:updateToy.toyName,
    //       img:updateToy.img,
    //       email:updateToy.email,
    //       sellerName:updateToy.sellerName,
    //       retting:updateToy.retting,
    //       quantity:updateToy.quantity,
    //       price:updateToy.price,
    //       select:updateToy.select,
    //       description:updateToy.description
    //     }
    //    }
    // const result=await toysCloction.updateOne(filter,toy,options)
    // res.send(result)
    // })

    //delete toys
    // app.delete('/toysDelete/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   const query={_id:new ObjectId(id)}
    //   const result=await toysCloction.deleteOne(query);
    //   res.send(result)
    // })


    //booking
    app.get('/toys', async (req, res) => {
      const query = {};
      const options = {
        // sort matched documents in descending order by rating
        sort: { "price": -1 },
      };
      const result = await toysCloction.find(query, options).toArray();

      res.send(result)
    })

    app.get('/toysCetegory', async (req, res) => {
      const category = req.query.category;
      const query = { category: category }
      if (category === 'all') {
        const result = await toysCloction.find().toArray();
        res.send(result);
      } else {
        const result = await toysCloction.find(query).toArray();

        res.send(result)
      }


    })
    app.get('/toydetail/:id', async (req, res) => {
      const id = req.params.id;

      const query = { _id: new ObjectId(id) }
      const result = await toysCloction.findOne(query);
      res.send(result)
    })
    app.delete('/toyDelete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCloction.deleteOne(query);
      res.send(result)
    })
    app.put('/updateToy/:id', async (req, res) => {
      const updateToy = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true }
      const toy = {
        $set: {
          toyName: updateToy.toyName,
          img: updateToy.img,
          email: updateToy.email,
          sellerName: updateToy.sellerName,
          retting: updateToy.retting,
          quantity: updateToy.quantity,
          price: updateToy.price,
          select: updateToy.select,
          description: updateToy.description
        }
      }
      const result=await toysCloction.updateOne(filter,toy,options);
      res.send(result)
    })
    app.get('/mytoys/:email', async (req, res) => {
      const email = req.params.email;
      console.log(email);
      if (email) {
        const result = await toysCloction.find({ email: email }).toArray();
        res.send(result)
      }
    })

    app.post('/addtoy', async (req, res) => {
      const body = req.body;
      console.log(body);
      const result = await toysCloction.insertOne(body);
      res.send(result)
    })


    // app.get('/toysEmail/:email',async(req,res)=>{
    //   const query=req.params.email;
    //   if(query){
    //     const result=await toysCloction.find({email:query}).toArray();
    //     res.send(result)
    //   }
    // })
    // app.get('/toyDetails/:id',async(req,res)=>{
    //   const id=req.params.id;
    //   console.log(id);
    //   const query={_id:new ObjectId(id)}
    //   const result=await toysCloction.findOne(query);
    //   res.send(result);
    // })
    // app.post('/toys',async(req,res)=>{
    //   const newToys=req.body;
    //   const result=await toysCloction.insertOne(newToys);
    //   res.send(result)
    // })


    // Send a ping to confirm a successful connection

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('server is running ')
})
app.listen(port, () => {
  console.log('sport server is running');
})


