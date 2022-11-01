
const nodemailer = require('nodemailer');
const myUser = 'alexcg24600@gmail.com';

const mail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: myUser,
    pass: 'fscastimjinvwjbp',
  },
});

/**
 * emailNotificationHorario
 * @param {*} profesorEmail 
 * @param {*} nameUser 
 * @param {*} adminEmail 
 */
function emailNotificationHorario(profesorEmail, nameUser, adminEmail) {
  const mailOptions = {
    from: myUser,
    bcc: profesorEmail,
    subject: 'Confimación de horario',
    html: `<html>
                    <head>
                        <link href="https://fonts.googleapis.com/css?family=Goudy+Bookletter+1911|Share+Tech" rel="stylesheet">
                    </head>
                    <body style="margin: auto; width: fit-content!important;">
                        <div style="padding: 10px; background: #333c87; border-radius: 17px;">
                            <div style="background-color: #fff; padding: 20px;border-radius: 10px;">
                        
                                <h4 style="font-weight: 400;">
                                El siguiente correo es referenta a la confirmación pendiente resepcto a tu horario para el siguiente semestre.
                            
                                </h4>
                                <container style="align-content: center">
                                    <button type="button" >Ver horario</button>
                                </container>
                                <p style="text-align: center;
                            
                                ">--------------------------</p>
                                <p style="text-align: center; font-size:12px"><br/>
                                This mail is informative, please do not respond to this address, because is is not allowed to recibe messages.</p>
                            </div>
                        </div> 
                    </body>
                </html>`,
  };
  mail.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

const destinatario = 'alex.cg@kalypso.com';


// TODO cambiar 2do y 3er parametro
emailNotificationHorario(destinatario, '1', '2');
