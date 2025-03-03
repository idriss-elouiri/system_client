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
      console.error("An error occurred while fetching contractors' data:", error);
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
      console.error("An error occurred while fetching projects' data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !paymentDate || !projectId || !contractorId) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const statusInEnglish = paymentStatus === "Paid" ? "Paid" : "Unpaid";

      const res = await fetch(`${apiUrl}/api/payments/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount) / 100, // Convert to actual percentage
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
        alert(data.message || "An error occurred while adding the payment");
      }
    } catch (error) {
      console.error("Error while adding the payment:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">Add New Payment</h3>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount in percentage (%)"
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
        <option value="Paid">Paid</option>
        <option value="Unpaid">Unpaid</option>
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
        <option value="">Select Project</option>
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
        <option value="">Select Contractor</option>
        {contractors.map((contractor) => (
          <option key={contractor._id} value={contractor._id}>
            {contractor.name}
          </option>
        ))}
      </select>

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AddPayment;
