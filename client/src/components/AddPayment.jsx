import React, { useEffect, useState } from "react";

const AddPayment = ({ onAdd }) => {
  const [amount, setAmount] = useState("");
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [paymentDate, setPaymentDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [contractorId, setContractorId] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchProjects();
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/contractors`);
      const data = await res.json();
      if (res.ok) {
        setContractors(data);
      }
    } catch (error) {
      console.error("حدث خطأ أثناء جلب بيانات المقاولين:", error);
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
      console.error("حدث خطأ أثناء جلب بيانات المشاريع:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !paymentDate || !projectId || !contractorId) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    try {
      const statusInEnglish = paymentStatus === "مدفوع" ? "Paid" : "Unpaid";

      const res = await fetch(`${apiUrl}/api/payments/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) / 100, // تحويل إلى نسبة مئوية حقيقية
          payment_status: statusInEnglish,
          payment_date: paymentDate,
          project_id: projectId,
          contractor_id: contractorId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        onAdd();
        setAmount("");
        setPaymentStatus("Unpaid");
        setPaymentDate("");
        setProjectId("");
        setContractorId("");
      } else {
        alert(data.message || "حدث خطأ أثناء إضافة الدفعة");
      }
    } catch (error) {
      console.error("خطأ أثناء إضافة الدفعة:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">إضافة دفعة جديدة</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="المبلغ بالنسبة المئوية (%)"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        min="0"
        max="100"
        required
      />

      <select
        value={paymentStatus}
        onChange={(e) => setPaymentStatus(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      >
        <option value="مدفوع">مدفوع</option>
        <option value="غير مدفوع">غير مدفوع</option>
      </select>

      <input
        type="date"
        value={paymentDate}
        onChange={(e) => setPaymentDate(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />

      <select
        value={projectId}
        onChange={(e) => setProjectId(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      >
        <option value="">اختر المشروع</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>

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

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        إضافة
      </button>
    </form>
  );
};

export default AddPayment;
