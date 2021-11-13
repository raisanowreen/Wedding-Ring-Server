const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors = require('cors');


const app = express();


require('dotenv').config();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ywqs1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
console.log(uri)


async function run(){
    try{
        await client.connect();
        const database = client.db('weddingring');
        const productCollections = database.collection('products');
        const orderCollection = database.collection('orders');
        const reviewCollections = database.collection('reviews');
        const userCollections = database.collection('users');


         // GET PRODUCTS API
app.get('/products', async(req, res)=>{
    const cursor = productCollections.find({});
    const products = await cursor.toArray();
    res.send(products);
})

// POST  PRODUCTS API
app.post('/products', async(req, res)=>{
    const product = req.body;
    console.log('hit the post api', product)
    const result = await productCollections.insertOne(product);
    console.log(result);
    res.json(result);
});

// DELETE PRODUCTS API
app.delete('/products/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: ObjectId(id)};
    const result = await productCollections.deleteOne(query);
    res.json(result);
})

// GET SINGLE Product
app.get('/products/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const product = await productCollections.findOne(query);
    res.json(product);
})

// GET ORDERS API
app.get('/orders', async(req, res)=>{
    const email = req.query.email;
    const query = {email: email}
    const cursor = orderCollection.find(query);
    const orders = await cursor.toArray();
    res.send(orders);
})

 // ADD ORDERS API
 app.post('/orders', async(req, res)=>{
    const order = req.body;
    const result = await orderCollection.insertOne(order);
    res.json(result);
});


// GET ALL ORDERS API
app.get('/allOrders', async(req, res)=>{
    const cursor = orderCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
})

// DELETE ALL ORDERS API
app.delete('/allOrders/:id', async(req, res)=>{
    const id = req.params.id;
    console.log(id);
    const query = {_id: ObjectId(id)};
    const result = await orderCollection.deleteOne(query);
    res.json(result);
})

app.put('/allOrders/:id', (req, res) =>{
    const id = req.params.id;
    const updatedStatus = req.body.status;
    const filter = {_id: ObjectId(id)};
    orderCollection.updateOne(filter, {
        $set: {status: updatedStatus}
    })
    .then(result=>{
res.send(result)
    });
})

     // GET REVIEWS API
app.get('/reviews', async(req, res)=>{
    const cursor = reviewCollections.find({});
    const reviews = await cursor.toArray();
    res.send(reviews);
})

// POST REVIEWS API
app.post('/reviews', async(req, res)=>{
    const review = req.body;
    console.log('hit the post api', review)
    const result = await reviewCollections.insertOne(review);
    console.log(result);
    res.json(result);
});


// GET MY ORDERS API
app.get('/users/:email', async(req, res)=>{
    const email = req.params.email;
    const query = {email: email};
    const user = await userCollections.findOne(query);
    let isAdmin = false;
    if(user?.role === 'admin'){
        isAdmin= true;
    }
    res.json({admin: isAdmin});
})


// POST ALL USERS API
  app.post('/users', async(req, res)=>{
      const user = req.body;
    //   const filter = {email: user.email};
    //   const options = {upsert: true};
    //   const updateDoc = {$set = user};
const result = await userCollections.insertOne(user);
// const result = await userCollections.updateOne(filter,updateDoc, options);
res.json(result);
  });
  
//   UPDATE USERS ROLE API
  app.put('/users/admin', async(req, res) =>{
      const user = req.body;
      console.log(user)
      const filter = {email: user.email};
      const updateDoc = {$set: {role: 'admin'}}
      const result = await userCollections.updateOne(filter, updateDoc);
      res.json(result);
  })


    }
    finally{

    }
}
run().catch(console.dir);

app.get('/', (req,res) =>{
    res.send('Wedding ring server is running');
});

app.listen(port, ()=>{
    console.log('Server running at port', port);
});