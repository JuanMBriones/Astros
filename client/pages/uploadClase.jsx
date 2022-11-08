/* eslint-disable require-jsdoc */
import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {Button, Grid} from '@mui/material';
import {FileUploader} from 'react-drag-drop-files';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import SaveIcon from '@mui/icons-material/Save';

const allowedExtensions = ['csv'];

export default function uploadClase() {
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
  ];

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  // const [error, setError] = useState('');
  const [file, setFile] = useState('');
  let flag = 0;

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
      if (flag === 0) {
        return '632e0c989d2a84fb1f9b2b5f';
      } else {
        return '634fb0298970745a8a5ae90d';
      }
    }
    return await professor.profe._id;
  };

  useEffect(() => {
    async function postRecords() {
      data.forEach(async (clase) => {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/clase/add`, {
          clave: clase['Clave'],
          grupoApg: clase['Grupo APG'],
          materia: clase['Materia'],
          propuesta: 'Tec20',
          carga: clase['Carga'],
          horario: '',
          modalidadGrupo: clase['Modalidad Grupo'],
          profesor: await professorGetId(clase['Nomina']),
          cip: [],
        });

        flag++;
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

      console.log(parsedData);

      const slice = parsedData.slice(0, 2);
      setData(slice);
      setDataTable(parsedData);
    };
    reader.readAsText(file);

    // console.log(await professorExists('L12345678'));
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
          </>
        ) : (
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
              <Button
                variant="contained"
                onClick={handleParse}
                // center button
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
              Upload
              </Button>
            </Grid>
          </Grid>
        )
      }
    </>
  );
};
