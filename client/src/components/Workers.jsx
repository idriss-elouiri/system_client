"use client";

import React, { useState, useEffect } from "react";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contractor_id: "",
    project_id: "",
    contact_info: { email: "", phone: "" },
    job_title: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchWorkers();
    fetchContractors();
    fetchProjects();
  }, []);

  const fetchWorkers = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/workers`);
      const data = await res.json();
      if (res.ok) {
        setWorkers(data);
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("Error fetching contractors:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      if (res.ok) {
        setProjects(data);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editMode ? "PUT" : "POST";
      const url = editMode
        ? `${apiUrl}/api/workers/${selectedWorker._id}`
        : `${apiUrl}/api/workers`;

      await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      fetchWorkers();
      setFormData({
        name: "",
        contractor_id: "",
        project_id: "",
        contact_info: { email: "", phone: "" },
        job_title: "",
        nationality: "Saudi",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiUrl}/api/workers/${id}`, {
        method: "DELETE",
      });
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const handleEdit = (worker) => {
    setFormData(worker);
    setEditMode(true);
    setSelectedWorker(worker);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Worker Management</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "Edit Worker" : "Add New Worker"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Worker Name"
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.contractor_id}
            onChange={(e) =>
              setFormData({ ...formData, contractor_id: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">Select Contractor</option>
            {contractors.map((contractor) => (
              <option key={contractor._id} value={contractor._id}>
                {contractor.name}
              </option>
            ))}
          </select>
          <select
            value={formData.project_id}
            onChange={(e) =>
              setFormData({ ...formData, project_id: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <input
            type="email"
            value={formData.contact_info.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact_info: {
                  ...formData.contact_info,
                  email: e.target.value,
                },
              })
            }
            placeholder="Email (Optional)"
            className="p-2 border rounded"
          />
          <input
            type="text"
            value={formData.contact_info.phone}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact_info: {
                  ...formData.contact_info,
                  phone: e.target.value,
                },
              })
            }
            placeholder="Phone Number"
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            placeholder="Job Title"
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? "Update" : "Add"}
        </button>
      </form>
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Name</th>
              <th className="border p-3 text-left">Contractor</th>
              <th className="border p-3 text-left">Project</th>
              <th className="border p-3 text-left">Email</th>
              <th className="border p-3 text-left">Phone</th>
              <th className="border p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker._id} className="hover:bg-gray-50">
                <td className="border p-3">{worker._id}</td>
                <td className="border p-3">{worker.name}</td>
                <td className="border p-3">
                  {worker.contractor_id ? worker.contractor_id.name : "N/A"}
                </td>

                <td className="border p-3">
                  {worker.project_id ? worker.project_id.name : "N/A"}
                </td>

                <td className="border p-3">
                  {worker.contact_info?.email || "N/A"}
                </td>
                <td className="border p-3">
                  {worker.contact_info?.phone || "N/A"}
                </td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(worker._id)}
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

export default Workers;
