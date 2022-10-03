/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import React from 'react';
import {Button} from '@mui/material';
import Box from '@mui/material/Box';
import Calendario from '../components/Calendario';

export default function Horario() {
  return (
    <div>
      <center>
        <h1>Horario de Nombre Profesor</h1>
        <Button variant="outlined" style={{margin: 3}}>Periodo 1</Button>
        <Button variant="outlined" style={{margin: 3}}>Semana Tec 1</Button>
        <Button variant="outlined" style={{margin: 3}}>Periodo 2</Button>
        <Button variant="outlined" style={{margin: 3}}>Semana Tec 2</Button>
        <Button variant="outlined" style={{margin: 3}}>Periodo 3</Button>
        <Button variant="outlined" style={{margin: 3}}>Semana 18</Button>
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
            <Box sx={{display: 'flex',
              justifyContent: 'flex-start'}}>
              <h2 style={{color: '#9575cd', backgroundColor: '#9575cd'}}>_____  </h2>
              <h2>Nombre materia 1</h2></Box>
            <p> Dias, Hora, Periodo donde se imparte</p>
            <Box sx={{display: 'flex',
              justifyContent: 'flex-start'}}>
              <h2 style={{color: '#2196f3', backgroundColor: '#2196f3'}}>_____  </h2>
              <h2>Nombre materia 2</h2></Box>
            <p> Dias, Hora, Periodo donde se imparte</p>
            <Box sx={{display: 'flex',
              justifyContent: 'flex-start'}}>
              <h2 style={{color: '#00796b', backgroundColor: '#00796b'}}>_____  </h2>
              <h2>Nombre materia 3</h2></Box>
            <p> Dias, Hora, Periodo donde se imparte</p>
          </div>
          <div style={{padding: 20, width: '60%'}}><Calendario/></div>

        </Box>

      </div>

    </div>

  );
}
