import React, { useState, useEffect } from "react";
import { Search, MapPin, Building2, Clock, AlertCircle } from "lucide-react";
import { useAppSelector } from "../store/hooks";
import { getJobs } from "../services/jobService";
import { Job, JobsResponse } from "../types";
import JobCard from "../components/JobCard";
import Pagination from "../components/Pagination";

function Jobs() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [limit] = useState(10);

  // Debounced search term to avoid too many API calls
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Handle search term debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Handle category change
  useEffect(() => {
    setCurrentPage(1); // Reset to first page on category change
  }, [selectedCategory]);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await getJobs(
          currentPage,
          limit,
          debouncedSearchTerm,
          selectedCategory
        );

        setJobs(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalJobs(response.pagination.totalJobs);

        // Extract unique categories if we don't have them yet
        if (categories.length === 0) {
          const uniqueCategories = [
            ...new Set(response.data.map((job) => job.category)),
          ];
          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, limit, debouncedSearchTerm, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-2 shadow-md`}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Results summary */}
        <div className="text-sm text-gray-500 mb-4">
          {!loading && !error && (
            <p>
              Showing {jobs.length} of {totalJobs} jobs
              {debouncedSearchTerm && ` matching "${debouncedSearchTerm}"`}
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className={`p-4 mb-6 rounded-lg ${
            isDarkMode ? "bg-red-900" : "bg-red-100"
          } text-red-700 flex items-center`}
        >
          <AlertCircle className="w-5 h-5 mr-2" />
          <p>{error}</p>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Job listings */}
          {jobs.length > 0 ? (
            <div className="grid gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <div
              className={`text-center py-12 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-100"
              } rounded-lg`}
            >
              <p className="text-xl">No jobs found matching your criteria</p>
              <p className="mt-2 text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;
