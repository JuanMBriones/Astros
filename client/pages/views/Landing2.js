/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React from 'react';

export default function Landing2() {
  return (
    <>
      <div className='mt-36'>
        {/* Seccion 1 */}
        <div>
          <h2 className='mb-5 text-2xl md:text-4xl lg:text-5xl font-semibold'>Profesores</h2>
          <div className='flex justify-center'>
            <a href='./views/Profesores'>
              <button className="mr-20 mt-2 w-48 h-48 rounded-full border border-black bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-2xl">Horario & Clases</button>
            </a>
            <a href='#'>
              <button className="mt-2 w-48 h-48 rounded-full border border-black bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-2xl">Agregar Profesores</button>
            </a>
          </div>
        </div>
        {/* Seccion 2 */}
        <div className='mt-10'>
          <h2 className='mb-5 text-2xl md:text-4xl lg:text-5xl font-semibold'>Clases</h2>
          <div className='flex justify-center'>
            <a href='./views/ClasesProfesor'>
              <button className="mr-20 w-48 h-48 rounded-full border border-black bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-2xl">Asignar Profesores</button>
            </a>
            <a href='#'>
              <button className="mr-20 mt-10 w-48 h-48 rounded-full border border-black bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-2xl">Asignar Clases</button>
            </a>
            <a href='/../uploadFile'>
              <button className="w-48 h-48 rounded-full border border-black bg-gradient-to-r from-green-400 to-blue-500 hover:from-pink-500 hover:to-yellow-500 text-white text-2xl">Agregar Clases por Archivo</button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
