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


         // GET Products API
app.get('/products', async(req, res)=>{
    const cursor = productCollections.find({});
    const products = await cursor.toArray();
    res.send(products);
})

// POST API
app.post('/products', async(req, res)=>{
    const product = req.body;
    console.log('hit the post api', product)
    const result = await productCollections.insertOne(product);
    console.log(result);
    res.json(result);
});


// GET SINGLE Product
app.get('/products/:id', async(req, res)=>{
    const id = req.params.id;
    const query = {_id: ObjectId(id)};
    const product = await productCollections.findOne(query);
    res.json(product);
})

// GET ORDERS API
app.get('/orders', async(req, res)=>{
    const cursor = orderCollection.find({});
    const orders = await cursor.toArray();
    res.send(orders);
})

  // ADD ORDERS API
    app.post('/orders', async(req, res)=>{
        const order = req.body;
        const result = await orderCollection.insertOne(order);
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