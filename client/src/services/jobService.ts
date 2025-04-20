import axios from 'axios';
import { JobsResponse } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL;

// Get all jobs with filtering, pagination, and search
export const getJobs = async (
  page = 1, 
  limit = 10, 
  search = '', 
  category = ''
): Promise<JobsResponse> => {
  try {
    let url = `${API_URL}/jobs?page=${page}&limit=${limit}`;
    
    if (search) {
      url += `&search=${search}`;
    }
    
    if (category) {
      url += `&category=${category}`;
    }
    
    const response = await axios.get(url, {
      withCredentials: true
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get job by ID
export const getJobById = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/jobs/${id}`, {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};