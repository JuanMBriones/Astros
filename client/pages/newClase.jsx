import React from 'react';
import {Typography, Box, TextField, Button} from '@mui/material';
import {Stack} from '@mui/system';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

/**
 * newClase
 * @return {React.Component}
 */
export default function newClase() {
  const [modalidad, setModalidad] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [modelo, setModelo] = React.useState('');
  const [periodo, setPeriodo] = React.useState('');

  const handleModalidad = event => {
    setModalidad(event.target.value);
  };

  const handleTipo = event => {
    setTipo(event.target.value);
  };

  const handleModelo = event => {
    setModelo(event.target.value);
  };

  const handlePeriodo = event => {
    setPeriodo(event.target.value);
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
        Nueva Clase
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
            />
            <TextField
              id='outlined-basic'
              label='Clave'
              variant='outlined'
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
            />
            <TextField
              id='outlined-basic'
              label='Edificio'
              variant='outlined'
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
                onChange={handleModalidad}
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
                onChange={handleTipo}
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
                onChange={handleModelo}
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
            />
             <FormControl fullWidth>
              <InputLabel >Periodo</InputLabel>
              <Select
                value={periodo}
                label="Periodo"
                onChange={handlePeriodo}
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
            />
            <FormGroup>
                <FormControlLabel control={<Checkbox />} label={
                  <Typography variant="body1" gutterBottom>
                    Inglés
                  </Typography> }/>
            </FormGroup>
          </Stack>
          <Button
            variant='contained'
            color='success'
          >
            Crear
          </Button>
        </Box>
      </Box>
    </>
  );
}
