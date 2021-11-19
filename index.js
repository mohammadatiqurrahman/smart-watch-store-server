const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ql7ij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("watchSeller");
        const productCollection = database.collection('allProducts');
        const myOrders = database.collection('order_info');
        const reviewsCollection = database.collection('reviews');
        // GET ALL PRODUCTS FROM DATABASE
        app.get('/getProducts', async (req, res) => {
            const cursor = productCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
            
        })
        // GET SINGLE PRODUCTS FROM DATABASE
        app.get('/single_products/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result= await productCollection.findOne(query)
            // console.log('get id: ',id);
            res.send(result)
          })
        //   GET ALL ORDERD PRODUCTS BY SPECIFIC USER
        app.get('/my_orders', async (req, res) => {
            const email = req.query.email
            const query = {email: email}
            const cursor = myOrders.find(query);
            const result = await cursor.toArray();
            res.send(result);
            
        })
        //   GET ALL ORDERD PRODUCTS BY USER
        app.get('/manage_orders', async (req, res) => {
            const manageOrders = myOrders.find({});
            const result = await manageOrders.toArray();
            res.send(result);
            
        })
        app.get('/reviews', async (req, res) => {
            const reviews = reviewsCollection.find({});
            const result = await reviews.toArray();
            res.send(result);
            
        })
        // ADD PRODUCTS TO DATABASE
        app.post('/addProducts', async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product)
            res.json(result);
        })
        // POST ORDERS FROM USER TO DATABASE
        app.post('/my_orders', async (req, res) => {
            const orders = req.body;
            const result = await myOrders.insertOne(orders)
            res.json(result);
        })
        // POST PRODUCT REVIEWS FROM USER TO DATABASE
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewsCollection.insertOne(reviews)
            // console.log('review hitted');
            // console.log('review hitted', reviews);
            res.json(result);
        })
        // DELETE ORDERS
        // DELETE USER API

        app.delete('/delete_orders/:id',async(req,res)=>{
            const id=req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await myOrders.deleteOne(query)
            // console.log(result);
            res.json(result);
          })
    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server Choltase!')
})
app.listen(port, () => {
    console.log('server running on port', port);
})
