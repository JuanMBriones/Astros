const Clase = require('../../models/clase');
const Profesor = require('../../models/profesor');
const HorarioB = require('../../models/horario_bloque');
const HorarioS = require('../../models/horario_semana');
const ctr = {};

// get all clases
ctr.getClases = () => async (req, res, next) => {
  const clases = await Clase.find().exec();
  console.log(clases);

  try {
    for (let i = 0; i < clases.length; i++) {
      const bloque = await HorarioB.find({_id: {'$in': clases[i].horario}}).exec();
      const semana = await HorarioS.find({_id: {'$in': bloque[0].horario_semana}}).exec();
      const periodos = ['Todo el semestre', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Semana tec 1', 'Semana tec 2', 'Semana 18'];
      const horario = [[periodos[bloque[0].bloque]]];
      semana.forEach((dia) => {
        const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        const hi = dia.hora_inicio.toISOString().slice(11, 16);
        const hf = dia.hora_fin.toISOString().slice(11, 16);
        horario.push([dias[dia.dia-1], hi, hf]);
      });
      clases[i].horario = horario;
    }
    res.status(200).json({clases});
  } catch (err) {
    res.status(200).json({clases});
  }
};

// get clase individual
ctr.getClase = () => async (req, res, next) => {
  const clase = await Clase.findById(req.query.id).exec();
  res.status(200).json({clase});
};

// get profesores que pueden dar una clase
ctr.getProfesores = () => async (req, res, next) => {
  // expected: id clase
  const clase = req.query.clase;
  const claseCip = await Clase.find({id: clase}).distinct('cip').exec();
  const profesores = await Profesor.find({cip: {'$in': claseCip}}).exec();
  profesores.forEach((profesor) => {
    if (profesor.clases.includes(clase)) {
      profesor.asignada = 1;
    } else {
      profesor.asignada = 0;
    }
  });
  console.log(profesores);
  res.status(200).json({profesores});
};

// post clase
ctr.addClass = () => async (req, res, next) => {
  // expected: attributes clase json
  const {
    clave,
    grupoApg,
    materia,
    modelo,
    carga,
    horario, // array
    modalidadGrupo,
    profesor, // array
    cip, // array
    paquete,
    edificio,
    salon,
    tipo,
    semestre,
    periodo,
    ingles,
  } = req.body;

  // const cip = [];

  // create new record
  const newClase = new Clase({
    clave: clave,
    grupo_apg: grupoApg,
    materia: materia,
    propuesta: modelo,
    carga: carga,
    horario: horario,
    modalidad_grupo: modalidadGrupo,
    profesor: profesor,
    cip: cip,
    paquete: paquete,
    edificio: edificio,
    salon: salon,
    tipo: tipo,
    semestre: semestre,
    periodo: periodo,
    ingles: ingles,
  });

  if (await Clase.findOne({clave: clave, grupoApg: grupoApg}).exec()) {
    await Clase.findOneAndUpdate({clave: clave, grupoApg: grupoApg}, {$push: {profesor: profesor},
      clave: clave, grupo_apg: grupoApg, materia: materia, propuesta: modelo, carga: carga, horario: horario,
      modalidad_grupo: modalidadGrupo, paquete: paquete, edificio: edificio, salon: salon, tipo: tipo, semestre: semestre,
      periodo: periodo, ingles: ingles}).exec();
    res.status(200).json({message: 'Clase actualizada'});
  } else {
    await newClase.save();
    res.status(201).json({msg: 'Clase agregada'});
  }
  // update profesor
};

module.exports = ctr;
