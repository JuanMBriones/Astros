/* eslint-disable require-jsdoc, max-len, no-unused-vars, react/jsx-key */
import React, {useEffect, useState} from 'react';
import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import {Calendario, mats} from '../components/Calendario';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';


export default function Horario() {
  const [professors, setProfessor] = useState([]);
  const [materiasBloque, setMaterias] = useState([]);
  const [materiasTodas, setAllMaterias] = useState([]);

  function getMateriasParcial(numParcial, mat) {
    const materiasParcial = [];
    console.log('hola---------------------------');

    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].horario.length; j++) {
        if (mat[i].horario[j].bloque == numParcial || mat[i].horario[j].bloque == 0) {
          materiasParcial.push(mat[i]);
          console.log(mat[i].materia);
        }
      }
    }
    setMaterias(materiasParcial);
    mats(materiasParcial);
  }

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(
        'http://localhost:3001/api/horarioProf/',
        {
          params: {
            profesor: 'L00000000',
          },
        },
      );

      const materias = res.data.horarioProf;
      setAllMaterias(materias);
      setMaterias(materias);
      getMateriasParcial(1, materias);
    };

    getData();


    const getDataProfessors = async () => {
      const res = await axios.get('http://localhost:3001/api/profesores');
      setProfessor(res.data.allProfessors);
    };

    getDataProfessors();
  }, []);

  return (
    <div>
      <center>
        {
          professors.map((professor) => (
            <div key={professor._id}>
              <h1>{professor.nombre}</h1>
            </div>
          ))
        }<h2>Horario</h2>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(1, materiasTodas)}>Periodo 1</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(4, materiasTodas)}>Semana Tec 1</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(2, materiasTodas)}>Periodo 2</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(5, materiasTodas)}>Semana Tec 2</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(3, materiasTodas)}>Periodo 3</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(6, materiasTodas)}>Semana 18</Button>
      </center>

      <div style={{width: '100%'}}>
        <Box sx={{display: 'flex',
          justifyContent: 'space-evenly',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1}}>
          <div style={{padding: 20}}>
            <h2 style={{color: 'red'}}>WARNINGS</h2>
            <ul>
              <li>Aqui van todas las advertencias que tenga el profesor</li>
            </ul>


            {materiasBloque.map((materia) => (
              <Box sx={{display: 'flex',
                flexDirection: 'column'}}>
                <Box sx={{display: 'flex',
                  justifyContent: 'flex-start'}}>
                  <h2 style={{color: '#9575cd', backgroundColor: '#9575cd'}}>_____  </h2>
                  <h2>{materia.materia}</h2></Box>
                <p> Dias, Hora, Periodo donde se imparte</p>
              </Box>
            ))
            }
          </div>
          <div style={{padding: 20, width: '60%'}}><Calendario/></div>

        </Box>

      </div>

    </div>

  );
}
