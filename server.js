const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Redis = require('redis');

const redisClient = Redis.createClient();
const app = express();
app.use(cors());
const port = 3000;

const EXPIRATION_TIME = 3600;

app.get('/photos', async(req, res) => {
    const albumId = req.query.albumId;
    
    redisClient.get('photos',async (error,photos) => {
        if(error) console.log(error);
        if(photos!= null) {

            console.log('redis');
            return res.json(JSON.parse(photos))
        }
        else{

            console.log('no redis');
            const {data} = await axios.get('https://jsonplaceholder.typicode.com/photos',
                { params:{ albumId } }
            )
            redisClient.setex('photos' ,EXPIRATION_TIME,JSON.stringify(data) )
            res.json(data)
        }   
    }) 
})


app.get('/photos/:id', async(req, res) => {
    const {data} = await axios.get(
        `https://jsonplaceholder.typicode.com/photos/${req.params.id}`
    
    )
    res.json(data)
})
  

app.listen(port,() => {
    console.log(`lsitening in port:${port}`);
});
