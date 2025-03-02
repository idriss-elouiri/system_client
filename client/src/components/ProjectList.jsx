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

  // جلب قائمة المشاريع من الواجهة الخلفية
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // تحديث المشروع
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

  // حذف المشروع
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

  // فتح نافذة التعديل
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

  // فتح نافذة تأكيد الحذف
  const handleDeleteClick = (project) => {
    setSelectedProject(project);
    setShowDeletePopup(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">إدارة المشاريع</h2>
      {/* نموذج إضافة مشروع */}
      <div className="mb-8">
        <AddProject onAdd={fetchProjects} />
      </div>

      {/* عرض قائمة المشاريع */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">اسم المشروع</th>
              <th className="border p-3 text-left">رقم المشروع</th>
              <th className="border p-3 text-left">تاريخ البدء</th>
              <th className="border p-3 text-left">تاريخ الانتهاء</th>
              <th className="border p-3 text-left">الحالة</th>
              <th className="border p-3 text-left">الموقع</th>
              <th className="border p-3 text-left">الموقع المعين</th>
              <th className="border p-3 text-left">معرف الشركة</th>
              <th className="border p-3 text-left">معرف المقاول</th>
              <th className="border p-3 text-left">الإجراءات</th>
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
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      حذف
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* نافذة تعديل المشروع */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              تعديل بيانات المشروع
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">اسم المشروع:</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">رقم المشروع:</label>
                <input
                  type="text"
                  value={editProjectNumber}
                  onChange={(e) => setEditProjectNumber(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">تاريخ البدء:</label>
                <input
                  type="date"
                  value={editStartDate}
                  onChange={(e) => setEditStartDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">تاريخ الانتهاء:</label>
                <input
                  type="date"
                  value={editEndDate}
                  onChange={(e) => setEditEndDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">الحالة:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Active">نشط</option>
                  <option value="Expired">منتهي</option>
                  <option value="Completed">مكتمل</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">الموقع:</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">الموقع المعين:</label>
                <input
                  type="text"
                  value={editAssignedLocation}
                  onChange={(e) => setEditAssignedLocation(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">معرف الشركة:</label>
                <input
                  type="text"
                  value={editCompanyId}
                  onChange={(e) => setEditCompanyId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">معرف المقاول:</label>
                <input
                  type="text"
                  value={editContractorId}
                  onChange={(e) => setEditContractorId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditPopup(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  حفظ التغييرات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* نافذة تأكيد الحذف */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              تأكيد الحذف
            </h3>
            <p className="mb-6 text-center">
              هل أنت متأكد من حذف المشروع:{" "}
              <span className="font-bold">{selectedProject.name}</span>؟
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                إلغاء
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                نعم، حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;