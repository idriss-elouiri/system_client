import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
    FaPlayCircle,
    FaRProject,
  FaTachometerAlt,
} from "react-icons/fa";
import { MdPeople } from "react-icons/md"; // HRM Icon

const Sidebar = ({ showNav, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;

  // State to toggle children visibility
  const [showCustomerSubmenu, setShowCustomerSubmenu] = useState(false);
  const [showSuppliberSubmenu, setShowSuppliberSubmenu] = useState(false);

  const toggleCustomerSubmenu = () => {
    setShowCustomerSubmenu((prev) => !prev);
  };
  const toggleSupplierSubmenu = () => {
    setShowSuppliberSubmenu((prev) => !prev);
  };

  return (
    <aside
      className={`fixed lg:relative z-50 lg:z-auto ${
        showNav ? "translate-x-0" : "-translate-x-full"
      } transform transition-transform duration-300 ease-in-out bg-indigo-600 text-white min-h-screen w-64 p-4`}
    >
      {/* Close Button for Small Screens */}
      <button
        className="lg:hidden text-white text-2xl mb-4 focus:outline-none"
        onClick={onClose}
        aria-label="Close Sidebar"
      >
        &times;
      </button>
      <div className="flex items-center mb-8 gap-2">
        <h2 className="text-xl font-semibold">النظام</h2>
      </div>
      <nav className="space-y-4">
        {/* Main Menu */}
        {(isAdmin) && (
          <Link
            href="/dashboard"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaTachometerAlt className="mr-2" />
            لوحة التحكم
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/ContractorManagement"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <MdPeople className="mr-2" />
            قسم المقاولين
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/projectsPage"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaRProject className="mr-2" />
            قسم المشاريع
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/PaymentsPage"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaPlayCircle className="mr-2" />
            قسم المدفوعات
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;