import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    originalName: { type: String, required: true },
    type: { type: String, enum: ['file', 'url'], default: 'file' },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'ingested', 'failed'],
      default: 'pending',
    },
    chunkCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Document', documentSchema);
