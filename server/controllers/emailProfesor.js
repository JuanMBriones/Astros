const nodemailer = require('nodemailer');

const mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASS,
  },
});

// Datos del semestre
const periodo = 'Febrero-Junio 2023';
const fechaInicio = '13 de Febrero';
const fechasPeriodosAcademicos = 'Planes anteriores(17 semanas): Febrero 13 – Junio 16';
/**
 * emailNotificationHorario
 * @param {*} profesorEmail
 */
function emailNotificationHorario(profesorEmail) {
  console.log("Correo enviado")
  const mailOptions = {
    from: process.env.EMAILSENDER,
    to: profesorEmail,
    subject: 'Confimación de horario',
    html: `
    <html>
                    <head>
                        <link href="https://fonts.googleapis.com/css?family=Goudy+Bookletter+1911|Share+Tech" rel="stylesheet">
                    </head>
        <body>
          <p>Buenos días, <br>
            A nombre del Departamento de Computación nos da gusto saludarte nuevamente. Se está iniciando la programación de grupos para el próximo semestre <b>`+periodo+`.</b>

            <br>
            <br>

            El semestre ahora inicia el <b>`+fechaInicio+`</b>, las fechas de los distintos períodos académicos son las siguientes: 
            <li>`+fechasPeriodosAcademicos +`</li>
            <br>
            Para conocer los grupos en los que te estamos considerando te pido que accedas con tu cuenta @tec.mx a la siguiente liga: <a href="https://schedule-pied.vercel.app/"> Ver horario</a>

          </p>
        </body>
    </html>
                `,
  };
  mail.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = emailNotificationHorario;