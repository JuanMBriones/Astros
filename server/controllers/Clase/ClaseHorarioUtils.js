/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
const HorarioB = require('../../models/horario_bloque');
const HorarioS = require('../../models/horario_semana');
// "LuMa 12:30-13:30 / JuVi 10:00-12:00"

// Obj1
// horario bloque 1
// horario_semana
// dia: 1
// hora inicio 12:30
// hora fin 13:30
// horario_semana
// dia: 2
// hora inicio 12:30
// hora fin 13:30

async function parseDate(date, bloque) {
  const days = date[0].split(/(?=[A-Z])/);
  const hours = date[1].split('-');

  const horaInicio = hours[0];
  const horaFin = hours[1];

  const daysIdx = {
    'Lu': 1,
    'Ma': 2,
    'Mi': 3,
    'Ju': 4,
    'Vi': 5,
    'Sa': 6,
    'Do': 7,
  };

  console.log({'hI': horaInicio, 'hF': horaFin});
  // [ 'Lu', 'Ma', 'Vi', 'Ko' ]
  // [ '12:30', '13:30' ]
  const horarios = [];
  for (let i=0; i<days.length; i++) {
    const day = days[i];
    // days.forEach(async (day) => {
    const dayNum = daysIdx[day];
    // new Date(2022, 7, dia, horaInicio.getUTCHours(), horaInicio.getUTCMinutes())
    // create new horario_semana
    const newHorarioSemana = new HorarioS({
      hora_inicio: `2022-02-08T${horaInicio}:00`,
      hora_fin: `2022-02-08T${horaFin}:00`,
      dia: dayNum,
    });

    /* await newHorarioSemana.save().then((newHorario) => {
      horarios.push(newHorario._id);
    }); */
    horarios.push((await newHorarioSemana.save())._id);

    console.log(horarios);
  } // })

  const newHorarioBloque = new HorarioB({
    bloque: bloque,
    horario_semana: horarios,
  });

  await newHorarioBloque.save();
}

async function createDates(dateExpression, bloque) {
  const bloques = dateExpression.split('/');

  bloques.forEach(async (element) => {
    await parseDate(element.trim().split(' '), bloque);
  });
}

module.exports = {
  createDates,
  parseDate,
};
