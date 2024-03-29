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
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import {Button, Link, Popover, Typography} from '@mui/material';
import axios from 'axios';
import removeDiacritics from '../components/removeDiacritics';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
// import {useRouter} from 'next/router';
import {motion} from 'framer-motion';

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
 * @param {*} grupo
 * @return {Object} The render component
 */
function createData(id, nombreClase, clave, detalles, dbId, grupo) {
  return {id, nombreClase, clave, detalles, dbId, grupo};
}


/**
 * @param {Object} props to be passed to the component
 * @return {Object} The render component
 */
export default function CustomizedTables() {
  const [allMaterias, setAllMaterias] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [anchor, setAnchor] = useState(null);
  const [popMsg, setPopMsg] = useState([]);
  const [numPages, setNumPages] = useState(10);
  // eslint-disable-next-line no-unused-vars
  const [pageSize, setPageSize] = useState(7);
  const [pivot, setPivot] = useState(0);

  const saveMateria = (selectedMateria) => {
    localStorage.setItem('selectedMateria', JSON.stringify(selectedMateria));
  };

  const handleChange = (event, value) => {
    console.log(value);
    setPivot(value - 1);
  };

  const deleteForm = (id) => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/remove/`,
      {
        id: id,
      },
    ).then((res) => {
      if (res.status == 200 || res.status == 201) {
        alert('Clase eliminada');
        window.location.reload();
      } else {
        alert('Error al eliminar la información');
      }
    });
  };


  const handleClick = (msgs, event) => {
    setPopMsg(msgs);
    setAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchor(null);
  };

  const open = Boolean(anchor);

  // const router = useRouter();

  useEffect(() => {
    const profInfo = localStorage.getItem('professor');
    console.log(profInfo);
    if (profInfo) {
      const profInfoJson = JSON.parse(profInfo);
      console.log(profInfoJson);

      if (profInfoJson && profInfoJson.profe) {
        if (profInfoJson.profe.rol && profInfoJson.profe.rol === 'admin') {
          console.log('🎉');
        } else {
          // router.push('/login');
          window.location.href = '/login';
          console.log('not logged in');
        }
      } else {
        // router.push('/login');
        window.location.href = '/login';
        // next router send to login

        console.log('not logged in');
      }
    }
  }, []);

  useEffect(() => {
    const getClases = async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/clases`);
      const rawClases = res.data.clases;
      const clases = [];
      rawClases.forEach((clase, index) => {
        const nombre = clase.materia;
        const clave = clase.clave;
        const dbid = clase._id;
        const horario = [clase.horario[0]];
        const grupo = clase.grupo_apg;
        for (let i = 1; i < clase.horario.length; i++) {
          horario.push(clase.horario[i][0] + ': ' + clase.horario[i][1] + ' - ' + clase.horario[i][2]);
        }
        clases.push(createData(index, nombre, clave, horario, dbid, grupo));
      });

      // TODO: Paginar
      setAllMaterias(clases);
      setNumPages(Math.ceil(clases.length / pageSize));
      setMaterias(clases.slice(pivot * pageSize, pivot * pageSize + pageSize - 1));
    };
    getClases();
  }, []);

  useEffect(() => {
    const newMaterias = allMaterias.slice(pivot * pageSize, pivot * pageSize + pageSize - 1);
    setMaterias(newMaterias);
  }, [pivot]);

  return (
    <motion.div
      animate={{x: 15}}
      transition={{ease: 'easeOut', duration: 2}}
    >
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

                // TODO: Paginar aqui
                setMaterias(filteredMaterias.slice(pivot * pageSize, pivot * pageSize + pageSize - 1));
                setNumPages(Math.ceil(filteredMaterias.length / pageSize));
              }}
            />
          </Box>
          <TableContainer component={Paper} sx={{maxWidth: '80%', marginBottom: 3, borderRadius: '15px'}}>
            <Table aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>  </StyledTableCell>
                  <StyledTableCell>Nombre de la clase</StyledTableCell>
                  <StyledTableCell>Grupo</StyledTableCell>
                  <StyledTableCell>Clave</StyledTableCell>
                  <StyledTableCell>Detalles</StyledTableCell>
                  <StyledTableCell>   </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {materias.map((materia) => (
                  <StyledTableRow key={materia.id}>
                    <StyledTableCell component="th" scope="row">
                      <IconButton onClick={() => saveMateria(materia)} href='../editClase'>
                        <EditIcon style={{color: '#335687'}} />
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      <Link onClick={() => saveMateria(materia)} href='./ClasesAsignar'>
                        {materia.nombreClase}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {materia.grupo}
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
                    <StyledTableCell component="th" scope="row">
                      <Button variant="outlined" color="error" onClick={() => {
                        deleteForm(materia.dbId);
                      }}>Eliminar</Button>
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
