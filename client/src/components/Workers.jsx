"use client";

import React, { useState, useEffect } from "react";

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [contractors, setContractors] = useState([]); // قائمة المقاولين
  const [projects, setProjects] = useState([]); // قائمة المشاريع
  const [formData, setFormData] = useState({
    name: "",
    contractor_id: "",
    project_id: "",
    contact_info: { email: "", phone: "" },
    job_title: "",
    nationality: "سعودي",
  });
  const [editMode, setEditMode] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // جلب جميع العمال
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

  // جلب قائمة المقاولين
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

  // جلب قائمة المشاريع
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

  useEffect(() => {
    fetchWorkers();
    fetchContractors();
    fetchProjects();
  }, []);

  // إضافة أو تحديث عامل
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await fetch(`${apiUrl}/api/workers/${selectedWorker._id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(`${apiUrl}/api/workers`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      fetchWorkers();
      setFormData({
        name: "",
        contractor_id: "",
        project_id: "",
        contact_info: { email: "", phone: "" },
        job_title: "",
        nationality: "سعودي",
      });
      setEditMode(false);
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  // حذف عامل
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

  // تعبئة النموذج للتعديل
  const handleEdit = (worker) => {
    setFormData(worker);
    setEditMode(true);
    setSelectedWorker(worker);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">إدارة العمال</h1>

      {/* نموذج إضافة/تعديل عامل */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editMode ? "تعديل عامل" : "إضافة عامل جديد"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="اسم العامل"
            className="p-2 border rounded"
            required
          />
          {/* قائمة المقاولين */}
          <select
            value={formData.contractor_id}
            onChange={(e) =>
              setFormData({ ...formData, contractor_id: e.target.value })
            }
            className="p-2 border rounded"
            required
          >
            <option value="">اختر المقاول</option>
            {contractors.map((contractor) => (
              <option key={contractor._id} value={contractor._id}>
                {contractor.name}
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
            placeholder="البريد الإلكتروني (اختياري)"
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
            placeholder="رقم الهاتف"
            className="p-2 border rounded"
            required
          />
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
        </div>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {editMode ? "تحديث" : "إضافة"}
        </button>
      </form>

      {/* عرض قائمة العمال */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">قائمة العمال</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 text-left">الاسم</th>
                <th className="p-3 text-left">المسمى الوظيفي</th>
                <th className="p-3 text-left">الجنسية</th>
                <th className="p-3 text-left">الهاتف</th>
                <th className="p-3 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{worker.name}</td>
                  <td className="p-3">{worker.job_title}</td>
                  <td className="p-3">{worker.nationality}</td>
                  <td className="p-3">{worker.contact_info.phone}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(worker)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(worker._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Workers;