import React from 'react';

/**
 * @return {Component}
 */
export default function Footer() {
  return (
    // align items to the center
    <footer>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2rem',
      }}>
        <p>
          <strong>Sistema de Inscriptiones+</strong> by{' '}
          <a href="httpw://www.tec.mx">ITESM</a>.
        </p>
      </div>
    </footer>
  );
}
