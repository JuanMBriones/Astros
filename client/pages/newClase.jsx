import React, {useEffect} from 'react';
import Clase from './components/Clase';
import {useRouter} from 'next/router';

/**
 * newClase
 * @return {React.Component}
 */
export default function newClase() {
  const router = useRouter();

  useEffect(() => {
    const profInfo = localStorage.getItem('professor');
    console.log(profInfo);
    if (profInfo) {
      const profInfoJson = JSON.parse(profInfo);
      console.log(profInfoJson);

      if (profInfoJson && profInfoJson.profe) {
        if (profInfoJson.profe.rol && profInfoJson.profe.rol === 'admin') {
          console.log('🎉');
        } else {
          router.push('/login');
          // window.location.href = '/login';
          console.log('not logged in');
        }
      } else {
        router.push('/login'); // window.location.href = '/login';
        // next router send to login

        console.log('not logged in');
      }
    }
  }, []);

  return (
    <>
      <Clase
        personalizado = {{titulo: 'Nueva Clase', boton: 'Crear', mensaje: 'Clase creada correctamente'}}
        flagEdit = {false}
      />
    </>
  );
}
