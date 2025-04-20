import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppSelector } from "../store/hooks";
import JobForm from "../components/JobForm";
import { api } from "../utils/api";
import { Job } from "../types";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function EmployerDashboard() {
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentUser = useAppSelector((state) => state.auth.user);
  const [showJobForm, setShowJobForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setcategoryData] = useState([]);

  useEffect(() => {
    const fetchEmployerData = async () => {
      try {
        setLoading(true);
        // Fetch employer's jobs
        const jobsResponse = await api.get("/jobs", {
          params: { employerId: currentUser?._id },
        });
        setJobs(jobsResponse.data.data);

        // Fetch applications for employer's jobs
        const applicationsResponse = await api.get("/applications");
        setApplications(applicationsResponse.data.data);

        // Process data for charts
        processChartData(
          jobsResponse.data.data,
          applicationsResponse.data.data
        );
      } catch (err) {
        console.error("Failed to fetch employer data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchEmployerData();
    }
  }, [currentUser?._id]);

  const processChartData = (jobs: Job[], applications: any[]) => {
    // Process monthly job posting data
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyJobsMap = new Map();

    monthNames.forEach((month) => monthlyJobsMap.set(month, 0));

    jobs.forEach((job) => {
      const postedDate = new Date(job.postedDate);
      const month = monthNames[postedDate.getMonth()];
      monthlyJobsMap.set(month, monthlyJobsMap.get(month) + 1);
    });

    const monthlyJobsData = Array.from(monthlyJobsMap).map(([month, jobs]) => ({
      month,
      jobs,
    }));

    setMonthlyData(monthlyJobsData);

    // Process category data
    const categoriesMap = new Map();
    jobs.forEach((job) => {
      const category = job.category || "Uncategorized";
      categoriesMap.set(category, (categoriesMap.get(category) || 0) + 1);
    });

    const categoryChartData = Array.from(categoriesMap).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    setcategoryData(categoryChartData);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
          <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
        </div>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {showJobForm ? "Cancel" : "Post New Job"}
        </button>
      </div>

      {showJobForm && <JobForm />}

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">
            {applications.length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {applications.filter((app) => app.status === "pending").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Hired</h3>
          <p className="text-3xl font-bold text-purple-600">
            {applications.filter((app) => app.status === "accepted").length}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Monthly Job Postings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Jobs by Category</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => {
                const job = jobs.find((j) => j._id === app.jobId);
                return (
                  <tr
                    key={app._id}
                    className={`${
                      isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">{job?.title || "Unknown Job"}</td>
                    <td className="px-6 py-4">
                      {app.userId?.name || "Unknown Applicant"}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          app.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {app.status.charAt(0).toUpperCase() +
                          app.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EmployerDashboard;
