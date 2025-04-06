'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">Photo Upload App</Link>
      </div>
      <div className={styles.navLinks}>
        <Link 
          href="/" 
          className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`}
        >
          Gallery
        </Link>
        <Link 
          href="/upload" 
          className={`${styles.navLink} ${pathname === '/upload' ? styles.active : ''}`}
        >
          Upload Photo
        </Link>
      </div>
    </nav>
  );
}