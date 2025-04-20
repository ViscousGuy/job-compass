import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Building2, Clock, BriefcaseIcon, Send } from "lucide-react";
import { api } from "../utils/api";
import { Job } from "../types";
import JobApplicationForm from "../components/JobApplicationForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createApplication } from "../store/thunks/applicationThunks";
import { resetApplicationState } from "../store/slices/applicationSlice";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentUser = useAppSelector((state) => state.user);

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/jobs/${id}`);
        setJob(response.data.data);
      } catch (err) {
        console.error("Failed to fetch job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApplyClick = () => {
    if (!currentUser) {
      // Redirect to login if not logged in
      navigate("/login", { state: { from: `/jobs/${id}` } });
      return;
    }

    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = async (formData: FormData) => {
    try {
      setSubmitting(true);
      const result = await dispatch(createApplication(formData));

      // Check if the action was successful
      if (!result.error) {
        // Show success message
        toast.success("Application submitted successfully!");
        setApplicationSuccess(true);
        setShowApplicationForm(false);

        // Reset application state after 3 seconds
        setTimeout(() => {
          dispatch(resetApplicationState());
        }, 3000);
      } else {
        // Handle error from the action
        toast.error(result.error || "Failed to submit application");
        console.error("Application submission failed:", result.error);
      }
    } catch (err) {
      // Handle any other errors
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit application";
      toast.error(errorMessage);
      console.error("Application submission failed:", err);
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100"
        } rounded-lg`}
      >
        <p className="text-xl">{error || "Job not found"}</p>
        <Link
          to="/jobs"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-8 mb-8`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {job.salary}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {currentUser?.currentUser?.role === "jobseeker" &&
          !showApplicationForm && (
            <button
              onClick={handleApplyClick}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
            >
              <Send className="w-5 h-5 mr-2" />
              Apply Now
            </button>
          )}
        {applicationSuccess && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg">
            Your application has been submitted successfully! The employer will
            review it soon.
          </div>
        )}
        {showApplicationForm && (
          <JobApplicationForm
            jobId={job._id}
            onCancel={() => setShowApplicationForm(false)}
            onSubmit={handleApplicationSubmit}
            isSubmitting={submitting}
          />
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8 mb-8`}
          >
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="mb-6 whitespace-pre-line">{job.description}</p>

            <h3 className="text-xl font-bold mb-4">Requirements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8`}
          >
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
            <p className="text-gray-500">
              {job.employerId?.company ||
                "Leading technology company specializing in innovative solutions..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
