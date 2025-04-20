import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { config } from "../config/env.config.js";

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// PDF file filter
const pdfFileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// Configure storage for resumes
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-applications/resumes",
    allowed_formats: ["pdf"],
    format: "pdf",
    resource_type: "auto",
    // @ts-ignore
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `resume-${uniqueSuffix}`;
    },
  } as any,
});

// Configure storage for cover letters
const coverLetterStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "job-applications/cover-letters",
    allowed_formats: ["pdf"],
    format: "pdf",
    resource_type: "auto",
    // @ts-ignore
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      return `cover-letter-${uniqueSuffix}`;
    },
  } as any,
});

// Create multer instances
const uploadResume = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: pdfFileFilter,
});

const uploadCoverLetter = multer({
  storage: coverLetterStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: pdfFileFilter,
});

// Combined middleware for handling multiple file types
export const uploadMiddleware = {
  single: (fieldName: string) => {
    if (fieldName === "resume") {
      return uploadResume.single(fieldName);
    } else if (fieldName === "coverLetter") {
      return uploadCoverLetter.single(fieldName);
    }
    throw new Error(`Unsupported field name: ${fieldName}`);
  },
    fields: (fields: { name: string; maxCount: number }[]) => {
    // For multiple fields, we use a single storage configuration
    const storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'job-applications',
        format: 'pdf',
        resource_type: 'auto',
        // @ts-ignore
        public_id: (req, file) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          return `${file.fieldname}-${uniqueSuffix}`;
        }
      } as any,
    });



    return multer({
      storage: storage,
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
      },
      fileFilter: pdfFileFilter,
    }).fields(fields);
  },
};

// Export cloudinary for direct operations
export { cloudinary };
