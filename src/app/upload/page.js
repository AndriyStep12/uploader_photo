import UploadForm from '@/components/UploadForm';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Upload Photo',
  description: 'Upload a new photo to the gallery',
};

export default function UploadPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.pageTitle}>Upload Photo</h1>
        <UploadForm />
      </main>
    </div>
  );
}