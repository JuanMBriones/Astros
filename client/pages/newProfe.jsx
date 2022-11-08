import React from 'react';
import {Typography, Box, TextField, Button} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {Stack} from '@mui/system';
import axios from 'axios';

/**
 * newClase
 * @return {React.Component}
 */
export default function newProfe() {
  const [valueHour, setValueHour] = React.useState(null);
  const [valueName, setValueName] = React.useState(null);
  const [valueNomina, setValueNomina] = React.useState(null);
  const [valueCorreo, setValueCorreo] = React.useState(null);
  const [valueCIP, setValueCIP] = React.useState(null);
  const [valueModalidad, setValueModalidad] = React.useState(null);
  const [valueDepartamento, setValueDepartamento] = React.useState(null);

  // TODO: Notify user when the professor alreay exists
  const handleOnClick = () => {
    const humanReadable = valueHour.$H + ':' + valueHour.$m;

    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profe/`,
      {
        nombre: valueName,
        nomina: valueNomina,
        correo: valueCorreo,
        cip: valueCIP,
        modalidad: valueModalidad,
        deptoProf: valueDepartamento,
        entrada: humanReadable,
      },
    ).then((res) => {
      console.log(res);
    });
  };

  return (
    <>
      <Box sx={{
        maxWidth: '30rem',
        margin: 'auto',
        padding: '1rem',
        contentAlign: 'center',
        border: '1px solid #ccc',
        borderRadius: '0.5rem',
        width: '500px',
        height: '475px',
        marginTop: '150px',
      }}>
        <Typography variant='h4' component='h1' sx={{mb: '2rem'}}>
        Nuevo Profesor
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
          <TextField
            id='outlined-basic'
            label='Nombre'
            variant='outlined'
            sx={{mb: '1rem'}}
            fullWidth
            value={valueName}
            onChange={(event) => setValueName(event.target.value)}
          />
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='Nomina'
              variant='outlined'
              value={valueNomina}
              onChange={(event) => setValueNomina(event.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Departamento'
              variant='outlined'
              value={valueDepartamento}
              onChange={(event) => setValueDepartamento(event.target.value)}
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
              label='Correo'
              variant='outlined'
              sx={{mb: '1rem'}}
              value={valueCorreo}
              onChange={(event) => setValueCorreo(event.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Hora de entrada"
                value={valueHour}
                onChange={(newValue) => {
                  setValueHour(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
          <Stack
            direction='row'
            spacing={2}
            sx={{mb: '1rem'}}
            fullWidth
          >
            <TextField
              id='outlined-basic'
              label='CIP'
              variant='outlined'
              sx={{mb: '1rem'}}
              value={valueCIP}
              onChange={(event) => setValueCIP(event.target.value)}
            />
            <TextField
              id='outlined-basic'
              label='Modalidad'
              variant='outlined'
              sx={{mb: '1rem'}}
              value={valueModalidad}
              onChange={(event) => setValueModalidad(event.target.value)}
            />
          </Stack>
          <Button
            variant='contained'
            color='success'
            onClick={handleOnClick}
          >
            Crear
          </Button>
        </Box>
      </Box>
    </>
  );
}
