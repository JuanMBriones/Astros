/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import axios from 'axios';
import Calendario from '../components/Calendario';


export default function Horario() {
  const [professors, setProfessor] = useState([]);
  const [materias, setMaterias] = useState([]);
 
  var materiasParcial = []

  async function getMateriasParcial(numParcial, mat){
    console.log("hola---------------------------")

    for (let i = 0; i < mat.length; i++) {
      for (let j = 0; j < mat[i].horario.length; j++) {
        if(mat[i].horario[j].bloque == numParcial || mat[i].horario[j].bloque == 0) {
          materiasParcial.push(mat[i]);
          console.log(mat[i].horario)
        }
      }
    }

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
      //console.log(res.data.horarioProf);

      const materias = res.data.horarioProf;
      setMaterias(res.data.horarioProf);
      getMateriasParcial(1, materias);

    }

    
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
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(1, materias)}>Periodo 1</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(4, materias)}>Semana Tec 1</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(2, materias)}>Periodo 2</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(5, materias)}>Semana Tec 2</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(3, materias)}>Periodo 3</Button>
        <Button variant="outlined" style={{margin: 3}} onClick={() => getMateriasParcial(6, materias)}>Semana 18</Button>
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
            
          
          {materias.map((materia) => (
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
