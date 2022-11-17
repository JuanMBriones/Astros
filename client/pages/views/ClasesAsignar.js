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
import {Button, CircularProgress} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
 * @param {*} asignada
 * @param {*} dbId
 * @return {Object} The render component
 */
function createData(id, nombreProfesor, nomina, asignada, dbId) {
  return {id, nombreProfesor, nomina, asignada, dbId};
}

/**
 * @return {Object} The render component
 */
export default function AsignarClasesProfesor() {
  const [open, setOpen] = useState(false);
  const [allProfesores, setAllProfesores] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState('');
  const [materia, setMateria] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorFlag, setErrorFlag] = useState(false);
  const [newCarga, setNewCarga] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const mat = JSON.parse(localStorage.getItem('selectedMateria'));
    setMateria(mat);

    const getProfesores = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/profesores?clase=` + mat.dbId);
      const rawProfesores = res.data.profesores;
      const profesores = [];
      rawProfesores.forEach((profesor, index) => {
        profesores.push(createData(index, profesor.nombre, profesor.nomina, profesor.asignada, profesor._id));
      });
      setAllProfesores(profesores);
      setProfesores(profesores);
    };
    getProfesores();
  }, []);

  const handleClickOpen = (prof) => {
    setSelectedProfesor(prof);
    setErrorFlag(false);
    setMessages(['Validando...']);
    setCargando(true);
    setOpen(true);

    let msgs = [];
    if (!prof.asignada) {
      const getWarnings = async () => {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assignProf?idMateria=` + materia.dbId + '&profesor=' + prof.dbId);
          msgs = res.data.message;
          if (msgs.length > 0) {
            msgs.unshift('Advertencias:');
          } else {
            msgs.push('No hay advertencias ni conflictos.');
          }
          msgs.unshift('Confirme que desea asignar a: ' + prof.nombreProfesor + ' a la clase: ' + materia.nombreClase + '.');
          setNewCarga(res.data.carga);
        } catch (err) {
          msgs.push('No se puede asignar a: ' + prof.nombreProfesor + ' a la clase: ' + materia.nombreClase + '.');
          msgs.push(err.response.data.message);
          setErrorFlag(true);
        } finally {
          setMessages(msgs);
          setCargando(false);
        }
      };
      getWarnings();
    } else {
      msgs.push('Eliminar de la clase.');
      msgs.push('¿Confirma que desea desasignar a: ' + prof.nombreProfesor + ' de la clase: ' + materia.nombreClase + '?');
      setMessages(msgs);
      setCargando(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseOk = () => {
    if (selectedProfesor.asignada) {
      const unassign = async () => {
        try {
          const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/unassignProf?idMateria=` + materia.dbId + '&profesor=' + selectedProfesor.nomina);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      };
      unassign();
      selectedProfesor.asignada = !selectedProfesor.asignada;
    } else if (!errorFlag) {
      const assign = async () => {
        try {
          const res = await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/assignConfirm?idMateria=` + materia.dbId + '&profesor=' + selectedProfesor.dbId + '&carga=' + newCarga);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      };
      assign();
      selectedProfesor.asignada = !selectedProfesor.asignada;
    }
    setOpen(false);
  };

  return (
    <div>
      <center>
        <h1>Asignar {materia.nombreClase} a Profesores</h1>
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
                <StyledTableCell>Asignar Clase</StyledTableCell>
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
                    {profesor.asignada ?
                      (<Button variant="contained" color="error" onClick={() => {
                        handleClickOpen(profesor);
                      }}>Eliminar</Button>) :
                      (<Button variant="contained" color="success" onClick={() => {
                        handleClickOpen(profesor);
                      }}>Asignar</Button>)
                    }

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      BackdropProps={{style: {backgroundColor: '#000000', opacity: 0.5}}}
                    >
                      <DialogTitle id="alert-dialog-title">
                        {messages[0]}
                      </DialogTitle>
                      <DialogContent>
                        {cargando ? (<CircularProgress />) : (
                          messages.slice(1).map((msg, index) => (
                            <DialogContentText id="alert-dialog-description" key={index}>
                              {msg}
                            </DialogContentText>
                          )))}
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleClose} disabled={cargando}>Cancelar</Button>
                        <Button onClick={handleCloseOk} disabled={cargando} autoFocus> OK </Button>
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
