import React, { useState, useRef, useEffect } from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './stylesheets/navStyle.module.css'
function Nav() {
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };
  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) {
      linksContainerRef.current.style.height = `${linksHeight}px`;
    } else {
      linksContainerRef.current.style.height = '0px';
    }
  }, [showLinks]);
  return (
    <nav>
    <div className={styles.navCenter}>
      <div className={`${styles.navHeader}`}>
        INEC ADAMAWA STATE
        <button className={styles.navToggle} onClick={toggleLinks}>
          <FaBars />
        </button>
      </div>
      <div className={styles.linksContainer} ref={linksContainerRef}>
        <ul className={styles.links} ref={linksRef}>
          <li>
            <a href='/sign-in'>Sign in</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  )
}

export default Nav
