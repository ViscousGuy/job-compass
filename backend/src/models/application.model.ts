import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  status: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  appliedDate: Date;
  coverLetter: string;
  resume: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job ID is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'rejected', 'accepted'],
      default: 'pending',
    },
    appliedDate: {
      type: Date,
      default: Date.now,
    },
    coverLetter: {
      type: String,
      required: [true, 'Cover letter is required'],
    },
    resume: {
      type: String,
      required: [true, 'Resume is required'],
    },
  },
  { timestamps: true }
);

export default mongoose.model<IApplication>('Application', applicationSchema);