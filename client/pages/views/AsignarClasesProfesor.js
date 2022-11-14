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
import {Button, Link, Popover, Typography, CircularProgress} from '@mui/material';
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
 * @param {*} nombreClase
 * @param {*} detalles
 * @param {*} asignada
 * @param {*} dbId
 * @param {*} clave
 * @return {Object} The render component
 */
function createData(id, nombreClase, detalles, asignada, dbId, clave) {
  return {id, nombreClase, detalles, asignada, dbId, clave};
}

/**
 * @return {Object} The render component
 */
export default function AsignarClasesProfesor() {
  const [open, setOpen] = useState(false);
  const [allMaterias, setallMaterias] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [selectedMateria, setSelectedMateria] = useState('');
  const [profesor, setProfesor] = useState('');
  const [messages, setMessages] = useState([]);
  const [errorFlag, setErrorFlag] = useState(false);
  const [newCarga, setNewCarga] = useState(0);
  const [anchor, setAnchor] = useState(null);
  const [popMsg, setPopMsg] = useState([]);
  const [cargando, setCargando] = useState(true);

  const handleClick = (msgs, event) => {
    setPopMsg(msgs);
    setAnchor(event.currentTarget);
  };

  const handleClosePop = () => {
    setAnchor(null);
  };

  const openPop = Boolean(anchor);

  useEffect(() => {
    const prof = JSON.parse(localStorage.getItem('selectedProfesor'));
    setProfesor(prof);

    const getMaterias = async () => {
      const res = await axios.get('http://localhost:3001/api/profMaterias?profesor=' + prof.dbId);
      const rawMaterias = res.data.clases;
      const materias = [];
      rawMaterias.forEach((materia, index) => {
        const horario = [materia.horario[0]];
        for (let i = 1; i < materia.horario.length; i++) {
          horario.push(materia.horario[i][0] + ': ' + materia.horario[i][1] + ' - ' + materia.horario[i][2]);
        }
        materias.push(createData(index, materia.materia, horario, materia.asignada, materia._id, materia.clave));
      });
      setallMaterias(materias);
      setMaterias(materias);
    };
    getMaterias();
  }, []);

  const handleClickOpen = (mat) => {
    setSelectedMateria(mat);
    setErrorFlag(false);
    setMessages(['Validando...']);
    setCargando(true);
    setOpen(true);

    let msgs = [];
    if (!mat.asignada) {
      const getWarnings = async () => {
        try {
          const res = await axios.get('http://localhost:3001/api/assignProf?idMateria=' + mat.dbId + '&profesor=' + profesor.dbId);
          msgs = res.data.message;
          if (msgs.length > 0) {
            msgs.unshift('Advertencias:');
          } else {
            msgs.push('No hay advertencias ni conflictos.');
          }
          msgs.unshift('Confirme que desea asignar a: ' + profesor.nombreProfesor + ' a la clase: ' + mat.nombreClase + '.');
          setNewCarga(res.data.carga);
        } catch (err) {
          msgs.push('No se puede asignar a: ' + profesor.nombreProfesor + ' a la clase: ' + mat.nombreClase + '.');
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
      msgs.push('¿Confirma que desea desasignar a: ' + profesor.nombreProfesor + ' de la clase: ' + mat.nombreClase + '?');
      setMessages(msgs);
      setCargando(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseOk = () => {
    if (selectedMateria.asignada) {
      const unassign = async () => {
        try {
          const res = await axios.put('http://localhost:3001/api/unassignProf?idMateria=' + selectedMateria.dbId + '&profesor=' + profesor.nomina);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      };
      unassign();
      selectedMateria.asignada = !selectedMateria.asignada;
    } else if (!errorFlag) {
      const assign = async () => {
        try {
          const res = await axios.put('http://localhost:3001/api/assignConfirm?idMateria=' + selectedMateria.dbId + '&profesor=' + profesor.dbId + '&carga=' + newCarga);
          console.log(res);
        } catch (err) {
          console.log(err);
        }
      };
      assign();
      selectedMateria.asignada = !selectedMateria.asignada;
    }
    setOpen(false);
  };

  return (
    <div>
      <center>
        <h1>Asignar Clases a {profesor.nombreProfesor + ' - ' + profesor.nomina}</h1>
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
        </Box>

        <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3}}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Clave</StyledTableCell>
                <StyledTableCell>Nombre de la materia</StyledTableCell>
                <StyledTableCell>Detalles</StyledTableCell>
                <StyledTableCell>Asignar Clase</StyledTableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {materias.map((materia) => (
                <StyledTableRow key={materia.id}>
                  <StyledTableCell component="th" scope="row">
                    {materia.clave}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {materia.nombreClase}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    <Link aria-owns={openPop ? 'pop' : undefined} aria-haspopup="true" onMouseEnter={(event) => {
                      handleClick(materia.detalles, event);
                    }} onMouseLeave={handleClosePop}>
                      Detalles de la clase
                    </Link>
                    <Popover id='pop' open={openPop} sx={{pointerEvents: 'none'}} anchorEl={anchor} onClose={handleClosePop} anchorOrigin={{vertical: 'top', horizontal: 'right'}} disableScrollLock>
                      {popMsg.map((horario, index) => (
                        <Typography key={index} sx={{p: 1.5, lineHeight: '10px'}}>{horario}</Typography>
                      ))}
                    </Popover>
                    {/* {materia.detalles} */}
                  </StyledTableCell>

                  <StyledTableCell component="th" scope="row">
                    {materia.asignada ?
                      (<Button variant="contained" color="error" onClick={() => {
                        handleClickOpen(materia);
                      }}>Eliminar</Button>) :
                      (<Button variant="contained" color="success" onClick={() => {
                        handleClickOpen(materia);
                      }}>Asignar</Button>)
                    }

                    <Dialog
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                      BackdropProps={{style: {backgroundColor: '#000000', opacity: 0.2}}}
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
