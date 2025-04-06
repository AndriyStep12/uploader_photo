import { promises as fs } from 'fs';
import path from 'path';
import formidable from 'formidable';

// Set up the upload directory
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Ensure upload directory exists
export const ensureUploadDir = async () => {
  try {
    await fs.access(uploadDir);
  } catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
  }
};

// Parse form data with formidable
export const parseForm = async (req) => {
  await ensureUploadDir();
  
  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      
      // Get the first file from the files object
      const file = files.image?.[0];
      
      if (!file) {
        reject(new Error('No file uploaded'));
        return;
      }
      
      // Generate a unique filename
      const timestamp = Date.now();
      const originalFilename = file.originalFilename || 'unknown';
      const newFilename = `${timestamp}-${originalFilename}`;
      const newPath = path.join(uploadDir, newFilename);
      
      // Rename the file to include timestamp
      fs.rename(file.filepath, newPath)
        .then(() => {
          resolve({
            fields,
            file: {
              ...file,
              filepath: newPath,
              filename: newFilename,
              publicPath: `/uploads/${newFilename}`
            }
          });
        })
        .catch(reject);
    });
  });
};