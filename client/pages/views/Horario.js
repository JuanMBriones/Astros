/* eslint-disable require-jsdoc, react/jsx-key */
import React, {useEffect, useState} from 'react';
import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import {useRouter} from 'next/router';
import {ViewState} from '@devexpress/dx-react-scheduler';
import {Scheduler, WeekView, Appointments, Resources} from '@devexpress/dx-react-scheduler-material-ui';
import {motion} from 'framer-motion';

const instances = [
  {id: 0, color: '#9575cd'},
  {id: 1, color: '#2196f3'},
  {id: 2, color: '#00796b'},
  {id: 3, color: '#ffb300'},
  {id: 4, color: '#f06292'},
  {id: 5, color: '#4dd0e1'},
  {id: 6, color: '#cddc39'},
  {id: 7, color: '#8d6e63'},
  {id: 8, color: '#78909c'},
  {id: 9, color: '#fff176'},
  {id: 10, color: '#9ccc65'},
  {id: 11, color: '#01579b'},
];

const resources = [{
  fieldName: 'id',
  title: 'Id',
  instances: instances,
}];

const dias = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
const periodos = ['Todo el semestre', 'Periodo 1', 'Periodo 2', 'Periodo 3', 'Semana tec 1', 'Semana tec 2', 'Semana 18'];

export default function Horario() {
  const {asPath} = useRouter();
  const [profesor, setProfessor] = useState([]);
  const [materiasBloque, setMaterias] = useState([]);
  const [materiasTodas, setAllMaterias] = useState([]);
  const [warnings, setWarning] = useState([]);
  const [periodo, setPeriodo] = useState(1);
  const [appointments, setAppointments] = useState([]);

  function getMateriasParcial(numParcial, mat) {
    setAppointments([]);
    const materiasParcial = [];
    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].horario.length; j++) {
        if (mat[i].horario[j].bloque == numParcial || mat[i].horario[j].bloque == 0) {
          materiasParcial.push(mat[i]);
        }
      }
    }
    setMaterias(materiasParcial);
    setPeriodo(numParcial);
  }

  useEffect(() => {
    const mats = [];
    for (let i = 0; i < materiasBloque.length; i++) {
      for (let j = 0; j < materiasBloque[i].horario[0].horario_semana.length; j++) {
        const horaInicio = new Date(materiasBloque[i].horario[0].horario_semana[j].hora_inicio);
        const horaFin = new Date(materiasBloque[i].horario[0].horario_semana[j].hora_fin);
        const dia = materiasBloque[i].horario[0].horario_semana[j].dia;
        mats.push({
          title: materiasBloque[i].materia,
          startDate: new Date(2022, 7, dia, horaInicio.getUTCHours(), horaInicio.getUTCMinutes()),
          endDate: new Date(2022, 7, dia, horaFin.getUTCHours(), horaFin.getUTCMinutes()),
          color: '#ff0000',
          id: i,
        });
      }
    }
    setAppointments(mats);
  }, [materiasBloque]);

  /**
   * getSanitizedPath - Sanitizes the path to remove the query params
   * @param {*} urlPath
   * @return {String}
   */
  function getSanitizedPath(urlPath) {
    return urlPath.split('?')[1].split('=')[1];
  }


  useEffect(() => {
    console.log('asPath', asPath);
    // const path = getSanitizedPath(useRouter().asPath);
    let nomina = null;
    if (asPath.includes('?')) {
      nomina = getSanitizedPath(asPath);
    } else {
      nomina = JSON.parse(localStorage.getItem('selectedProfesor')).nomina;
    }
    const getMateriasProfe = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/horarioProf?profesor=` + nomina);
      console.log('res', res);
      const materias = res.data.horarioProf;
      setAllMaterias(materias);
      setMaterias(materias);
      getMateriasParcial(1, materias);
    };
    getMateriasProfe();

    const getWarnings = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/warnings?profesor=` + nomina);
      const warningArr = res.data.message.length < 1 ? ['No hay advertencias.'] : res.data.message;
      setWarning(warningArr);
    };
    getWarnings();

    const getDataProfe = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profe?profesor=` + nomina);
      setProfessor(res.data.profe);
    };
    getDataProfe();
  }, []);

  function handleMail() {
    console.log(profesor);
    console.log(profesor.correo);
    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/sendEmail?mail=${profesor.correo}`);
  }
  return (
    <>
      <motion.div
        animate={{x: 100}}
        transition={{ease: 'easeOut', duration: 2}}
      >
        {
          profesor ? (
            <div>
              <>
                <center>
                  <h1>{profesor.nombre + ' - ' + profesor.nomina}</h1>
                  <h2>Horario {periodos[periodo]}</h2>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(1, materiasTodas)}>Periodo 1</Button>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(4, materiasTodas)}>Semana Tec 1</Button>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(2, materiasTodas)}>Periodo 2</Button>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(5, materiasTodas)}>Semana Tec 2</Button>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(3, materiasTodas)}>Periodo 3</Button>
                  <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(6, materiasTodas)}>Semana 18</Button>
                </center><div style={{width: '100%'}}>
                  <Box sx={{display: 'flex', justifyContent: 'space-evenly', p: 1, m: 1, bgcolor: 'background.paper', borderRadius: 1}}>
                    <div style={{padding: 20}}>
                      <h2 style={{color: 'red'}}>WARNINGS</h2>
                      <ul>
                        {warnings.map((warning) => (
                          <li key={warning}>{warning}</li>
                        ))}
                      </ul>

                      {materiasBloque.map((materia, index) => (
                        <Box sx={{display: 'flex', flexDirection: 'column'}}>
                          <Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
                            <h2 style={{color: instances[index].color, backgroundColor: instances[index].color}}>_____  </h2>
                            <h2 style={{paddingLeft: 5}}>{materia.materia}</h2>
                          </Box>
                          {materia.horario.map((horarioBloque) => (
                            <p style={{marginBlockStart: 0}}>
                      Se imparte en: {periodos[horarioBloque.bloque]}
                              {horarioBloque.horario_semana.map((dia) => (
                                <div>Día: {dias[dia.dia - 1]} {dia.hora_inicio.match(/[0-9]{2}:[0-9]{2}/)[0]} a {dia.hora_fin.match(/[0-9]{2}:[0-9]{2}/)[0]}</div>
                              ))}
                            </p>
                          ))}
                        </Box>
                      ))}
                    </div>

                    <div style={{padding: 20, width: '60%'}}>
                      <Scheduler
                        data={appointments}
                        locale="es-ES"
                      >
                        <ViewState
                          defaultCurrentDate="2022-08-01" />
                        <WeekView
                          startDayHour={7}
                          endDayHour={22}
                          excludedDays={[0, 6]} />
                        <Appointments />
                        <Resources
                          data={resources} />
                      </Scheduler>
                    </div>

                  </Box>
                  <center style={{padding: 10}}>
                    <Button variant="contained" style={{padding: 10}} endIcon={<SendIcon />} onClick={handleMail}> Enviar Horario</Button>
                  </center>
                </div></>

            </div>
          ) : (
            <div>
              loading...
            </div>
          )
        }
      </motion.div>
    </>
  );
}
