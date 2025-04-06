import PhotoGallery from '@/components/PhotoGallery';
import styles from "./page.module.css";

export const metadata = {
  title: 'Photo Gallery',
  description: 'View all uploaded photos',
};

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Photo Gallery</h1>
        <PhotoGallery />
      </main>
    </div>
  );
}
