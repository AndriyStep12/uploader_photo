import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Photo from '@/models/Photo';
import { parseForm } from '@/lib/uploadHandler';

export async function POST(request) {
  try {
    console.log('POST /api/photos: Starting photo upload process');
    
    // Connect to the database
    try {
      await connectToDatabase();
      console.log('POST /api/photos: Database connected');
    } catch (dbError) {
      console.error('POST /api/photos: Database connection error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed. Please try again later.' },
        { status: 503 }
      );
    }
    
    let fields, file;
    try {
      console.log('POST /api/photos: Parsing form data');
      const formData = await parseForm(request);
      fields = formData.fields;
      file = formData.file;
      console.log('POST /api/photos: Form data parsed successfully');
    } catch (formError) {
      console.error('POST /api/photos: Form parsing error:', formError);
      return NextResponse.json(
        { success: false, message: 'Error processing upload. ' + (formError.message || 'Please try again.') },
        { status: 422 }
      );
    }
    
    // Extract form fields
    const { name, description } = fields;
    
    // Validate required fields
    if (!name || !description) {
      console.error('POST /api/photos: Missing required fields');
      return NextResponse.json(
        { success: false, message: 'Name and description are required' },
        { status: 400 }
      );
    }
    
    // Create a new photo document in the database
    try {
      console.log('POST /api/photos: Creating photo document in database');
      const photo = await Photo.create({
        name: name[0],
        description: description[0],
        imagePath: file.publicPath
      });
      
      console.log('POST /api/photos: Photo created successfully', photo._id);
      // Return success response
      return NextResponse.json(
        { success: true, photo },
        { status: 201 }
      );
    } catch (saveError) {
      console.error('POST /api/photos: Database save error:', saveError);
      return NextResponse.json(
        { success: false, message: 'Error saving photo to database. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('POST /api/photos: Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again later.' },
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