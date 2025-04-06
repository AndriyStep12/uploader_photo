'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './PhotoGallery.module.css';

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Fetch photos from the API
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch('/api/photos');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch photos');
        }
        
        setPhotos(data.photos || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhotos();
  }, []);

  // Handle photo deletion
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/photos/${id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete photo');
      }
      
      // Remove the deleted photo from the state
      setPhotos(photos.filter(photo => photo._id !== id));
      
      // Close the modal if the deleted photo was selected
      if (selectedPhoto && selectedPhoto._id === id) {
        setSelectedPhoto(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Open photo detail modal
  const openPhotoDetail = (photo) => {
    setSelectedPhoto(photo);
  };

  // Close photo detail modal
  const closePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  if (loading) {
    return <div className={styles.loading}>Loading photos...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (photos.length === 0) {
    return <div className={styles.noPhotos}>No photos uploaded yet. Be the first to upload!</div>;
  }

  return (
    <div className={styles.galleryContainer}>
      <h2>Photo Gallery</h2>
      
      <div className={styles.photoGrid}>
        {photos.map((photo) => (
          <div key={photo._id} className={styles.photoCard} onClick={() => openPhotoDetail(photo)}>
            <div className={styles.photoImageContainer}>
              <img 
                src={photo.imagePath} 
                alt={photo.name} 
                className={styles.photoImage} 
              />
            </div>
            <div className={styles.photoInfo}>
              <h3>{photo.name}</h3>
              <p>{photo.description.length > 50 
                ? `${photo.description.substring(0, 50)}...` 
                : photo.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className={styles.modal} onClick={closePhotoDetail}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.closeButton} onClick={closePhotoDetail}>&times;</span>
            
            <div className={styles.modalImageContainer}>
              <img 
                src={selectedPhoto.imagePath} 
                alt={selectedPhoto.name} 
                className={styles.modalImage} 
              />
            </div>
            
            <div className={styles.modalInfo}>
              <h2>{selectedPhoto.name}</h2>
              <p>{selectedPhoto.description}</p>
              <p className={styles.uploadDate}>
                Uploaded on {new Date(selectedPhoto.uploadedAt).toLocaleDateString()}
              </p>
              
              <button 
                className={styles.deleteButton} 
                onClick={() => handleDelete(selectedPhoto._id)}
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}