/* eslint-disable require-jsdoc */
/* eslint-disable react/prop-types */
import React from 'react';
import {useState} from 'react';
import {
  Button,
  Link,
} from '@mui/material';

/**
 * @return {Object} The render component
 */
export default function Landing() {
  const [isActive, setIsActive] = useState(false);
  const handleClick = () => {
    setIsActive((current) => !current);
  };

  return (
    <div
      // style={{
      //   display: 'flex',
      //   alignItems: 'center',
      //   justifyContent: 'center',
      //   height: '100vh',
      // }}
    >

      <br />
      <br />
      <br />
      <br />

      <img
        src="https://upload.wikimedia.org/wikipedia/commons/4/47/Logo_del_ITESM.svg"
        alt="Trees"
        height="250"
      />

      <br />
      <br />

      <span
        style={{
          color: 'blue',
          fontSize: '1.2em',
          fontWeight: 'bold',
        }}
      >
        Sistema de Inscripciones
      </span>

      <br />
      <br />

      <Button
        color='inherit'
        style={{
          backgroundColor: isActive ? '#2196F3' : '',
          color: isActive ? 'white' : '',
        }}
        onClick={handleClick}
      >
        <Link
          href='/../login'
          underline='none'
          color='blue'
        >
          Login
        </Link>
      </Button>
    </div>
  );
};
