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
        titulo = 'Modificar Clase'
        flagEdit = {true}
      />
    </>
  );
}
