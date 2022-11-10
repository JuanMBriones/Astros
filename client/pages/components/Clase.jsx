import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Typography, Box, TextField, Button} from '@mui/material';
import {Stack} from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios';
// falta cip

Clase.propTypes = {
  titulo: PropTypes.object,
  flagEdit: PropTypes.object,
};

/**
 * Clase
 * @param {String} titulo
 * @param {Boolean} flagEdit
 * @return {React.Component}
 */
export default function Clase({titulo, flagEdit}) {
  const [paquete, setPaquete] = React.useState('');
  const [clave, setClave] = React.useState('');
  const [grupo, setGrupo] = React.useState('');
  const [nombre, setNombre] = React.useState('');
  const [edificio, setEdificio] = React.useState('');
  const [salon, setSalon] = React.useState('');
  const [modalidad, setModalidad] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [modelo, setModelo] = React.useState('');
  const [carga, setCarga] = React.useState('');
  const [semestre, setSemestre] = React.useState('');
  const [periodo, setPeriodo] = React.useState('');
  const [horario, setHorario] = React.useState('');
  const [ingles, setIngles] = React.useState('');

  useEffect(() => {
    if (flagEdit) {
      const materia = JSON.parse(localStorage.getItem('selectedMateria'));
      setClave(materia.clave);
      setNombre(materia.nombreClase);
    }
  }, []);

  const submitForm = () => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/add/`,
      {
        paquete: objClase.paquete,
        clave: objClase.clave,
        grupoApg: objClase.grupo,
        materia: objClase.nombre,
        edificio: objClase.edificio,
        salon: objClase.salon,
        modalidad: objClase.modalidad,
        tipo: objClase.tipo,
        modelo: objClase.modelo,
        carga: objClase.carga,
        semestre: objClase.semestre,
        periodo: objClase.periodo,
        horario: objClase.horario,
        ingles: objClase.ingles,
      },
    ).then((res) => {
      console.log(res);
      if (res.status === 200) {
        alert('Clase agregada');
      }
    });
  };

  return (
    <>
      <Box sx={{
        maxWidth: '50rem',
        margin: 'auto',
        padding: '1rem',
        contentAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '0.5rem',
        width: '800px',
        height: '620',
        marginTop: '75px',
      }}>
        <Typography variant='h4' component='h1' sx={{mb: '2rem'}}>
          {titulo}
        </Typography>
        <Box
          component='form'
          noValidate
          autoComplete='off'
          sx={{
            display: 'flex',
            flexDirection: 'column',
            contentAlign: 'center',
            alignItems: 'center',
          }}
        >
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='Paquete'
              variant='outlined'
              sx={{mb: '1rem'}}
              value={paquete}
              onChange={(e) => setPaquete(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Clave'
              variant='outlined'
              value={clave}
              onChange={(e) => setClave(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Grupo'
              variant='outlined'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={grupo}
              onChange={(e) => setGrupo(e.target.value)}
            />
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='Nombre de la materia'
              variant='outlined'
              sx={{mb: '1rem'}}
              fullWidth
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Edificio'
              variant='outlined'
              value={edificio}
              onChange={(e) => setEdificio(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Salón'
              variant='outlined'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={salon}
              onChange={(e) => setSalon(e.target.value)}
            />
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            width='600px'
          >
            <FormControl fullWidth>
              <InputLabel >Modalidad</InputLabel>
              <Select
                value={modalidad}
                label="Modalidad"
                onChange={(e) => setModalidad(e.target.value)}
              >
                <MenuItem value={'Presencial'}>Presencial</MenuItem>
                <MenuItem value={'MFDL'}>MFDL</MenuItem>
                <MenuItem value={'En linea'}>En línea</MenuItem>
                <MenuItem value={'ED'}>ED</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={tipo}
                label="Tipo"
                onChange={(e) => setTipo(e.target.value)}
              >
                <MenuItem value={'Bloque'}>Bloque</MenuItem>
                <MenuItem value={'Topico'}>Tópico</MenuItem>
                <MenuItem value={'Clinica'}>Clínica</MenuItem>
                <MenuItem value={'Semana Tec'}>Semana Tec</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel >Modelo</InputLabel>
              <Select
                value={modelo}
                label="Modelo"
                onChange={(e) => setModelo(e.target.value)}
              >
                <MenuItem value={'Tec 20'}>Tec 20</MenuItem>
                <MenuItem value={'Tec 21'}>Tec 21</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='Carga'
              variant='outlined'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={carga}
              onChange={(e) => setCarga(e.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Semestre'
              variant='outlined'
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel >Periodo</InputLabel>
              <Select
                value={periodo}
                label="Periodo"
                onChange={(e) => setPeriodo(e.target.value)}
              >
                <MenuItem value={'PMT1'}>PMT1</MenuItem>
                <MenuItem value={'PMT2'}>PMT2</MenuItem>
                <MenuItem value={'PMT3'}>PMT3</MenuItem>
                <MenuItem value={'PMT4'}>PMT4</MenuItem>
                <MenuItem value={'PMT5'}>PMT5</MenuItem>
                <MenuItem value={'PMT6'}>PMT6</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='Horario'
              variant='outlined'
              style = {{width: 400}}
              value={horario}
              onChange={(e) => {
                if (/^(((Lu|Ma|Mi|Ju|Vi)+ ([01]?[0-9]|2[0-3]):[0-5][0-9])(\/)*)+$/.test(e.target.value)) {
                  e.target.style.color = 'green';
                  setHorario(e.target.value);
                } else {
                  e.target.style.color = 'red';
                }
              }}
            />
            <FormGroup>
              <FormControlLabel control={<Checkbox value={ingles} onChange={(e) => setIngles(e.target.checked)}/>} label={
                <Typography variant="body1" gutterBottom>
                    Inglés
                </Typography> }/>
            </FormGroup>
          </Stack>
          <Button
            variant='contained'
            color='success'
            onClick={submitForm}
          >
            Crear
          </Button>
        </Box>
      </Box>
    </>
  );
}
