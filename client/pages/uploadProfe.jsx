/* eslint-disable require-jsdoc */
import React, {useEffect, useState} from 'react';
import Papa from 'papaparse';
import {Button, Grid} from '@mui/material';
import {FileUploader} from 'react-drag-drop-files';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import SaveIcon from '@mui/icons-material/Save';

const allowedExtensions = ['csv'];

export default function uploadProfe() {
  const columns = [
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
      name: 'Departamento',
      selector: (row) => row.DeptoProf,
      sortable: true,
    },
    {
      name: 'CIP',
      selector: (row) => row.CIP,
      sortable: true,
    },
    {
      name: 'Modalidad',
      selector: (row) => row.Modalidad,
      sortable: true,
    },
    {
      name: 'Carga Permitida',
      selector: (row) => row.CargaPermitida,
      sortable: true,
    },
  ];

  const [data, setData] = useState([]);
  const [dataTable, setDataTable] = useState([]);
  const [file, setFile] = useState('');

  const handleFileChange = (file) => {
    setFile(file);
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
      data.forEach(async (profesores) => {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profe`, {
          deptoProf: profesores.DeptoProf,
          nombre: profesores.Nombre,
          correo: profesores.Correo,
          nomina: profesores.Nomina,
          modalidad: profesores.Modalidad,
          cargaPermitida: profesores.CargaPermitida,
          cip: profesores.CIP,
          entrada: profesores.Entrada,
        });
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
              justifyContent='center'
              style={{minHeight: '100vh'}}
              spacing={2}
              sx={{mt: 4}}
            >
              <Grid item xs={9} alignItems='center'>
                <DataTable
                  title="Profesores a ser cargados"
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
