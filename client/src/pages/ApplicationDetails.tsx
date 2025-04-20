import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchApplicationById } from '../store/thunks/applicationThunks';
import { clearCurrentApplication } from '../store/slices/applicationSlice';
import { toast } from 'react-hot-toast';
import { ArrowLeft, FileText, User, Calendar, Briefcase, Building } from 'lucide-react';
import ApplicationStatusButton from '../components/ApplicationStatusButton';

const ApplicationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentApplication, loading, error } = useAppSelector((state) => state.application);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchApplicationById(id));
    }

    return () => {
      dispatch(clearCurrentApplication());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </button>
      </div>
    );
  }

  if (!currentApplication) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-xl mb-4">Application not found</div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const { jobId, userId, status, appliedDate, resume, coverLetter } = currentApplication;

  return (
    <div className={`max-w-4xl mx-auto py-8 px-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} hover:underline`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </button>
      </div>

      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6 mb-6`}>
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold">{jobId?.title || 'Unknown Job'}</h1>
          <ApplicationStatusButton applicationId={currentApplication._id} currentStatus={status} />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Details</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <Building className="w-5 h-5 mr-3 text-gray-500" />
                <span>{jobId?.company || 'Unknown Company'}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="w-5 h-5 mr-3 text-gray-500" />
                <span>{jobId?.title || 'Unknown Position'}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Applicant Details</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-3 text-gray-500" />
                <span>{userId?.name || 'Unknown Applicant'}</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{userId?.email || 'Unknown Email'}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3 text-gray-500" />
                <span>Applied on {new Date(appliedDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Resume
          </h2>
          <div className="mt-4">
            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Resume
            </a>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Cover Letter
          </h2>
          <div className="mt-4">
            <a
              href={coverLetter}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Cover Letter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;