import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createJob } from "../store/thunks/jobThunks";
import { resetJobState } from "../store/slices/jobSlice";
import { z } from "zod";
import { X, Plus, Briefcase } from "lucide-react";

// Define the validation schema with Zod
const jobSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().min(1, "Job location is required"),
  type: z.string().min(1, "Job type is required"),
  salary: z.string().min(1, "Salary information is required"),
  description: z.string().min(1, "Job description is required"),
  category: z.string().min(1, "Job category is required"),
});

type FormData = z.infer<typeof jobSchema>;

const JobForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((state) => state.job);
  const isDarkMode = useAppSelector((state) => state.theme.isDarkMode);
  const currentUser = useAppSelector((state) => state.user);

  const [requirements, setRequirements] = useState<string[]>([""]);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    company: currentUser?.currentUser?.company || "",
    location: "",
    type: "",
    salary: "",
    description: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      const updatedRequirements = requirements.filter((_, i) => i !== index);
      setRequirements(updatedRequirements);
    }
  };

  const validateForm = (): boolean => {
    try {
      jobSchema.parse(formData);

      // Additional validation for requirements
      if (requirements.filter((req) => req.trim()).length === 0) {
        setFormErrors({
          ...formErrors,
          requirements: "At least one requirement is required",
        });
        return false;
      }

      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Filter out empty requirements
    const filteredRequirements = requirements.filter((req) => req.trim());

    try {
      await dispatch(
        createJob({
          ...formData,
          requirements: filteredRequirements,
        })
      );

      // Reset form on success
      setFormData({
        title: "",
        company: currentUser?.currentUser?.company || "",
        location: "",
        type: "",
        salary: "",
        description: "",
        category: "",
      });
      setRequirements([""]);

      // Reset job state after 3 seconds
      setTimeout(() => {
        dispatch(resetJobState());
      }, 3000);
    } catch (error) {
      console.error("Job creation failed:", error);
    }
  };

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
    "Remote",
  ];
  const jobCategories = [
    "Development",
    "Design",
    "Marketing",
    "Sales",
    "Customer Service",
    "Finance",
    "HR",
    "Other",
  ];

  return (
    <div className={`mb-8 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <h2 className="text-xl font-semibold mb-4">Post a New Job</h2>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Job posted successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div
        className={`p-6 rounded-lg shadow-md ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2">Job Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.title ? "border-red-500" : ""}`}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Company*</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.company ? "border-red-500" : ""}`}
              />
              {formErrors.company && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.company}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">Location*</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.location ? "border-red-500" : ""}`}
              />
              {formErrors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.location}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2">Job Type*</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.type ? "border-red-500" : ""}`}
              >
                <option value="">Select Job Type</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formErrors.type && (
                <p className="text-red-500 text-sm mt-1">{formErrors.type}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Salary*</label>
              <input
                type="text"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $50,000 - $70,000"
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.salary ? "border-red-500" : ""}`}
              />
              {formErrors.salary && (
                <p className="text-red-500 text-sm mt-1">{formErrors.salary}</p>
              )}
            </div>

            <div>
              <label className="block mb-2">Category*</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full p-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                } ${formErrors.category ? "border-red-500" : ""}`}
              >
                <option value="">Select Category</option>
                {jobCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {formErrors.category}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <label className="block mb-2">Job Description*</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className={`w-full p-2 border rounded-lg ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              } ${formErrors.description ? "border-red-500" : ""}`}
            />
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
          </div>

          <div className="mt-6">
            <label className="block mb-2">Requirements*</label>
            {formErrors.requirements && (
              <p className="text-red-500 text-sm mb-2">
                {formErrors.requirements}
              </p>
            )}
            {requirements.map((req, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={req}
                  onChange={(e) =>
                    handleRequirementChange(index, e.target.value)
                  }
                  className={`flex-grow p-2 border rounded-lg ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600"
                      : "bg-white border-gray-300"
                  }`}
                  placeholder="e.g. 3+ years of experience"
                />
                <button
                  type="button"
                  onClick={() => removeRequirement(index)}
                  className="ml-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={requirements.length <= 1}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addRequirement}
              className="mt-2 flex items-center text-blue-500 hover:text-blue-600"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Requirement
            </button>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Briefcase className="w-4 h-4 mr-2" />
              )}
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
