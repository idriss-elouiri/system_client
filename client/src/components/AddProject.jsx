import React, { useEffect, useState } from "react";

const AddProject = ({ onAdd }) => {
  const [contractors, setContractors] = useState([]); // قائمة المقاولين
  const [comowns, setComowns] = useState([]); // قائمة الشركات
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [assignedLocation, setAssignedLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active"); // حالة المشروع
  const [projectNumber, setProjectNumber] = useState(""); // رقم المشروع
  const [companyId, setCompanyId] = useState(""); // معرف الشركة المحدد
  const [contractorId, setContractorId] = useState(""); // معرف المقاول المحدد

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContractors();
    fetchComowns();
  }, []);

  // جلب قائمة المقاولين من الواجهة الخلفية
  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching contractor data:", error);
    }
  };

  // جلب قائمة الشركات من الواجهة الخلفية
  const fetchComowns = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) {
        setComowns(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching comown data:", error);
    }
  };

  // إرسال البيانات إلى الواجهة الخلفية
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${apiUrl}/api/projects/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_number: projectNumber,
          name,
          location,
          assigned_location: assignedLocation,
          start_date: startDate,
          end_date: endDate,
          status,
          company_id: companyId,
          contractor_id: contractorId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onAdd(); // استدعاء الدالة لتحديث قائمة المشاريع
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">إضافة مشروع جديد</h3>
      <input
        type="text"
        value={projectNumber}
        onChange={(e) => setProjectNumber(e.target.value)}
        placeholder="رقم المشروع"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اسم المشروع"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="الموقع"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={assignedLocation}
        onChange={(e) => setAssignedLocation(e.target.value)}
        placeholder="الموقع المعين"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="Active">نشط</option>
        <option value="Expired">منتهي</option>
        <option value="Completed">مكتمل</option>
      </select>

      {/* قائمة الشركات */}
      <select
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      >
        <option value="">اختر الشركة</option>
        {comowns.map((comown) => (
          <option key={comown._id} value={comown.companyId}>
            {comown.name}
          </option>
        ))}
      </select>

      {/* قائمة المقاولين */}
      <select
        value={contractorId}
        onChange={(e) => setContractorId(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      >
        <option value="">اختر المقاول</option>
        {contractors.map((contractor) => (
          <option key={contractor._id} value={contractor._id}>
            {contractor.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        إضافة
      </button>
    </form>
  );
};

export default AddProject;