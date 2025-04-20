import React, { useState, useRef } from "react";
import { Send, FileText, X } from "lucide-react";

interface JobApplicationFormProps {
  jobId: string;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  isSubmitting?: boolean;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({
  jobId,
  onCancel,
  onSubmit,
  isSubmitting = false,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const coverLetterInputRef = useRef<HTMLInputElement>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.includes("pdf")) {
        setResumeError("Please upload a PDF file");
        setResumeFile(null);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setResumeError("File size should be less than 5MB");
        setResumeFile(null);
        return;
      }

      setResumeFile(file);
      setResumeError(null);
    }
  };

  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.includes("pdf")) {
        setCoverLetterError("Please upload a PDF file");
        setCoverLetterFile(null);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setCoverLetterError("File size should be less than 5MB");
        setCoverLetterFile(null);
        return;
      }

      setCoverLetterFile(file);
      setCoverLetterError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeFile) {
      setResumeError("Resume is required");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resumeFile);

    if (coverLetterFile) {
      formData.append("coverLetter", coverLetterFile);
    }

    onSubmit(formData);
  };

  return (
    <div className="mt-4 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Apply for this position</h3>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Resume (PDF) <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".pdf"
                ref={resumeInputRef}
                onChange={handleResumeChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => resumeInputRef.current?.click()}
                className="px-4 py-2 border rounded-lg flex items-center text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {resumeFile ? resumeFile.name : "Select Resume"}
              </button>
              {resumeFile && (
                <button
                  type="button"
                  onClick={() => setResumeFile(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            {!resumeFile && (
              <p className="mt-1 text-xs text-red-500">Resume is required</p>
            )}
            {resumeError && (
              <p className="text-red-500 text-sm mt-1">{resumeError}</p>
            )}
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">
              Cover Letter (PDF){" "}<span className="text-red-500">*</span>
            </label>
            <div className="flex items-center">
              <input
                type="file"
                accept=".pdf"
                ref={coverLetterInputRef}
                onChange={handleCoverLetterChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverLetterInputRef.current?.click()}
                className="px-4 py-2 border rounded-lg flex items-center text-sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                {coverLetterFile ? coverLetterFile.name : "Select Cover Letter"}
              </button>
              {coverLetterFile && (
                <button
                  type="button"
                  onClick={() => setCoverLetterFile(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X size={16} />
                </button>
              )}
              {coverLetterError && (
                <p className="text-red-500 text-sm mt-1">{coverLetterError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!resumeFile || isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobApplicationForm;
