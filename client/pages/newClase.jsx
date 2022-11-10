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
        titulo = 'Nueva Clase'
        flagEdit = {false}
      />
    </>
  );
}
