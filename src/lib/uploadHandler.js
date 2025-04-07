import { promises as fs } from 'fs';
import path from 'path';

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

// Parse form data for Next.js App Router
export const parseForm = async (request) => {
  try {
    // Ensure upload directory exists
    await ensureUploadDir();
    
    // Configuration constants
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
    
    // Get form data from the request
    const formData = await request.formData();
    
    // Create objects to store fields and files
    const fields = {};
    const files = {};
    
    // Process each entry in the formData
    for (const [key, value] of formData.entries()) {
      // Check if the entry is a file
      if (value instanceof File) {
        // Check file size
        if (value.size > MAX_FILE_SIZE) {
          throw new Error(`File size exceeds the ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`);
        }
        
        // Create a buffer from the file
        const buffer = Buffer.from(await value.arrayBuffer());
        
        // Generate a unique filename
        const timestamp = Date.now();
        const originalFilename = value.name || 'unknown';
        const newFilename = `${timestamp}-${originalFilename}`;
        const filePath = path.join(uploadDir, newFilename);
        
        // Write the file to disk
        await fs.writeFile(filePath, buffer);
        
        // Store file information
        if (!files[key]) {
          files[key] = [];
        }
        
        files[key].push({
          originalFilename: value.name,
          filepath: filePath,
          mimetype: value.type,
          size: value.size
        });
      } else {
        // Handle form fields
        if (!fields[key]) {
          fields[key] = [];
        }
        fields[key].push(value);
      }
    }
    
    // Get the first file from the files object
    const file = files.image?.[0];
    
    if (!file) {
      throw new Error('No file uploaded');
    }
    
    // Return the processed form data
    return {
      fields,
      file: {
        ...file,
        filename: path.basename(file.filepath),
        publicPath: `/uploads/${path.basename(file.filepath)}`
      }
    };
  } catch (error) {
    console.error('Form processing error:', error);
    throw error;
  }
};