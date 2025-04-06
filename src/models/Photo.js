import mongoose from 'mongoose';

const PhotoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this photo'],
    maxlength: [60, 'Name cannot be more than 60 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this photo'],
    maxlength: [200, 'Description cannot be more than 200 characters']
  },
  imagePath: {
    type: String,
    required: [true, 'Please provide an image path']
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Photo || mongoose.model('Photo', PhotoSchema);