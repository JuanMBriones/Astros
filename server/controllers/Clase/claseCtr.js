const Clase = require('../../models/clase');
const Profesor = require('../../models/profesor');
const HorarioB = require('../../models/horario_bloque');
const HorarioS = require('../../models/horario_semana');
const claseUtils = require('./ClaseHorarioUtils');
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

ctr.removeClass = () => async (req, res, next) => {
  // expected: attributes clase json
  const {id} = req.body;
  try {
    await Clase.findOneAndDelete({_id: id}).exec();
    res.status(200).json({msg: 'Clase eliminada'});
  } catch (err) {
    console.logg(err);
    res.status(200).json({msg: 'Error al eliminar clase'});
  }
};

// post clase
ctr.addClass = () => async (req, res, next) => {
  // expected: attributes clase json
  let {
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

  if (!(clave && grupoApg && materia)) {
    res.status(400).json({msg: 'Missing required fields'});
    return;
  }

  console.log(clave,
    grupoApg,
    materia,
    modelo,
    carga,
    horario, // array
    modalidadGrupo,
    profesor, // array
    cip,
    paquete,
    edificio, // empieza a fallar desde aqui
    salon,
    tipo,
    semestre,
    periodo,
    ingles);

  if (cip) {
    cip.split('/');
  }

  const mapPeriodos = {'PMT1': 1, 'PMT2': 2, 'PMT3': 3, 'PMT4': 4, 'PMT5': 5, 'PMT6': 6};
  if (modelo == 'Tec 20') {
    periodo = 0;
  } else {
    periodo = mapPeriodos[periodo];
  }

  const horarioDB = await claseUtils.createDates(horario, periodo);

  // create new record
  const newClase = new Clase({
    clave: clave,
    grupo_apg: grupoApg,
    materia: materia,
    propuesta: modelo,
    carga: carga,
    horario: horarioDB,
    modalidad_grupo: modalidadGrupo,
    profesor: profesor,
    cip: cip,
    paquete: paquete,
    edificio: edificio,
    salon: salon,
    tipo: tipo,
    semestre: semestre,
    periodo: periodo,
    ingles, ingles,
  });


  /*
  const clase = await Clase.findOne({clave: clave, grupoApg: grupoApg}).exec();

  if (clase) {
    clase.materia = materia;
    clase.propuesta = modelo;
    clase.carga = carga;
    clase.horario = horario;
    clase.modalidad_grupo = modalidadGrupo;
    clase.paquete = paquete;
    clase.edificio = edificio;
    clase.salon = salon;
    clase.tipo = tipo;
    clase.semestre = semestre;
    clase.periodo = periodo;
    clase.ingles = ingles;

    // push if not already in database
    console.log('Clase already exists');
    // get class
    if (!clase.profesor.includes(profesor)) {
      clase.profesor.push(profesor);
    }

    // push cip
    cip.split('/').forEach((cipElement) => {
      if (!clase.cip.includes(cipElement)) {
        clase.cip.push(cipElement);
      }
    });

    // save
    await clase.save();
    res.status(200).json({msg: 'Clase updated'});
*/

  if (await Clase.findOne({clave: clave, grupoApg: grupoApg}).exec()) {
    await Clase.findOneAndUpdate({clave: clave, grupoApg: grupoApg}, {$push: {profesor: profesor},
      clave: clave, grupo_apg: grupoApg, materia: materia, propuesta: modelo, carga: carga, horario: horarioDB,
      modalidad_grupo: modalidadGrupo, paquete: paquete, edificio: edificio, salon: salon, tipo: tipo, semestre: semestre,
      periodo: periodo, ingles: ingles}).exec();
    res.status(200).json({message: 'Clase actualizada'});
  } else {
    await newClase.save();
    res.status(201).json({msg: 'Clase agregada'});
  }
  // update profesor
};

ctr.parseSchedule = () => async (req, res, next) => {
  const {
    periodo,
    horario,
  } = req.body;
  // 'LuMa 12:30-13:30 / JuVi 10:00-12:00'
  const horarioDB = await claseUtils.createDates(horario, periodo); // TODO: Cambiar el valor del parametro por el Periodo (PTM1, etc)
  console.log('adiosss');
  console.log(horarioDB);
  const newClase = new Clase({
    clave: 'TC1463',
    horario: horarioDB,
  });
  await newClase.save();
  res.status(201).json({msg: 'Clase agregada'});
};


module.exports = ctr;
