const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3001;
const db = require('./db');
const path = require('path');
const AppRouter = require('./routes/AppRouter');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

require('dotenv').config();
require('./db/index');

const app = express();


const allowedOrigins = ['https://benika.vercel.app'];


const corsOptions = {
  origin: function (origin, callback) {
  
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json())

app.use(logger(`dev`))
app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(cookieParser())
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  next()
})


app.get('/', (req, res) => {
  res.send('server working')
})


app.use(`/`, AppRouter)

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`)
})
