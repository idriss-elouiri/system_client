"use client";

import React, { useEffect, useState } from "react";
import AddPayment from "./AddPayment";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editAmount, setEditAmount] = useState("");
  const [editPaymentStatus, setEditPaymentStatus] = useState("");
  const [editPaymentDate, setEditPaymentDate] = useState("");
  const [editProjectId, setEditProjectId] = useState("");
  const [editContractorId, setEditContractorId] = useState("");

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchPayments();
  }, []);

  // جلب قائمة المدفوعات من الواجهة الخلفية
  const fetchPayments = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/payments`);
      const data = await res.json();
      if (res.ok) {
        setPayments(data);
      }
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  // تحديث المدفوعات
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        amount: editAmount,
        paymentStatus: editPaymentStatus,
        paymentDate: editPaymentDate,
        project_id: editProjectId,
        contractor_id: editContractorId,
      };
      const res = await fetch(`${apiUrl}/api/payments/${selectedPayment._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (res.ok) {
        setShowEditPopup(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error("An error occurred while updating payment data:", error);
    }
  };

  // حذف المدفوعات
  const handleDeleteConfirm = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/payments/${selectedPayment._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setShowDeletePopup(false);
        setSelectedPayment(null);
        fetchPayments();
      }
    } catch (error) {
      console.error("An error occurred while deleting payment data:", error);
    }
  };

  // فتح نافذة التعديل
  const handleEditClick = (payment) => {
    setSelectedPayment(payment);
    setEditAmount(payment.amount);
    setEditPaymentStatus(payment.paymentStatus);
    setEditPaymentDate(payment.paymentDate);
    setEditProjectId(payment.project_id);
    setEditContractorId(payment.contractor_id);
    setShowEditPopup(true);
  };

  // فتح نافذة تأكيد الحذف
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setShowDeletePopup(true);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">إدارة المدفوعات</h2>
      {/* نموذج إضافة مدفوعات */}
      <div className="mb-8">
        <AddPayment onAdd={fetchPayments} />
      </div>

      {/* عرض قائمة المدفوعات */}
      <div className="bg-white shadow-lg rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">المبلغ</th>
              <th className="border p-3 text-left">حالة الدفع</th>
              <th className="border p-3 text-left">تاريخ الدفع</th>
              <th className="border p-3 text-left">معرف المشروع</th>
              <th className="border p-3 text-left">معرف المقاول</th>
              <th className="border p-3 text-left">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment._id} className="hover:bg-gray-50">
                <td className="border p-3">
                  <p>{payment.amount * 100}%</p>
                </td>
                <td className="border p-3">{payment.payment_status}</td>
                <td className="border p-3">
                  {new Date(payment.payment_date).toLocaleDateString()}
                </td>
                <td className="border p-3">{payment.project_id}</td>
                <td className="border p-3">{payment.contractor_id}</td>
                <td className="border p-3">
                  <div className="space-x-2 flex">
                    <button
                      onClick={() => handleEditClick(payment)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDeleteClick(payment)}
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

      {/* نافذة تعديل المدفوعات */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96">
            <h3 className="text-2xl font-semibold mb-4 text-center">
              تعديل بيانات المدفوعات
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700">المبلغ:</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">حالة الدفع:</label>
                <select
                  value={editPaymentStatus}
                  onChange={(e) => setEditPaymentStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                >
                  <option value="Paid">مدفوع</option>
                  <option value="Pending">قيد الانتظار</option>
                  <option value="Failed">فشل</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700">تاريخ الدفع:</label>
                <input
                  type="date"
                  value={editPaymentDate}
                  onChange={(e) => setEditPaymentDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label className="block text-gray-700">معرف المشروع:</label>
                <input
                  type="text"
                  value={editProjectId}
                  onChange={(e) => setEditProjectId(e.target.value)}
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
              هل أنت متأكد من حذف المدفوعات:{" "}
              <span className="font-bold">{selectedPayment.amount}</span>؟
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

export default PaymentList;
