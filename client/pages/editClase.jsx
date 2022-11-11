import React from 'react';
import Clase from './components/Clase';

/**
 * editClase
 * @return {React.Component}
 */
export default function editClase() {
  return (
    <>
      <Clase
        personalizado={{titulo: 'Modificar Clase', boton: 'Modificar', mensaje: 'Clase modificada correctamente'}}
        flagEdit = {true}
      />
    </>
  );
}
