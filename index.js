const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

require('dotenv').config()
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ysvsi.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/',(req,res)=>{
    res.send('hellow world')
})


client.connect(err => {
    const productCollection = client.db("onlineStore").collection("products");
    const orderCollection = client.db("onlineStore").collection("orders")
        
    app.post('/addProduct',(req,res)=>{
        const products = req.body
        productCollection.insertMany(products)
        .then(result=>{
            res.send(result.insertedCount)
        })
    })

    app.get('/products',(req,res)=>{
        productCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })
    app.get('/product/:key',(req,res)=>{
        productCollection.find({key:req.params.key})
        .toArray((err,documents)=>{
            res.send(documents[0])
        })
    })

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        productCollection.find({key: { $in: productKeys} })
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder',(req,res)=>{
        const orders = req.body
        orderCollection.insertOne(orders)
        .then(result=>{
            res.send(result.insertedCount > 0)
        })
    })
    
  });



app.listen(5000,()=>console.log('lissinting to port 5000'))