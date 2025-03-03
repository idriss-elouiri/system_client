"use client";

import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";

Chart.register(...registerables);

const ContractorDashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async (endpoint) => {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    } catch (error) {
      throw new Error("An error occurred while fetching data");
    }
  };

  const { data: workers, isLoading: workersLoading, isError: workersError } = useQuery({
    queryKey: ["workers"],
    queryFn: () => fetchData("/api/workers"),
  });

  const { data: projects, isLoading: projectsLoading, isError: projectsError } = useQuery({
    queryKey: ["projects"],
    queryFn: () => fetchData("/api/projects"),
  });

  const { data: dailyReports, isLoading: dailyReportsLoading, isError: dailyReportsError } = useQuery({
    queryKey: ["dailyReports"],
    queryFn: () => fetchData("/api/attendance"),
  });

  if (workersLoading || projectsLoading || dailyReportsLoading) {
    return <div>Loading...</div>;
  }

  if (workersError || projectsError || dailyReportsError) {
    toast.error("An error occurred while fetching data");
  }

  const chartData = {
    labels: dailyReports?.map((report) => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: "Daily Attendance",
        data: dailyReports?.map((report) => report.attendance_count),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">Contractor Dashboard</h1>

      {/* Worker Management */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Worker Management</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Job Title</th>
                <th className="p-3 text-left">Nationality</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers?.map((worker) => (
                <tr key={worker._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{worker.name}</td>
                  <td className="p-3">{worker.job_title}</td>
                  <td className="p-3">{worker.nationality}</td>
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

      {/* Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <div className="w-full h-96">
          <Line data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default ContractorDashboard;
