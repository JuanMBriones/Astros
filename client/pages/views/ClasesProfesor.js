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
import {Button, Link, Popover, Typography} from '@mui/material';
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
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

/**
 * @param {*} id
 * @param {*} nombreClase
 * @param {*} clave
 * @param {*} detalles
 * @param {*} dbId
 * @return {Object} The render component
 */
function createData(id, nombreClase, clave, detalles, dbId) {
  return {id, nombreClase, clave, detalles, dbId};
}

/* const rawRows = [
  createData(1, 'Introduccion a la vida profesional', 'TI3035', 'Detalles de la clase'),
  createData(2, 'Proyecto Integrador', 'TC7890', 'Detalles de la clase'),
  createData(3, 'Compiladores', 'TC1234', 'Detalles de la clase'),
  createData(4, 'Calidad', 'TC4567', 'Detalles de la clase'),
  createData(5, 'Introduccion a la vida profesional', 'TI3035', 'Detalles de la clase'),
  createData(6, 'Proyecto Integrador', 'TC7890', 'Detalles de la clase'),
  createData(7, 'Compiladores', 'TC1234', 'Detalles de la clase'),
  createData(8, 'Calidad', 'TC4567', 'Detalles de la clase'),
  createData(9, 'Introduccion a la vida profesional', 'TI3035', 'Detalles de la clase'),
  createData(10, 'Proyecto Integrador', 'TC7890', 'Detalles de la clase'),
  createData(11, 'Compiladores', 'TC1234', 'Detalles de la clase'),
  createData(12, 'Calidad', 'TC4567', 'Detalles de la clase'),
  createData(13, 'Introduccion a la vida profesional', 'TI3035', 'Detalles de la clase'),
  createData(14, 'Proyecto Integrador', 'TC7890', 'Detalles de la clase'),
  createData(15, 'Compiladores', 'TC1234', 'Detalles de la clase'),
  createData(16, 'Calidad', 'TC4567', 'Detalles de la clase'),
]; */

/**
 * @param {Object} props to be passed to the component
 * @return {Object} The render component
 */
export default function CustomizedTables() {
  const [allMaterias, setAllMaterias] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const [popMsg, setPopMsg] = useState([]);
  const saveMateria = (selectedMateria) => {
    localStorage.setItem('selectedMateria', JSON.stringify(selectedMateria));
  };

  const handleClick = (msgs, event) => {
    setPopMsg(msgs);
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

  useEffect(() => {
    const getClases = async () => {
      const res = await axios.get('http://localhost:3001/api/clase/clases');
      const rawClases = res.data.clases;
      const clases = [];
      rawClases.forEach((clase, index) => {
        const nombre = clase.materia;
        const clave = clase.clave;
        const dbid = clase._id;
        const horario = [clase.horario[0]];
        for (let i = 1; i < clase.horario.length; i++) {
          horario.push(clase.horario[i][0] + ': ' + clase.horario[i][1] + ' - ' + clase.horario[i][2]);
        }
        clases.push(createData(index, nombre, clave, horario, dbid));
      });
      setAllMaterias(clases);
      setMaterias(clases);
    };
    getClases();
  }, []);

  return (
    <div>
      <center>
        <h1> Clases a asignar </h1>
        <Box sx={{width: '70%', padding: 3, display: 'flex', justifyContent: 'flex-start'}}>
          <TextField
            id="outlined-basic"
            fullWidth
            variant="outlined"
            label="Buscar"
            onChange={(e) => {
              const filteredMaterias = allMaterias.filter((materia) => {
                const nombre = removeDiacritics(materia.nombreClase.toString().toLowerCase());
                if (nombre.includes(removeDiacritics(e.target.value.toLowerCase()))) {
                  return materia;
                }
              });
              setMaterias(filteredMaterias);
            }}
          />
          <Button variant="outlined" sx={{width: '15%', marginLeft: 3}}>Buscar</Button>
        </Box>
        <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3}}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre de la clase</StyledTableCell>
                <StyledTableCell>Clave</StyledTableCell>
                <StyledTableCell>Detalles</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materias.map((materia) => (
                <StyledTableRow key={materia.id}>
                  <StyledTableCell component="th" scope="row">
                    <Link onClick={() => saveMateria(materia)} href='./AsignarClasesProfesor'>
                      {materia.nombreClase}
                    </Link>
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {materia.clave}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    <Link aria-owns={open ? 'pop' : undefined} aria-haspopup="true" onMouseEnter={(event) => {
                      handleClick(materia.detalles, event);
                    }} onMouseLeave={handleClose}>
                      Detalles de la clase
                    </Link>
                    <Popover id='pop' open={open} sx={{pointerEvents: 'none'}} anchorEl={anchor} onClose={handleClose} anchorOrigin={{vertical: 'top', horizontal: 'right'}} disableScrollLock>
                      {popMsg.map((horario, index) => (
                        <Typography key={index} sx={{p: 1.5, lineHeight: '10px'}}>{horario}</Typography>
                      ))}
                    </Popover>
                    {/* {materia.detalles} */}
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
