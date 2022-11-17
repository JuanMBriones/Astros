import React from 'react';
import Profe from './components/Profe';

/**
 * editProfe
 * @return {React.Component}
 */
export default function editProfe() {
  return (
    <>
      <Profe
        personalizado = {{titulo: 'Modificar Profesor', boton: 'Modificar', mensaje: 'Profesor modificado correctamente'}}
        flagEdit = {true}
      />
    </>
  );
}
