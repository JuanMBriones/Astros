import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

/**
 * @param {Object} props
 * @return {Object} The render component
 */
export default function Filter(props) {
  return (
    <div>
      <FormControl variant="outlined" sx={{width: '105%', height: '105%', marginLeft: 3}}>
        <InputLabel id="demo-simple-select-outlined-label">Estados</InputLabel>
        <Select
          onChange={(event) => {
            // props.filterCountries(event.target.value);
          }}
        >
          <MenuItem value={''}><em>Todos</em></MenuItem>
          <MenuItem value={'Africa'}>En proceso</MenuItem>
          <MenuItem value={'Americas'}>Enviado</MenuItem>
          <MenuItem value={'Asia'}>Terminado</MenuItem>
          <MenuItem value={'Europe'}>Actualizado</MenuItem>
          <MenuItem value={'Oceania'}>Carga cero</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}
