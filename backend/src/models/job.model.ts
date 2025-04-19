import mongoose, { Document, Schema } from 'mongoose';

export interface IJob extends Document {
  employerId: mongoose.Types.ObjectId;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  postedDate: Date;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    employerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employer ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Job type is required'],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, 'Salary information is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requirements: {
      type: [String],
      required: [true, 'Job requirements are required'],
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: [true, 'Job category is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', jobSchema);