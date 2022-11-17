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
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import removeDiacritics from '../components/removeDiacritics';
import IconButton from '@mui/material/IconButton';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled'; // en proceso
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'; // enviado
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // terminado
import DoneAllIcon from '@mui/icons-material/DoneAll'; // actualizado
import CircleIcon from '@mui/icons-material/Circle'; // carga cero
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Chip from '@mui/material/Chip';
import {MenuItem, InputLabel, FormControl, Select} from '@mui/material';
import {motion} from 'framer-motion';

// agregar o eliminar clase lo cambia a 'en proceso'
// para enviar horario el estatus debe ser 'terminado'
const estados = [
  {id: 0, color: '#000000', icon: <CircleIcon style={{color: '#000000'}}/>, name: 'Carga cero'},
  {id: 1, color: '#ffcc00', icon: <AccessTimeFilledIcon style={{color: '#ffcc00'}}/>, name: 'En proceso'},
  {id: 2, color: '#218aff', icon: <MarkEmailReadIcon style={{color: '#218aff'}}/>, name: 'Enviado'},
  {id: 3, color: '#9c27b0', icon: <CheckCircleIcon style={{color: '#9c27b0'}}/>, name: 'Terminado'},
  {id: 4, color: '#99cc33', icon: <DoneAllIcon style={{color: '#99cc33'}}/>, name: 'Actualizado'},
];

const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#495057',
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
 * @param {*} estatus
 * @return {Object} The render component
 */
function createData(id, nombreProfesor, nomina, dbId, estatus) {
  return {id, nombreProfesor, nomina, dbId, estatus};
}

/**
 * @param {Object} props to be passed to the component
 * @return {Object} The render component
 */
export default function Profesores() {
  const [allProfesores, setallProfesores] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [currentEstatus, setCurrentEstatus] = useState(4);
  const [selectedProfesor, setSelectedProfesor] = useState('');
  const [numPages, setNumPages] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(7);
  const [pivot, setPivot] = useState(0);

  const saveProfesor = (selectedProfesor) => {
    localStorage.setItem('selectedProfesor', JSON.stringify(selectedProfesor));
  };

  const changeStatus = (estado) => {
    selectedProfesor.estatus = estado;
    setCurrentEstatus(estado);
    const cambiarEstatus = async () => {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/changeStatus?profesor=` + selectedProfesor.dbId + '&estatus=' + estado);
    };
    cambiarEstatus();
  };

  useEffect(() => {
    const getProfesores = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profesores`);
      const rawProfesores = res.data.allProfessors;
      const profesores = [];
      rawProfesores.forEach((profesor, index) => {
        const nombre = profesor.nombre;
        const nomina = profesor.nomina;
        const dbId = profesor._id;
        const estatus = profesor.estatus;
        profesores.push(createData(index, nombre, nomina, dbId, estatus));
      });
      setallProfesores(profesores);
      setProfesores(profesores.slice(pivot * pageSize, pivot * pageSize + pageSize - 1));
      setNumPages(Math.ceil(profesores.length / pageSize));
    };
    getProfesores();
  }, []);

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (profesor) => {
    setCurrentEstatus(profesor.estatus);
    setSelectedProfesor(profesor);
    setOpen(true);
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPivot(value - 1);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const newProfesores = allProfesores.slice(pivot * pageSize, pivot * pageSize + pageSize - 1);
    setProfesores(newProfesores);
  }, [pivot]);

  return (
    <motion.div
      initial={{
        y: 25,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        duration: 0.75,
        ease: 'easeOut',
        delay: 0.25,
      }}
    >
      <div>
        <center>
          <h1> Profesores </h1>
          <Box sx={{width: '70%', padding: 3, display: 'flex', justifyContent: 'flex-start', borderRadius: 10}}>
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
                setProfesores(filteredProfesores.slice(pivot * pageSize, pivot * pageSize + pageSize - 1));

                setNumPages(Math.ceil(filteredProfesores.length / pageSize));
              }}
            />

            <FormControl variant="outlined" sx={{width: '15%', marginLeft: 3}}>
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select labelId="demo-simple-select-label" label='Estado' onChange={(e) => {
                const filteredProfesores = allProfesores.filter((profesor) => {
                  if (e.target.value == 5 || profesor.estatus == e.target.value) {
                    return profesor;
                  }
                });
                setProfesores(filteredProfesores.slice(pivot * pageSize, pivot * pageSize + pageSize - 1));
                setNumPages(Math.ceil(filteredProfesores.length / pageSize));
              }}>
                <MenuItem value={'5'}><b>Todos</b></MenuItem>
                {estados.map((estado) => {
                  return <MenuItem key={estado.id} value={estado.id}>{estado.name}</MenuItem>;
                })}
              </Select>
            </FormControl>
          </Box>
          <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3, borderRadius: '15px'}}>
            <Table aria-label="customized table">
              <TableHead sx={{color: 'black'}}>
                <TableRow>
                  <StyledTableCell>Estado</StyledTableCell>
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
                      <div>
                        <IconButton style={{color: estados[profesor.estatus].color}} onClick={() => {
                          handleClickOpen(profesor);
                        }}>
                          <Chip icon={estados[profesor.estatus].icon} variant="outlined"/>
                        </IconButton>
                        <Dialog
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {'Seleccione el nuevo estado del profesor ' + selectedProfesor.nombreProfesor + ':'}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              <center>
                                <TableContainer component={Paper} sx={{maxWidth: '90%', marginBottom: 3}}>
                                  <Table aria-label="customized table">
                                    <TableHead>
                                      <TableRow>
                                        <StyledTableCell>Estado</StyledTableCell>
                                        <StyledTableCell>Nombre del estado</StyledTableCell>
                                        <StyledTableCell>  </StyledTableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {estados.map((estado) => (
                                        <StyledTableRow key={estado.id}>
                                          <StyledTableCell component="th" scope="row"> {estado.icon} </StyledTableCell>
                                          <StyledTableCell component="th" scope="row"> {estado.name} </StyledTableCell>
                                          <StyledTableCell component="th" scope="row"><Button variant="outlined" onClick={() => {
                                            changeStatus(estado.id);
                                          }}>{currentEstatus == estado.id ? 'Actual':'Cambiar'}</Button> </StyledTableCell>
                                        </StyledTableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </center>
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={handleClose}>Cerrar</Button>
                          </DialogActions>
                        </Dialog>
                      </div>
                    </StyledTableCell>
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
          <Stack
            spacing={2}
            alignItems={'center'}
          >
            <Pagination
              count={numPages}
              onChange={handleChange}
              showFirstButton
              showLastButton
            />
          </Stack>
        </center>
      </div>
    </motion.div>
  );
}
