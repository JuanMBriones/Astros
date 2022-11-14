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

ctr.addClass = () => async (req, res, next) => {
  // expected: id clase, id profesor
  const {
    clave,
    grupoApg,
    materia,
    modelo,
    carga,
    horario, // array
    modalidadGrupo,
    profesor, // array
    cip,
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
    cip: cip.split('/'),
    paquete: paquete,
    edificio: edificio,
    salon: salon,
    tipo: tipo,
    semestre: semestre,
    periodo: periodo,
    ingles, ingles,
  });


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
  } else {
    await newClase.save();
    res.status(201).json({msg: 'Clase agregada'});
  }
  // update profesor
};

module.exports = ctr;
