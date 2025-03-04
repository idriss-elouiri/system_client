"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";

Chart.register(...registerables);

const AdminDashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [comowns, setComowns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [comownsRes, projectsRes] = await Promise.all([
          fetch(`${apiUrl}/api/authComown`).then((res) => res.json()),
          fetch(`${apiUrl}/api/projects`).then((res) => res.json()),
        ]);

        setComowns(comownsRes);
        setProjects(projectsRes);
      } catch (err) {
        setError("An error occurred while fetching data");
        toast.error("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const chartData = {
    labels: projects?.map((project) => project.name),
    datasets: [
      {
        label: "Projects",
        data: projects?.map((project) => project.status === "Active" ? 1 : 0),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      {/* Comown Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Comown Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Company ID</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {comowns?.map((comown) => (
                <tr key={comown._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{comown.name}</td>
                  <td className="p-3">{comown.email}</td>
                  <td className="p-3">{comown.companyId}</td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Project Name</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects?.map((project) => (
                <tr key={project._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{project.name}</td>
                  <td className="p-3">{project.location}</td>
                  <td className="p-3">{project.status}</td>
                  <td className="p-3">
                    <button className="text-blue-500 hover:text-blue-700 mr-2">
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Status Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Project Status</h2>
        <div className="w-full h-96">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;