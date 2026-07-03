import { useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 outline-none focus:border-[#00FF95] transition";

function Contact() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: "",
    subject: "پیگیری سفارش",
    message: "",
  });

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      toast.error("فیلدهای ضروری را کامل کنید");
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }

    const messages =
      JSON.parse(localStorage.getItem("contactMessages")) || [];

    const newMessage = {
      id: Date.now(),
      userId: user?.id || null,
      ...formData,
      status: "جدید",
      createdAt: new Date().toLocaleString("fa-IR"),
    };

    localStorage.setItem(
      "contactMessages",
      JSON.stringify([newMessage, ...messages])
    );

    toast.success("پیام شما ثبت شد");

    setFormData({
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: "",
      subject: "پیگیری سفارش",
      message: "",
    });
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mb-10">
          <span className="text-[#00FF95] font-bold">
            ارتباط با ما
          </span>

          <h1 className="text-4xl font-black mt-3">
            تماس با VapeHub
          </h1>

          <p className="text-gray-400 leading-8 mt-4">
            برای پیگیری سفارش، مشاوره خرید یا گزارش مشکل
            فرم زیر را تکمیل کنید.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-6 sm:p-8"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-gray-300">
                  نام و نام خانوادگی
                </label>

                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  شماره موبایل
                </label>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength="11"
                  dir="ltr"
                  className={inputClass}
                  placeholder="09123456789"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  ایمیل
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  dir="ltr"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  موضوع
                </label>

                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option>پیگیری سفارش</option>
                  <option>مشاوره خرید</option>
                  <option>گزارش مشکل</option>
                  <option>سایر موارد</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-gray-300">
                  متن پیام
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-[#00FF95] text-black py-4 rounded-xl font-black hover:opacity-90"
            >
              ارسال پیام
            </button>
          </form>

          <aside className="space-y-4">
            {[
              ["پیگیری سفارش", "بررسی وضعیت سفارش ثبت‌شده"],
              ["مشاوره خرید", "راهنمای انتخاب دستگاه مناسب"],
              ["گزارش مشکل", "بررسی مشکلات حساب یا پرداخت"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="border border-[#2D2D2D] rounded-2xl p-5"
              >
                <h2 className="font-black text-[#00FF95]">
                  {title}
                </h2>

                <p className="text-gray-400 mt-2">
                  {text}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Contact;