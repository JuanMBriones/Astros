import React, {useEffect, useState} from 'react';
import {styled} from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import {Button} from '@mui/material';
import axios from 'axios';
import removeDiacritics from '../components/removeDiacritics';

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

/**
 * @param {Object} props to be passed to the component
 * @return {Object} The render component
 */
export default function Profesores() {
  const [allProfesores, setallProfesores] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const saveProfesor = (selectedProfesor) => {
    localStorage.setItem('selectedProfesor', JSON.stringify(selectedProfesor));
  };

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
        <h1> Profesores </h1>
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
          <Button variant="outlined" sx={{width: '15%', marginLeft: 3}}>Buscar</Button>
        </Box>
        <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3}}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre del profesor</StyledTableCell>
                <StyledTableCell>Nómina</StyledTableCell>
                <StyledTableCell>Horario</StyledTableCell>
                <StyledTableCell>Clases</StyledTableCell>
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
                  <StyledTableCell component="th" scope="row">
                    <Button variant="contained" color="success" onClick={() => saveProfesor(profesor)} href='./ProfesoresAsignar'>Asignar</Button>
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
