import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { updateApplicationStatus } from '../store/thunks/applicationThunks';
import { toast } from 'react-hot-toast';

interface ApplicationStatusButtonProps {
  applicationId: string;
  currentStatus: string;
}

const ApplicationStatusButton: React.FC<ApplicationStatusButtonProps> = ({ 
  applicationId, 
  currentStatus 
}) => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const statusOptions = [
    { value: 'pending', label: 'Pending', color: 'bg-yellow-500' },
    { value: 'reviewed', label: 'Reviewed', color: 'bg-blue-500' },
    { value: 'accepted', label: 'Accepted', color: 'bg-green-500' },
    { value: 'rejected', label: 'Rejected', color: 'bg-red-500' }
  ];

  const handleStatusChange = async (status: string) => {
    if (status === currentStatus) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      await dispatch(updateApplicationStatus({ applicationId, status })).unwrap();
      toast.success(`Application status updated to ${status}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  const currentStatusOption = statusOptions.find(option => option.value === currentStatus);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className={`px-4 py-2 rounded-md text-white ${currentStatusOption?.color || 'bg-gray-500'} flex items-center justify-between w-40`}
      >
        <span>{currentStatusOption?.label || 'Unknown'}</span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute mt-1 w-40 bg-white rounded-md shadow-lg z-10">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                option.value === currentStatus ? 'bg-gray-100 font-medium' : ''
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-md">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatusButton;