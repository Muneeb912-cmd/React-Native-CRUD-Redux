const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require("./routes/userRoute");

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const corsOptions = {
  origin: '*',  // Adjust this based on your frontend URL
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204,
  allowedHeaders: 'Content-Type,Authorization',
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.send('Hello from Development environment!');
});

app.use('/api', userRoutes);

const PORT = process.env.PORT || 3001;

// Switch from HTTPS to HTTP for now
app.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
});
