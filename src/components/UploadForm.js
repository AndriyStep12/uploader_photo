'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle file selection and generate preview
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!name.trim()) {
      setError('Please enter a name for the photo');
      return;
    }
    
    if (!description.trim()) {
      setError('Please enter a description for the photo');
      return;
    }
    
    if (!file) {
      setError('Please select a photo to upload');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', file);
      
      // Send the request to the API
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload photo');
      }
      
      // Reset form and refresh the page
      setName('');
      setDescription('');
      setFile(null);
      setPreview(null);
      router.refresh();
      
      // Redirect to gallery
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h2>Upload a New Photo</h2>
      
      <form onSubmit={handleSubmit} className={styles.uploadForm}>
        {error && <div className={styles.error}>{error}</div>}
        
        <div className={styles.formGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name for your photo"
            disabled={loading}
            maxLength={60}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description for your photo"
            disabled={loading}
            maxLength={200}
            required
          />
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="image">Photo:</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            required
          />
        </div>
        
        {preview && (
          <div className={styles.previewContainer}>
            <img src={preview} alt="Preview" className={styles.preview} />
          </div>
        )}
        
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload Photo'}
        </button>
      </form>
    </div>
  );
}