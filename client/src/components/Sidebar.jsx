import Link from "next/link";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  FaTachometerAlt,
  FaUserTie,
  FaProjectDiagram,
  FaMoneyBillWave,
  FaUsers,
  FaClipboardCheck,
} from "react-icons/fa";

const Sidebar = ({ showNav, onClose }) => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  const isOwnerAd = currentUser?.isComown;
  const isContractor = currentUser?.isContractor;

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
        <h2 className="text-xl font-semibold">System</h2>
      </div>
      <nav className="space-y-4">
        {/* Main Menu */}
        {isOwnerAd && (
          <Link
            href="/dashboardOwn"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard Owner
          </Link>
        )}
        {isAdmin && (
          <Link
            href="/dashboardAdm"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaTachometerAlt className="mr-2" />
            Dashboard Admin
          </Link>
        )}
        {(isAdmin || isOwnerAd) && (
          <Link
            href="/ContractorManagement"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaUserTie className="mr-2" />
            Contractor Management
          </Link>
        )}
        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/projectsPage"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaProjectDiagram className="mr-2" />
            Projects
          </Link>
        )}
        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/PaymentsPage"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaMoneyBillWave className="mr-2" />
            Payments
          </Link>
        )}
        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/workers"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaUsers className="mr-2" />
            Workers
          </Link>
        )}
        {(isAdmin || isOwnerAd || isContractor) && (
          <Link
            href="/attendance"
            className="flex items-center block p-2 rounded hover:bg-indigo-700"
          >
            <FaClipboardCheck className="mr-2" />
            Attendance
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
