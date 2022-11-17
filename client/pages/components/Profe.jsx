import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {Typography, Box, TextField, Button} from '@mui/material';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {Stack} from '@mui/system';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';
import axios from 'axios';

Profe.propTypes = {
  personalizado: PropTypes.object,
  flagEdit: PropTypes.bool,
};

/**
 * newProfe
 * @param {String} personalizado
 * @param {Boolean} flagEdit
 * @return {React.Component}
 */
export default function Profe({personalizado, flagEdit}) {
  const [valueHour, setValueHour] = React.useState(null);
  const [valueName, setValueName] = React.useState(undefined);
  const [valueNomina, setValueNomina] = React.useState(undefined);
  const [valueCorreo, setValueCorreo] = React.useState(undefined);
  const [valueCIP, setValueCIP] = React.useState(undefined);
  const [valueModalidad, setValueModalidad] = React.useState(undefined);
  const [valueDepartamento, setValueDepartamento] = React.useState(undefined);

  useEffect(() => {
    if (flagEdit) {
      const profe = JSON.parse(localStorage.getItem('selectedProfe'));
      const getProfe = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profe?profesor=${profe.nomina}`);
        setValueHour(res.data.entrada ? new Date(res.data.entrada) : null);
        setValueName(res.data.nombre ? res.data.nombre : undefined);
        setValueNomina(res.data.nomina ? res.data.nomina : undefined);
        setValueCorreo(res.data.correo ? res.data.correo : undefined);
        setValueCIP(res.data.cip ? res.data.cip : undefined);
        setValueModalidad(res.data.modalidad ? res.data.modalidad : undefined);
        setValueDepartamento(res.data.depto_prof ? res.data.depto_prof : undefined);
      };
      getProfe();
    }
  }, []);

  // TODO: Notify user when the professor alreay exists
  const handleOnClick = () => {
    if (!valueDepartamento || !valueNomina || !valueName || !valueCorreo) {
      alert('Favor de llenar todos los campos');
      return;
    }

    let humanReadable = '';
    if (valueHour != null) {
      humanReadable = valueHour.$H + ':' + valueHour.$m;
    }

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
      if (res.status == 200 || res.status == 201) {
        alert(personalizado.mensaje);
        window.location.href = '../views/Profesores';
      } else {
        alert('Error al guardar la información');
      }
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
        marginTop: '50px',
      }}>
        <Typography variant='h4' component='h1' sx={{mb: '2rem'}}>
          {
            (personalizado && personalizado.titulo) ?
              personalizado.titulo :
              null
          }
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
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={valueCIP}
              onChange={(event) => setValueCIP(event.target.value)}
            />
            <FormControl style={{minWidth: 180}}>
              <InputLabel >Modalidad</InputLabel>
              <Select
                value={valueModalidad}
                label="Modalidad"
                onChange={(e) => setValueModalidad(e.target.value)}
              >
                <MenuItem value={'Presencial'}>Presencial</MenuItem>
                <MenuItem value={'MFDL'}>MFDL</MenuItem>
                <MenuItem value={'En linea'}>En línea</MenuItem>
                <MenuItem value={'ED'}>ED</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <Button
            variant='contained'
            color='success'
            onClick={handleOnClick}
          >
            {
              (personalizado && personalizado.boton) ?
                personalizado.boton :
                null
            }
          </Button>
        </Box>
      </Box>
    </>
  );
}
