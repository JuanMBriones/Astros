require('dotenv').config();

const express = require('express');
const app = express();
const dbConfig = require('./dbConfig');
const sendAsJSON = require('./middleware/sendAsJson');
const eHandler = require('./middleware/errorHandler');
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(require('cors')());

// initialize db
dbConfig();

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello from Astros index route!',
  });
});

app.use('/api', require('./controllers/Profesor'));

app.use('/api', require('./controllers/Clase'));

// error handling middleware
app.use(eHandler());
app.use(sendAsJSON());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
