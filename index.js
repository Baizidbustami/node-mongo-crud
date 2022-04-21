const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// delet part নিচের লাইনটা
const ObjectId = require('mongodb').ObjectId;


app.use(cors());
app.use(express.json());

//name:  dbuser1
//password:  wx1SrxkvAwiqd4o5


const uri = "mongodb+srv://dbuser1:wx1SrxkvAwiqd4o5@cluster0.0opme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const usersCollection = client.db('foodExpress').collection("users");

        // নিচের কাজটা করলে আমরা লোকাল হোস্টে আমাদের সব গুলো ডাটাকে দেখতে পারব।
        app.get('/user', async(req,res) => {
            const query = {};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        //Post User : add a new user নিচের কাজটা করলে আমরা ডাটাবেসে ডাটা টাকে দেখতে পারব 
        app.post('/user', async(req, res) =>{
            const newUser = req.body;
            console.log('adding new user', newUser);
            
            // ৬ নিচের ২ লাইন
            const result = await usersCollection.insertOne(newUser);
            res.send(result)

            // এটা ৫ এর কাজ
            // res.send({result: 'success'})
        });

        // delete a user
        app.delete('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId (id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        // Updet Data
        app.get('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.findOne(query);
            res.send(result);
        })

        // নিচের তিন লাইলে আগের স্টেপে কাজ করে চেক করতে হয় ডটাবেসে তৈরি হচ্ছে কি না
        // const user = { name: 'mohona nodi', email: 'mohona@gmail.com' };
        // const result = await usersCollection.insertOne(user);
        // console.log(`user insert with id: ${result.insertedId}`)
    }
    finally {
        // await client.close();

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running My NOde CRUD Server');
});

app.listen(port, () => {
    console.log('CRUD Server is running')
});