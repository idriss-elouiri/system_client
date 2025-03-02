"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [workers, setWorkers] = useState([]); // قائمة العمال
  const [projects, setProjects] = useState([]); // قائمة المشاريع
  const [formData, setFormData] = useState({
    worker_id: "",
    project_id: "",
    date: "",
    status: "حاضر",
    worker_name: "",
    nationality: "سعودي",
    job_title: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // دالة لجلب البيانات
  const fetchData = async (endpoint) => {
    try {
      const res = await fetch(`${apiUrl}${endpoint}`);
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    } catch (error) {
      setError(error.message);
      toast.error("حدث خطأ أثناء جلب البيانات");
    }
  };

  // جلب جميع سجلات الحضور
  const fetchAttendance = async () => {
    setLoading(true);
    const data = await fetchData("/api/attendance");
    if (data) setAttendance(data);
    setLoading(false);
  };

  // جلب قائمة العمال
  const fetchWorkers = async () => {
    const data = await fetchData("/api/workers");
    if (data) setWorkers(data);
  };

  // جلب قائمة المشاريع
  const fetchProjects = async () => {
    const data = await fetchData("/api/projects");
    if (data) setProjects(data);
  };

  useEffect(() => {
    fetchAttendance();
    fetchWorkers();
    fetchProjects();
  }, []);

  // تسجيل حضور جديد
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/attendance`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("تم تسجيل الحضور بنجاح");
        fetchAttendance();
        setFormData({
          worker_id: "",
          project_id: "",
          date: "",
          status: "حاضر",
          worker_name: "",
          nationality: "سعودي",
          job_title: "",
        });
      } else {
        throw new Error(data.message || "حدث خطأ أثناء تسجيل الحضور");
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // تحديث اسم العامل عند اختياره
  const handleWorkerChange = (workerId) => {
    const selectedWorker = workers.find((worker) => worker._id === workerId);
    if (selectedWorker) {
      setFormData({
        ...formData,
        worker_id: workerId,
        worker_name: selectedWorker.name,
        nationality: selectedWorker.nationality,
        job_title: selectedWorker.job_title,
      });
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة الحضور</h1>

      {/* نموذج تسجيل حضور */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">تسجيل حضور جديد</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* قائمة العمال */}
          <select
            value={formData.worker_id}
            onChange={(e) => handleWorkerChange(e.target.value)}
            className="p-2 border rounded"
            required
          >
            <option value="">اختر العامل</option>
            {workers.map((worker) => (
              <option key={worker._id} value={worker._id}>
                {worker.name}
              </option>
            ))}
          </select>
          {/* قائمة المشاريع */}
          <select
            value={formData.project_id}
            onChange={(e) =>
              setFormData({ ...formData, project_id: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">اختر المشروع</option>
            {projects.map((project) => (
              <option key={project._id} value={project._id}>
                {project.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({ ...formData, status: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="حاضر">حاضر</option>
            <option value="غائب">غائب</option>
          </select>
          <input
            type="text"
            value={formData.worker_name}
            onChange={(e) =>
              setFormData({ ...formData, worker_name: e.target.value })
            }
            placeholder="اسم العامل"
            className="p-2 border rounded"
            required
          />
          <select
            value={formData.nationality}
            onChange={(e) =>
              setFormData({ ...formData, nationality: e.target.value })
            }
            className="p-2 border rounded"
          >
            <option value="سعودي">سعودي</option>
            <option value="غير سعودي">غير سعودي</option>
          </select>
          <input
            type="text"
            value={formData.job_title}
            onChange={(e) =>
              setFormData({ ...formData, job_title: e.target.value })
            }
            placeholder="المسمى الوظيفي"
            className="p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          تسجيل
        </button>
      </form>

      {/* عرض سجلات الحضور */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">سجلات الحضور</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">اسم العامل</th>
                <th className="p-3 text-left">التاريخ</th>
                <th className="p-3 text-left">الحالة</th>
                <th className="p-3 text-left">الجنسية</th>
                <th className="p-3 text-left">المسمى الوظيفي</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{record.worker_name}</td>
                  <td className="p-3">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="p-3">{record.status}</td>
                  <td className="p-3">{record.nationality}</td>
                  <td className="p-3">{record.job_title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
