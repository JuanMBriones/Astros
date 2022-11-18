require('dotenv').config();

const emailNotificationHorario = require('./controllers/emailProfesor');
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

app.get('/sendEmail', (req, res ) => {
  const mail = req.query.mail;
  emailNotificationHorario(mail);
  res.json({
    msg: mail,
  });
});

app.get('/deleteAll', async (req, res) => {
  const Clase = require('./models/clase');
  const Profesor = require('./models/profesor');
  const HorarioB = require('./models/horario_bloque');
  const HorarioS = require('./models/horario_semana');

  await Profesor.deleteMany({}).exec();
  await Clase.deleteMany({}).exec();
  await HorarioB.deleteMany({}).exec();
  await HorarioS.deleteMany({}).exec();

  res.status(200).json({
    message: 'Base de datos eliminada :D',
  });
});

app.use('/api', require('./controllers/Profesor'));

app.use('/api/clase', require('./controllers/Clase'));

app.use('/api', require('./controllers/auth'));

// error handling middleware
app.use(eHandler());
app.use(sendAsJSON());

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
