"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setErrorMessage("يرجى ملء جميع الحقول.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`${apiUrl}/api/authAdmin/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "فشل التسجيل.");
      } else {
        router.push("/");
      }
    } catch (error) {
      setErrorMessage("حدث خطأ. يرجى المحاولة مرة أخرى لاحقا.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center py-10"
    >
      <div className="flex w-full max-w-6xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 px-6 py-8">
          <h2 className="text-3xl font-semibold text-center mb-6">
            تسجيل الدخول
          </h2>

          {errorMessage && (
            <div className="mb-4 text-red-500 text-center">{errorMessage}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2" htmlFor="email">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-lg font-medium mb-2"
                htmlFor="password"
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg mt-4 transition"
              disabled={loading}
            >
              {loading ? "جارٍ التسجيل..." : "تسجيل"}
            </button>
          </form>

          {/* Login Redirect */}
          <div className="mt-4 text-center">
            <Link href={"/register"}>ليس لدي حساب؟</Link>{" "}
            <button
              onClick={() => router.push("/login")}
              className="text-blue-500 hover:underline"
            >
              تسجيل الدخول
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div
          className="hidden lg:block w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/contact_img.png")' }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
