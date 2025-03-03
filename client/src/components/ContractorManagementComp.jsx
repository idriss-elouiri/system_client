// src/components/ContractorManagement.js
import React, { useState, useEffect } from "react";
import AddContractor from "./AddContractor";

const ContractorManagementComp = () => {
  const [contractors, setContractors] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Fetch contractor data when the component loads
  useEffect(() => {
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
      console.error("An error occurred while fetching contractor data:", error);
    }
  };

  const handleEditClick = (contractor) => {
    setSelectedContractor(contractor);
    setEditId(contractor.id);
    setEditName(contractor.name);
    setEditPhoneNumber(contractor.phoneNumber || "");
    setEditEmail(contractor.email);
    setEditPassword(contractor.password);
    setShowEditPopup(true);
  };

  const handleDeleteClick = (contractor) => {
    setSelectedContractor(contractor);
    setShowDeletePopup(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { id: editId, name: editName, email: editEmail, phoneNumber: editPhoneNumber, password: editPassword };
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
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
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while updating contractor data:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(
        `${apiUrl}/api/contractors/${selectedContractor._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedContractor(null);
        fetchContractors();
      }
    } catch (error) {
      console.error("An error occurred while deleting contractor data:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Contractor Management</h2>
      {/* Add Contractor Form */}
      <div className="mb-8">
        <AddContractor onAdd={fetchContractors} />
      </div>

      {/* Contractor List Display */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">ID</th>
              <th className="border p-3 text-left">Contractor Name</th>
              <th className="border p-3 text-left">Contractor Mobile</th>
              <th className="border p-3 text-left">Contractor Email</th>
              <th className="border p-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {contractors.map((contractor) => (
              <tr key={contractor._id} className="hover:bg-gray-50">
                <td className="border p-3">{contractor.id}</td>
                <td className="border p-3">{contractor.name}</td>
                <td className="border p-3">{contractor.phoneNumber || "N/A"}</td>
                <td className="border p-3">{contractor.email}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEditClick(contractor)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contractor)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContractorManagementComp;