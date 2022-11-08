
const nodemailer = require('nodemailer');
const myUser = 'a00824742@tec.mx';

const mail = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: myUser,
    pass: 'Alex.24==6',
  },
});

// Datos del semestre
let periodo = 'Febrero-Junio 2023'
let fechaInicio = '13 de Febrero'
let fechasPeriodosAcademicos = 'Planes anteriores(17 semanas): Febrero 13 – Junio 16'
/**
 * emailNotificationHorario
 * @param {*} profesorEmail
 * @param {*} nameUser
 * @param {*} adminEmail
 */
function emailNotificationHorario(profesorEmail, nameUser, adminEmail) {
  const mailOptions = {
    from: myUser,
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
            Para conocer los grupos en los que te estamos considerando te pido que accedas con tu cuenta @tec.mx a la siguiente liga: <a href="#"> Ver horario</a>

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

const destinatario = 'alexcg24600@gmail.com';


// TODO cambiar 2do y 3er parametro
emailNotificationHorario(destinatario, '1', '2');
