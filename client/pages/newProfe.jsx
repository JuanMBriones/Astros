import React from 'react';
import Profe from './components/Profe';

// TODO: Anadir un alert para el profe que ya existe
/**
 err : CustomError: Profesor already exists
    at /Users/juanma/Developer/Projects/CSProject/Astros/server/controllers/Profesor/profesorCtr.js:390:11
    at processTicksAndRejections (node:internal/process/task_queues:96:5) {
  statusCode: 400
}
 */
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
