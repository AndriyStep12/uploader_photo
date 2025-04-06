import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { parseForm } from '@/lib/uploadHandler';

export async function POST(request) {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse the form data
    const { fields, file } = await parseForm(request);
    
    // Extract form fields
    const { name, description } = fields;
    
    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { success: false, message: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Create a new photo document in the database
    const photo = await Photo.create({
      name: name[0],
      description: description[0],
      imagePath: file.publicPath
    });
    
    // Return success response
    return NextResponse.json(
      { success: true, photo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error uploading photo' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Connect to the database
    await connectToDatabase();
    
    // Fetch all photos, sorted by most recent first
    const photos = await Photo.find({}).sort({ uploadedAt: -1 });
    
    // Return success response
    return NextResponse.json(
      { success: true, photos },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching photos:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error fetching photos' },
      { status: 500 }
    );
  }
}