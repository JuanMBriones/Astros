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
// falta cip y hacerlo array

Clase.propTypes = {
  personalizado: PropTypes.object,
  flagEdit: PropTypes.object,
};

/**
 * Clase
 * @param {String} personalizado
 * @param {Boolean} flagEdit
 * @return {React.Component}
 */
export default function Clase({personalizado, flagEdit}) {
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
  const [horario, setHorario] = React.useState(null);
  const [ingles, setIngles] = React.useState(false);

  useEffect(() => {
    if (flagEdit) {
      const materia = JSON.parse(localStorage.getItem('selectedMateria'));
      const getClase = async () => {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/clase?id=${materia.dbId}`);
        setPaquete(res.data.clase.paquete ? res.data.clase.paquete:'');
        setClave(res.data.clase.clave ? res.data.clase.clave:'');
        setGrupo(res.data.clase.grupo_apg ? res.data.clase.grupo_apg:'');
        setNombre(res.data.clase.materia ? res.data.clase.materia:'');
        setEdificio(res.data.clase.edificio ? res.data.clase.edificio:'');
        setSalon(res.data.clase.salon ? res.data.clase.salon:'');
        setModalidad(res.data.clase.modalidad_grupo ? res.data.clase.modalidad_grupo:'');
        setTipo(res.data.clase.tipo ? res.data.clase.tipo:'');
        setModelo(res.data.clase.propuesta ? res.data.clase.propuesta:'');
        setCarga(res.data.clase.carga ? res.data.clase.carga:'');
        setSemestre(res.data.clase.semestre ? res.data.clase.semestre:'');
        setPeriodo(res.data.clase.periodo ? res.data.clase.periodo:'');
        setHorario(res.data.clase.horario ? res.data.clase.horario:null);
        setIngles(res.data.clase.ingles ? res.data.clase.ingles:false);
      };
      getClase();
    }
  }, []);

  const submitForm = () => {
    if (!paquete || !clave || !grupo || !nombre || !modalidad || !tipo || !modelo || !carga || !semestre || !periodo || !horario) {
      alert('Favor de llenar todos los campos');
      return;
    }

    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/add/`,
      {
        paquete: paquete,
        clave: clave,
        grupoApg: grupo,
        materia: nombre,
        edificio: edificio,
        salon: salon,
        modalidadGrupo: modalidad,
        tipo: tipo,
        modelo: modelo,
        carga: carga,
        semestre: semestre,
        periodo: periodo,
        horario: horario,
        ingles: ingles,
      },
    ).then((res) => {
      console.log(res);
      if (res.status == 200 || res.status == 201) {
        alert(personalizado.mensaje);
        window.location.href = '../views/Clases';
      } else {
        alert('Error al guardar la información');
      }
    });
  };

  const deleteForm = () => {
    if (!clave || !grupo) {
      alert('Favor de llenar el campo de clave');
      return;
    }

    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/remove/`,
      {
        clave: clave,
        grupo: grupo,
      },
    ).then((res) => {
      console.log(res);
      console.log(clave);
      console.log(grupo);
      if (res.status == 200 || res.status == 201) {
        if (personalizado) {
          alert(personalizado.mensaje);
        }
        // window.location.href = '../views/Clases';
      } else {
        alert('Error al eliminar la información');
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
        marginTop: '50px',
      }}>
        <Typography variant='h4' component='h1' sx={{mb: '2rem'}}>
          {(personalizado != null) ? personalizado.titulo : null}
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
                defaultValue={'Tec 21'}
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
              label='Horario'
              placeholder="LuJu 08:00-10:00/Mi 10:00-12:00"
              variant='outlined'
              style = {{width: 400}}
              onChange={(e) => {
                if (/^(((Lu|Ma|Mi|Ju|Vi)+ ([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9])(\/)*)+$/.test(e.target.value)) {
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
              style={{maxWidth: 150}}
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
              style={{maxWidth: 150}}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            />
            <FormControl style={{width: 150}}>
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
          <Button
            variant='contained'
            color='success'
            onClick={submitForm}
          >
            {personalizado != null ? personalizado.boton : null}
          </Button>
          <Button
            variant='contained'
            onClick={deleteForm}
          >
          </Button>
        </Box>
      </Box>
    </>
  );
}
