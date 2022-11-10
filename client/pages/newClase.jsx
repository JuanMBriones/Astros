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
import axios from 'axios';
// falta cip

/**
 * newClase
 * @return {React.Component}
 */
export default function newClase() {
  const objetoClase = {paquete: null, clave: null, grupo: null, nombre: null, edificio: null, salon: null,
    modalidad: null, tipo: null, modelo: null, carga: null, semestre: null, periodo: null, horario: null, ingles: null};
  const [objClase, setAtributos] = React.useState(objetoClase);
  const [modalidad, setModalidad] = React.useState('');
  const [tipo, setTipo] = React.useState('');
  const [modelo, setModelo] = React.useState('');
  const [periodo, setPeriodo] = React.useState('');

  const submitForm = () => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/add/`,
      {
        paquete: objClase.paquete,
        clave: objClase.clave,
        grupo: objClase.grupo,
        nombre: objClase.nombre,
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
    });
  };

  const handleModalidad = (event) => {
    setModalidad(event.target.value);
  };

  const handleTipo = (event) => {
    setTipo(event.target.value);
  };

  const handleModelo = (event) => {
    setModelo(event.target.value);
  };

  const handlePeriodo = (event) => {
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
              onChange={(e) => setAtributos({...objClase, paquete: e.target.value})}
            />
            <TextField
              id='outlined-basic'
              label='Clave'
              variant='outlined'
              onChange={(e) => setAtributos({...objClase, clave: e.target.value})}
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
              onChange={(e) => setAtributos({...objClase, grupo: e.target.value})}
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
              onChange={(e) => setAtributos({...objClase, nombre: e.target.value})}
            />
            <TextField
              id='outlined-basic'
              label='Edificio'
              variant='outlined'
              onChange={(e) => setAtributos({...objClase, edificio: e.target.value})}
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
              onChange={(e) => setAtributos({...objClase, salon: e.target.value})}
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
                onChange={(e) => {
                  handleModalidad(e); setAtributos({...objClase, modalidad: e.target.value});
                }}
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
                onChange={(e) => {
                  handleTipo(e); setAtributos({...objClase, tipo: e.target.value});
                }}
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
                onChange={(e) => {
                  handleModelo(e); setAtributos({...objClase, modelo: e.target.value});
                }}
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
              onChange={(e) => setAtributos({...objClase, carga: e.target.value})}
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
              onChange={(e) => setAtributos({...objClase, semestre: e.target.value})}
            />
            <FormControl fullWidth>
              <InputLabel >Periodo</InputLabel>
              <Select
                value={periodo}
                label="Periodo"
                onChange={(e) => {
                  handlePeriodo(e); setAtributos({...objClase, periodo: e.target.value});
                }}
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
              onChange={(e) => {
                if (/^(((Lu|Ma|Mi|Ju|Vi)+ ([01]?[0-9]|2[0-3]):[0-5][0-9])(\/)*)+$/.test(e.target.value)) {
                  e.target.style.color = 'green';
                  setAtributos({...objClase, horario: e.target.value});
                } else {
                  e.target.style.color = 'red';
                }
              }}
            />
            <FormGroup>
              <FormControlLabel control={<Checkbox onChange={(e) => setAtributos({...objClase, ingles: e.target.checked})}/>} label={
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
