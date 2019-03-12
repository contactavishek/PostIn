const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect("mongodb://contactavishek:" + process.env.MONGO_ATLAS_PW +
"@posts-shard-00-00-lzsli.mongodb.net:27017,posts-shard-00-01-lzsli.mongodb.net:27017,posts-shard-00-02-lzsli.mongodb.net:27017/node-angular?ssl=true&replicaSet=Posts-shard-0&authSource=admin&retryWrites=true", { useNewUrlParser: true })
   .then(() => {
     console.log("Connected to database!");
   })
   .catch(() => {
     console.log('Connection failed!');
   });

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('backend/images')));

// MongoDB Atlas secure password : qVtfDpVmbV3NIa1m
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET, POST, PATCH, PUT, DELETE, PUT, OPTIONS"
  );
  next();
});

app.use('/api/posts', postRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
