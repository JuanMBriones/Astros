import React from 'react';
import Profe from './components/Profe';

/**
 * editProfe
 * @return {React.Component}
 */
export default function newProfe() {
  return (
    <>
      <Profe
        personalizado = {{titulo: 'Nuevo Profesor', boton: 'Crear', mensaje: 'Profesor creado correctamente'}}
        flagEdit = {false}
      />
    </>
  );
}
