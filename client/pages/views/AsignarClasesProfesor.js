import * as React from 'react';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
 * @param {*} infoAdicional
 * @return {Object} The render component
 */
function createData(id, nombreProfesor, infoAdicional) {
  return {id, nombreProfesor, infoAdicional};
}

const rows = [
  createData(1, 'Israel Lobo', 'Info extra'),
  createData(2, 'Rita de la Torre', 'Info extra'),
  createData(3, 'Manuel Gonzalez', 'Info extra'),
  createData(4, 'Laura de la Fuente', 'Info extra'),
  createData(5, 'Israel Lobo', 'Info extra'),
  createData(6, 'Rita de la Torre', 'Info extra'),
  createData(7, 'Manuel Gonzalez', 'Info extra'),
  createData(8, 'Laura de la Fuente', 'Info extra'),
  createData(9, 'Israel Lobo', 'Info extra'),
  createData(10, 'Rita de la Torre', 'Info extra'),
  createData(11, 'Manuel Gonzalez', 'Info extra'),
  createData(12, 'Laura de la Fuente', 'Info extra'),
];

/**
 * @return {Object} The render component
 */
export default function AsignarClasesProfesor() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <center>
        <h1>Asignar NombreClase a Profesores</h1>
        <Box sx={{width: '70%', padding: 3, display: 'flex', justifyContent: 'flex-start'}}>
          <TextField
            id="outlined-basic"
            fullWidth
            variant="outlined"
            label="Buscar"
          />
          <Button variant="outlined" sx={{width: '15%', marginLeft: 3}}>Buscar</Button>
        </Box>

        <TableContainer component={Paper} sx={{maxWidth: '80%'}}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre del profesor</StyledTableCell>
                <StyledTableCell>Info extra</StyledTableCell>
                <StyledTableCell>Asignar Clase</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.nombreProfesor}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {row.infoAdicional}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <Button variant="contained" color="success" onClick={handleClickOpen}>Asignar</Button>

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {'¿Estas seguro de querer asignar esta clase?'}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                              Esta accion no podra deshacerse una vez realizada.
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleClose} autoFocus> OK </Button>
                      </DialogActions>
                    </Dialog>

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
