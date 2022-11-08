import React from 'react';
import {Typography, Box} from '@mui/material';

/**
 * newClase
 * @return {React.Component}
 */
export default function newClase() {
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
        height: '200px',
        marginTop: '150px',
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
          <Typography
            variant='body1'
            component='p'
            sx={{mb: '1rem'}}
          >
            Login using 🔒
          </Typography>
        </Box>
      </Box>
    </>
  );
}
