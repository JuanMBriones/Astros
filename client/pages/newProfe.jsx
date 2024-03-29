import React, {useEffect} from 'react';
import Profe from './components/Profe';
// import {useRouter} from 'next/router';
import {motion} from 'framer-motion';

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
  // const router = useRouter();

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
          // router.push('/login');
          window.location.href = '/login';
          console.log('not logged in');
        }
      } else {
        // router.push('/login');
        window.location.href = '/login';
        // next router send to login

        console.log('not logged in');
      }
    }
  }, []);

  return (
    <>
      <motion.div
        initial={{
          y: 25,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.75,
          ease: 'easeOut',
          delay: 0.25,
        }}
      >
        <Profe
          personalizado = {{titulo: 'Nuevo Profesor', boton: 'Crear', mensaje: 'Profesor creado correctamente'}}
          flagEdit = {false}
        />
      </motion.div>
    </>
  );
}
