"use client";

import React, { useEffect, useState } from "react";
import AddProject from "./AddProject";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editProjectNumber, setEditProjectNumber] = useState("");
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editStatus, setEditStatus] = useState("Active");
  const [editLocation, setEditLocation] = useState("");
  const [editAssignedLocation, setEditAssignedLocation] = useState("");
  const [editCompanyId, setEditCompanyId] = useState("");
  const [editContractorId, setEditContractorId] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch project list from the backend
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Update project
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        name: editName,
        project_number: editProjectNumber,
        start_date: editStartDate,
        end_date: editEndDate,
        status: editStatus,
        location: editLocation,
        assigned_location: editAssignedLocation,
        company_id: editCompanyId,
        contractor_id: editContractorId,
      };
      const res = await fetch(
        `${apiUrl}/api/projects/${selectedProject._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error("An error occurred while updating project data:", error);
    }
  };

  // Delete project
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/projects/${selectedProject._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedProject(null);
        fetchProjects();
      }
    } catch (error) {
      console.error("An error occurred while deleting project data:", error);
    }
  };

  // Open edit popup
  const handleEditClick = (project) => {
    setSelectedProject(project);
    setEditName(project.name);
    setEditProjectNumber(project.project_number);
    setEditStartDate(project.start_date);
    setEditEndDate(project.end_date);
    setEditStatus(project.status);
    setEditLocation(project.location);
    setEditAssignedLocation(project.assigned_location);
    setEditCompanyId(project.company_id);
    setEditContractorId(project.contractor_id);
    setShowEditPopup(true);
  };

  // Open delete confirmation popup
  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeletePopup(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Project Management</h2>
      {/* Add Project Form */}
      <div className="mb-8">
        <AddProject onAdd={fetchProjects} />
      </div>

      {/* Display Project List */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Project Name</th>
              <th className="border p-3 text-left">Project Number</th>
              <th className="border p-3 text-left">Start Date</th>
              <th className="border p-3 text-left">End Date</th>
              <th className="border p-3 text-left">Status</th>
              <th className="border p-3 text-left">Location</th>
              <th className="border p-3 text-left">Assigned Location</th>
              <th className="border p-3 text-left">Company ID</th>
              <th className="border p-3 text-left">Contractor ID</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50">
                <td className="border p-3">{project.name}</td>
                <td className="border p-3">{project.project_number}</td>
                <td className="border p-3">{new Date(project.start_date).toLocaleDateString()}</td>
                <td className="border p-3">{new Date(project.end_date).toLocaleDateString()}</td>
                <td className="border p-3">{project.status}</td>
                <td className="border p-3">{project.location}</td>
                <td className="border p-3">{project.assigned_location}</td>
                <td className="border p-3">{project.company_id}</td>
                <td className="border p-3">{project.contractor_id}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEditClick(project)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;