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
        titulo = 'Nuevo Profesor'
        flagEdit = {false}
      />
    </>
  );
}
