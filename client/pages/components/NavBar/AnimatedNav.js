/* eslint-disable react/prop-types */
/* eslint-disable require-jsdoc */
/* eslint-disable react/no-unknown-property */
import React, {useEffect} from 'react';
import styles from '../../../styles/AnimatedNav.module.scss';
import '../../../styles/AnimatedNav.module.scss';

const AnimatedNav = (props) => {
  useEffect(() => {
    const indicator = document.querySelector('.nav-indicator');
    const items = document.querySelectorAll('.nav-item');
    const handleIndicator = (el) => {
      items.forEach((item) => {
        item.classList.remove('is-active');
        item.removeAttribute('style');
      });

      indicator.style.width = `${el.offsetWidth}px`;
      indicator.style.left = `${el.offsetLeft}px`;
      indicator.style.backgroundColor = el.getAttribute('active-color');

      el.classList.add('is-active');
      el.style.color = el.getAttribute('active-color');
    };

    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        handleIndicator(e.target);
      });
      item.classList.contains('is-active') && handleIndicator(item);
    });
  });

  function MakeTabs(navInfo) {
    const info = Object.keys(navInfo.navInfo).map(function(key, i) {
      return (
        <a
          onClick={navInfo.navInfo[key].onClick}
          href={navInfo.navInfo[key].url}
          className={`${styles.nav_item} ${styles.is_active}`}
          active-color={navInfo.navInfo[key].color}
          key={i}
        >
          {key}
        </a>
      );
    });
    return info;
  }

  return (
    <>
      <br />
      <div>
        <nav className={styles.nav}>
          <MakeTabs navInfo={props.navInfo} />
          <span className={styles.nav_indicator}></span>
        </nav>
      </div>
      <br />
    </>
  );
};

export default AnimatedNav;
