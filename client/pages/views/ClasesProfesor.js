import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from "@mui/material/TextField";
import Box from '@mui/material/Box';
import {Button} from '@mui/material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#001489',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(id, nombreClase, clave, detalles) {
  return { id, nombreClase, clave, detalles};
}

const rows = [
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
];

export default function CustomizedTables() {
    return (
        <div>
            <center>
    <h1> Clases a asignar </h1>
    <Box sx={{ width: '70%',  padding: 3, display: 'flex', justifyContent: 'flex-start'}}>
        <TextField
          id="outlined-basic"
          fullWidth
          variant="outlined"
          label="Buscar"
        />
        <Button variant="outlined" sx={{ width: '15%', marginLeft: 3 }}>Buscar</Button>
    </Box>
        <TableContainer component={Paper} sx={{ maxWidth: '80%' }}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                      <StyledTableCell>Nombre de la clase</StyledTableCell>
                      <StyledTableCell>Clave</StyledTableCell>
                      <StyledTableCell>Detalles</StyledTableCell>
                    </TableRow>
                  </TableHead>
                <TableBody>
                    {rows.map((row) => (
                      <StyledTableRow key={row.id}>
                        <StyledTableCell component="th" scope="row">
                          {row.nombreClase}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.clave}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {row.detalles}
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
