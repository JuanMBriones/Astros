import React from 'react';
import Clase from './components/Clase';

/**
 * newClase
 * @return {React.Component}
 */
export default function newClase() {
  return (
    <>
      <Clase
        personalizado = {{titulo: 'Nueva Clase', boton: 'Crear', mensaje: 'Clase creada correctamente'}}
        flagEdit = {false}
      />
    </>
  );
}
