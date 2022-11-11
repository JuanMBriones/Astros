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
        titulo = 'Modificar Profesor'
        flagEdit = {true}
      />
    </>
  );
}
