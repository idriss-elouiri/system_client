import React, { useEffect, useState } from "react";

const AddProject = ({ onAdd }) => {
  const [contractors, setContractors] = useState([]); // List of contractors
  const [companies, setCompanies] = useState([]); // List of companies
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [assignedLocation, setAssignedLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("Active"); // Project status
  const [projectNumber, setProjectNumber] = useState(""); // Project number
  const [companyId, setCompanyId] = useState(""); // Selected company ID
  const [contractorId, setContractorId] = useState(""); // Selected contractor ID

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchContractors();
    fetchCompanies();
  }, []);

  // Fetch the list of contractors from the backend
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

  // Fetch the list of companies from the backend
  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/authComown`);
      const data = await res.json();
      if (res.ok) {
        setCompanies(data);
      }
    } catch (error) {
      console.error("An error occurred while fetching company data:", error);
    }
  };

  // Submit data to the backend
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
        onAdd(); // Call function to update the project list
      }
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl mb-4">Add New Project</h3>
      <input
        type="text"
        value={projectNumber}
        onChange={(e) => setProjectNumber(e.target.value)}
        placeholder="Project Number"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Project Name"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      />
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
      />
      <input
        type="text"
        value={assignedLocation}
        onChange={(e) => setAssignedLocation(e.target.value)}
        placeholder="Assigned Location"
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
        <option value="Active">Active</option>
        <option value="Expired">Expired</option>
        <option value="Completed">Completed</option>
      </select>

      {/* Company List */}
      <select
        value={companyId}
        onChange={(e) => setCompanyId(e.target.value)}
        className="block w-full p-2 mb-4 border border-gray-300 rounded"
        required
      >
        <option value="">Select Company</option>
        {companies.map((company) => (
          <option key={company._id} value={company._id}>
            {company.name}
          </option>
        ))}
      </select>

      {/* Contractor List */}
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

      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
};

export default AddProject;
