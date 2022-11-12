/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React from 'react';

export default function Landing2() {
  return (
    <>
      {/* Seccion 1 */}
      <div className= 'bg-indigo-600 p-4 flex justify-between items-center'>
        {/* TopPage derecho */}
        <div className='flex items-center'>
          <a href='#' className='inline-block p-2 text-indigo-200 hover:text-indigo-100 mr-2'>Sign Up</a>
          <a href='#' className='inline-block p-2 text-indigo-200 hover:text-indigo-100 mr-2'>About</a>
        </div>

        {/* TopPage izquiero */}
        <div>
          <a href='/../login' className='inline-block py-2 px-4 text-yellow-700 bg-yellow-400
          hover:bg-yellow-300 hover:text-yellow-800 rounded transition ease-in duration-150'>Login</a>
        </div>
      </div>
      {/* Seccion 2 */}
      <div className='md:flex justify-between py-20 px-10 bg-gradient-to-r from-indigo-500 to-blue-500 text-indigo-100'>
        {/* MidPage izquierdo*/}
        <div className='md:w-1/2 mb-10 md:mb-0'>
          <h2 className='text-2xl md:text-4xl lg:text-5xl text-white mb-9'>Bienvenido al sistema de inscripciones para profesores</h2>
          <p className='md:text-2xl lg:text-2xl mb-10'>Espíritu emprendedor con sentido humano</p>

          <a href='#' className='inline-block py-3 px-5 text-lg bg-gray-400 text-gray-800 hover:bg-slate-300 rounded mr-5 transition ease-in duration-150'>Mas información</a>
          <a href='/../login' className='inline-block py-3 px-14 text-lg bg-orange-400 text-orange-800 hover:bg-orange-300 rounded transition ease-in duration-150'>Login</a>
        </div>
        {/* MidPage derecho */}
        <div className='md:w-1/2'>
          <img src="https://tec.mx/sites/default/files/2017-06/colegiaturas.jpg" alt="Profesores" className="w-full rounded shadow-2xl"></img>
        </div>
      </div>
      {/* Seccion 3 */}
      <div>
        <div>
          <img src="" alt=""></img>
          <p></p>
        </div>
        <div>
          <img src="" alt=""></img>
          <p></p>
        </div>
        <div>
          <img src="" alt=""></img>
          <p></p>
        </div>
        <div>
          <img src="" alt=""></img>
          <p></p>
        </div>
      </div>
    </>
  );
};
