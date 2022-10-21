/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Button} from '@mui/material';
// import Box from '@mui/material/Box';
import axios from 'axios';
// import Calendario from '../components/Calendario';
import TextField from '@mui/material/TextField';


export default function Selec() {
  const [professors, setProfessor] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getDataProfessors = async () => {
      const res = await axios.get('http://localhost:3001/api/profesores');
      setProfessor(res.data.allProfessors);
    };

    getDataProfessors();
  }, []);

  const handleChange = (event) => {
    setMessage(event.target.value);

    console.log('value is:', event.target.value);
  };

  return (
    <div>
      <center>
        <h1>Horario por profesor</h1>
        <h3>Escribe el id del profesor para mostrar su horario</h3>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
        <Button variant="outlined" style={{margin: 3}}>Aceptar</Button>
        <h3>O escribe su nombre y apellido para buscarlo</h3>
        <TextField id="outlined-basic" label="Nombre" variant="outlined" />
        <TextField id="outlined-basic" label="Apellido" variant="outlined" />
        <Button variant="outlined" style={{margin: 3}}>Aceptar</Button>
      </center>

      {
        professors.map((professor) => (
          <div key={professor._id}>
            <h2>{professor.nombre}</h2>
          </div>
        ))
      }

      {/* <div style={{width: '100%'}}>
        <Box sx={{display: 'flex',
          justifyContent: 'space-evenly',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1}}>
          <div style={{padding: 20}}>
            {
              professors.map((professor) => (
                <div key={professor._id}>
                  <h2>{professor.nombre}</h2>
                </div>
              ))
            }
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

      </div> */}
      <input
        type="text"
        id="message"
        name="message"
        onChange={handleChange}
        value={message}
      />

      <h2>Message: {message}</h2>
    </div>
  );
}
