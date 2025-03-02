"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaEdit, FaTrash } from "react-icons/fa";

Chart.register(...registerables);

const CompanyDashboard = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [contractors, setContractors] = useState([]);
  const [projects, setProjects] = useState([]);
  const [attendanceReports, setAttendanceReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contractorsRes, projectsRes, reportsRes] = await Promise.all([
          fetch(`${apiUrl}/api/contractors`).then((res) => res.json()),
          fetch(`${apiUrl}/api/projects`).then((res) => res.json()),
          fetch(`${apiUrl}/api/attendance`).then((res) => res.json()),
        ]);

        setContractors(contractorsRes);
        setProjects(projectsRes);
        setAttendanceReports(reportsRes);
      } catch (err) {
        setError("حدث خطأ أثناء جلب البيانات");
        toast.error("حدث خطأ أثناء جلب البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const chartData = {
    labels: attendanceReports?.map((report) => report.project_name),
    datasets: [
      {
        label: "الحضور",
        data: attendanceReports?.map((report) => report.attendance_count),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "الغياب",
        data: attendanceReports?.map((report) => report.absence_count),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">لوحة تحكم صاحب الشركة</h1>

      {/* إدارة المقاولين */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">إدارة المقاولين</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">الاسم</th>
                <th className="p-3 text-left">البريد الإلكتروني</th>
                <th className="p-3 text-left">الهاتف</th>
                <th className="p-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {contractors?.map((contractor) => (
                <tr key={contractor._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{contractor.name}</td>
                  <td className="p-3">{contractor.email}</td>
                  <td className="p-3">{contractor.phoneNumber}</td>
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

      {/* إدارة المشاريع */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">إدارة المشاريع</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">اسم المشروع</th>
                <th className="p-3 text-left">الموقع</th>
                <th className="p-3 text-left">الحالة</th>
                <th className="p-3 text-left">الإجراءات</th>
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

      {/* تقارير الحضور */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">تقارير الحضور</h2>
        <div className="w-full h-96">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;