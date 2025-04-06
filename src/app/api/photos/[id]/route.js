import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { promises as fs } from 'fs';
import path from 'path';

// Helper function to get a photo by ID
async function getPhotoById(id) {
  await connectToDatabase();
  const photo = await Photo.findById(id);
  if (!photo) {
    throw new Error('Photo not found');
  }
  return photo;
}

// GET a single photo by ID
export async function GET(request, { params }) {
  try {
    const photo = await getPhotoById(params.id);
    return NextResponse.json({ success: true, photo }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Photo not found' ? 404 : 500 }
    );
  }
}

// DELETE a photo by ID
export async function DELETE(request, { params }) {
  try {
    const photo = await getPhotoById(params.id);
    
    // Delete the image file from the server
    if (photo.imagePath) {
      const filePath = path.join(process.cwd(), 'public', photo.imagePath);
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue even if file deletion fails
      }
    }
    
    // Delete the photo document from the database
    await Photo.findByIdAndDelete(params.id);
    
    return NextResponse.json(
      { success: true, message: 'Photo deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.message === 'Photo not found' ? 404 : 500 }
    );
  }
}