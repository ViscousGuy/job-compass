import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, Clock } from 'lucide-react';
import { Job } from '../types';
import { useAppSelector } from '../store/hooks';
import { formatDate } from '../utils/formatDate';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  
  return (
    <Link
      to={`/jobs/${job._id}`}
      className={`${
        isDarkMode
          ? "bg-gray-800 hover:bg-gray-700"
          : "bg-white hover:bg-gray-50"
      } p-6 rounded-lg shadow-md transition`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
          <div className="flex items-center text-gray-500 mb-2">
            <Building2 className="w-4 h-4 mr-1" />
            <span className="mr-4">{job.company}</span>
            <MapPin className="w-4 h-4 mr-1" />
            <span>{job.location}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {job.type}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {job.category}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-blue-600">
            {job.salary}
          </div>
          <div className="flex items-center text-gray-500 mt-2">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">Posted {formatDate(job.postedDate)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;