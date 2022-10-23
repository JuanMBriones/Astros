/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
import React, {useEffect, useState} from 'react';
import {Button} from '@mui/material';
import axios from 'axios';
// import Calendario from '../components/Calendario';
import TextField from '@mui/material/TextField';
import removeDiacritics from '../components/removeDiacritics';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {styled} from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#001489',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

/**
 * @param {*} id
 * @param {*} nombreProfesor
 * @param {*} nomina
 * @param {*} dbId
 * @return {Object} The render component
 */
function createData(id, nombreProfesor, nomina, dbId) {
  return {id, nombreProfesor, nomina, dbId};
}

export default function Selec() {
  const [profesores, setProfesores] = useState([]);
  const [allProfesores, setallProfesores] = useState([]);


  // useEffect(() => {
  //   const getDataProfessors = async () => {
  //     const res = await axios.get('http://localhost:3001/api/profesores');
  //     setProfessor(res.data.allProfessors);
  //   };

  //   getDataProfessors();
  // }, []);
  useEffect(() => {
    const getProfesores = async () => {
      const res = await axios.get('http://localhost:3001/api/profesores');
      const rawProfesores = res.data.allProfessors;
      const profesores = [];
      rawProfesores.forEach((profesor, index) => {
        const nombre = profesor.nombre;
        const nomina = profesor.nomina;
        const dbId = profesor._id;
        profesores.push(createData(index, nombre, nomina, dbId));
      });
      setallProfesores(profesores);
      setProfesores(profesores);
    };
    getProfesores();
  }, []);

  return (
    <div>
      <center>
        <h1>Horario por profesor</h1>
        <h3>Escribe el nombre del profesor para consultar su horario</h3>
      </center>
      {
        profesores.map((professor) => (
          <div key={professor._id}>
            <h2>{professor.nombre}</h2>
          </div>
        ))
      }
      <center>

        <Box sx={{width: '70%', padding: 3, display: 'flex', justifyContent: 'flex-start'}}>
          <TextField
            id="outlined-basic"
            fullWidth
            variant="outlined"
            label="Buscar"
            onChange={(e) => {
              const filteredProfesores = allProfesores.filter((profesor) => {
                const nombre = removeDiacritics(profesor.nombreProfesor.toString().toLowerCase());
                if (nombre.includes(removeDiacritics(e.target.value.toLowerCase()))) {
                  return profesor;
                }
              });
              setProfesores(filteredProfesores);
            }}
          />

        </Box>
        <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3}}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre del profesor</StyledTableCell>
                <StyledTableCell>Nómina</StyledTableCell>
                <StyledTableCell>Horario</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {profesores.map((profesor) => (
                <StyledTableRow key={profesor.id}>
                  <StyledTableCell component="th" scope="row">
                    {profesor.nombreProfesor}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {profesor.nomina}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Button variant="contained" color="success" onClick={() => saveProfesor(profesor)} href='./Horario'>Horario</Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </center>
    </div>
  );
}
