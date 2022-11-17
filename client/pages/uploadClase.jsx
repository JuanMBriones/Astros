/* eslint-disable require-jsdoc */
import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {Button, Grid} from '@mui/material';
import {FileUploader} from 'react-drag-drop-files';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import SaveIcon from '@mui/icons-material/Save';
import {useRouter} from 'next/router';
import {motion} from 'framer-motion';

const allowedExtensions = ['csv'];

export default function uploadClase() {
  const router = useRouter();

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
          router.push('/login');
          // window.location.href = '/login';
          console.log('not logged in');
        }
      } else {
        router.push('/login'); // window.location.href = '/login';
        // next router send to login

        console.log('not logged in');
      }
    }
  }, []);

  const columns = [
    {
      name: 'Materia',
      selector: (row) => row.Materia,
      sortable: true,
    },
    {
      name: 'Clave',
      selector: (row) => row.Clave,
      sortable: true,
    },
    {
      name: 'TipoUf',
      selector: (row) => row.TipoUf,
      sortable: true,
    },
    {
      name: 'Paquete',
      selector: (row) => row.Paquete,
      sortable: true,
    },
    {
      name: 'Grupo APG',
      selector: (row) => row.GrupoAPG,
      sortable: true,
    },
    {
      name: 'Salon',
      selector: (row) => row.Salon,
      sortable: true,
    },
    {
      name: 'Aula',
      selector: (row) => row.Aula,
      sortable: true,
    },
    {
      name: 'DeptoProf',
      selector: (row) => row.DeptoProf,
      sortable: true,
    },
    {
      name: 'Nomina',
      selector: (row) => row.Nomina,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: (row) => row.Nombre,
      sortable: true,
    },
    {
      name: 'Correo',
      selector: (row) => row.Correo,
      sortable: true,
    },
    {
      name: 'CIP',
      selector: (row) => row.CIP,
      sortable: true,
    },
    {
      name: 'Modalidad',
      selector: (row) => row.ModalidadGrupo,
      sortable: true,
    },
    {
      name: 'Carga Permitida',
      selector: (row) => row.CargaPermitida,
      sortable: true,
    },
    {
      name: 'Horario',
      selector: (row) => row.HorarioBloqueCompleto,
      sortable: true,
    },
  ];

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState('');
  // let flag = 0;

  const handleFileChange = (file) => {
    setFile(file);
  };

  const professorGetId = async (id) => {
    const professor = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profe/`,
      {
        params:
          {
            profesor: id,
          },
      },
    ).then((res) => {
      const professors = res.data;

      return professors;
    });

    if (await professor.profe) {
      console.log('professor exists');
    }
    if (await professor.profe === null) {
      console.log('professor does not exist');
      /* if (flag === 0) {
        return '632e0c989d2a84fb1f9b2b5f';
      } else {
        return '634fb0298970745a8a5ae90d';
      } */
    }
    return await professor.profe._id;
  };

  // TODO: Anadir un alert para el profe que ya existe
  /**
   err : CustomError: Profesor already exists
      at /Users/juanma/Developer/Projects/CSProject/Astros/server/controllers/Profesor/profesorCtr.js:390:11
      at processTicksAndRejections (node:internal/process/task_queues:96:5) {
    statusCode: 400
  }
  */
  useEffect(() => {
    async function postRecords() {
      data.forEach(async (clase) => {
        const inglesValue = clase['Ingles'] ? true : false;
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/add`, {
          clave: clase['Clave'],
          grupoApg: clase['GrupoAPG'],
          materia: clase['Materia'],
          modelo: clase['Modelo'],
          carga: clase['Carga'],
          horario: {
            completo: clase['HorarioBloqueCompleto'],
            semana1: clase['Semana1'],
            semana2: clase['Semana2'],
            semana3: clase['Semana3'],
            semana4: clase['Semana4'],
            semana5: clase['Semana5'],
            semana6: clase['Semana6'],
            semana7: clase['Semana7'],
            semana8: clase['Semana8'],
            semana9: clase['Semana9'],
            semana10: clase['Semana10'],
            semana11: clase['Semana11'],
            semana12: clase['Semana12'],
            semana13: clase['Semana13'],
            semana14: clase['Semana14'],
            semana15: clase['Semana15'],
            semana16: clase['Semana16'],
            semana17: clase['Semana17'],
            semana18: clase['Semana18'],
          },
          modalidadGrupo: clase['ModalidadGrupo'],
          profesor: await professorGetId(clase['Nomina']), // todo
          cip: clase['CIP'],
          edificio: clase['Edificio'],
          salon: clase['Aula'],
          ingles: inglesValue,
          paquete: clase['Paquete'],
          periodo: clase['Periodo'],
        });
        // flag++;
        console.log(clase);
      });
      console.log(data);
    };

    postRecords();
  }, [data]);

  const handleParse = async () => {
    if (!file) return setError('Enter a valid file');
    const reader = new FileReader();

    reader.onload = async ({target}) => {
      const csv = Papa.parse(target.result, {header: true});
      const parsedData = csv?.data;
      // const columns = Object.keys(parsedData[0]);
      const slice = parsedData.slice(0, 2);

      setData(slice);
      setDataTable(parsedData);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    async function parse() {
      if (file !== '') {
        await handleParse();
      }
    }
    parse();
  }, [file]);

  return (
    <>
      {
        file !== '' ? (
          <>
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
              <Grid
                container
                direction="row"
                justifyContent="center"
                spacing={2}
                sx={{
                  marginTop: '0.5rem',
                }}
              >
                <Grid item xs={3}>
                  <Button
                    variant='contained'
                    style={{
                      borderRadius: 10,
                      backgroundColor: '#252323',
                    }}
                    onClick={() => {
                      setFile('');
                    } }
                  >
                  Cargar otro archivo 📁
                  </Button>
                </Grid>
                <Grid item xs={3}>
                  <Button
                    variant='contained'
                    startIcon={<SaveIcon />}
                    style={{
                      borderRadius: 10,
                      backgroundColor: '#252323',
                    }}
                    onClick={() => {
                      setFile('');
                    } }
                  >
                Guardar
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                // alignItems='center'
                justifyContent='center'
                style={{minHeight: '100vh'}}
                spacing={2}
                sx={{mt: 4}}
              >
                <Grid item xs={9} alignItems='center'>
                  <DataTable
                    title="Clases a ser cargadas"
                    columns={columns}
                    data={dataTable}
                    pagination
                    sx={{
                      display: 'flex',
                      width: '100%',
                    }} />
                </Grid>
              </Grid>
            </motion.div>
          </>
        ) : (
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
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              style={{minHeight: '100vh'}}
            >

              <Grid
                item
                xs={3}
                alignItems='center'
                sx={{
                  mt: 4,
                }}
              >
                <h1
                  style={{textAlign: 'center'}}
                >
              Upload a file
                </h1>
                <FileUploader
                  handleChange={handleFileChange}
                  name="file"
                  types={allowedExtensions}
                />
                <br />
              </Grid>
            </Grid>
          </motion.div>
        )
      }
    </>
  );
};
