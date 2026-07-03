import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

const inputClass =
  "w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 outline-none focus:border-[#00FF95] transition";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user.fullName,
    phone: "",
    province: "",
    city: "",
    postalCode: "",
    address: "",
    shippingMethod: "post",
    paymentMethod: "online",
    note: "",
  });

  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(
      String(item.price).replaceAll(",", "")
    );

    return total + price * (item.quantity || 1);
  }, 0);

  const shippingCost =
    formData.shippingMethod === "express"
      ? 220000
      : 120000;

  const finalPrice = subtotal + shippingCost;

  const handleChange = (e) => {
    setFormData((current) => ({
      ...current,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      formData.fullName,
      formData.phone,
      formData.province,
      formData.city,
      formData.postalCode,
      formData.address,
    ];

    if (requiredFields.some((value) => !value.trim())) {
      toast.error("اطلاعات ارسال را کامل کنید");
      return;
    }

    if (!/^09\d{9}$/.test(formData.phone)) {
      toast.error("شماره موبایل معتبر نیست");
      return;
    }

    if (!/^\d{10}$/.test(formData.postalCode)) {
      toast.error("کد پستی باید ۱۰ رقم باشد");
      return;
    }

    const newOrder = {
      id: Date.now(),
      userId: user.id,

      customer: {
        ...formData,
        email: user.email,
      },

      products: cartItems,
      subtotal,
      shippingCost,
      totalPrice: finalPrice,
      status: "در انتظار بررسی",
      createdAt: new Date().toLocaleString("fa-IR"),
    };

    const savedOrders =
      JSON.parse(localStorage.getItem("orders")) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([newOrder, ...savedOrders])
    );

    clearCart();
    toast.success("سفارش شما با موفقیت ثبت شد");

    navigate(`/order-success/${newOrder.id}`);
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-xl mx-auto bg-[#181818] border border-[#2D2D2D] rounded-2xl p-10">
            <h1 className="text-3xl font-black">
              سبد خرید شما خالی است
            </h1>

            <Link
              to="/products"
              className="inline-block mt-6 bg-[#00FF95] text-black px-7 py-3 rounded-xl font-bold"
            >
              مشاهده محصولات
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-black mb-8">
          تسویه حساب
        </h1>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5 sm:p-8"
          >
            <h2 className="text-2xl font-black mb-6">
              اطلاعات گیرنده
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="block mb-2 text-gray-300">
                  نام و نام خانوادگی
                </label>

                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  autoComplete="name"
                  className={inputClass}
                  placeholder="مثلاً علی رضایی"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  شماره موبایل
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength="11"
                  className={inputClass}
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  کد پستی
                </label>

                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  inputMode="numeric"
                  maxLength="10"
                  className={inputClass}
                  placeholder="کد پستی ۱۰ رقمی"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  استان
                </label>

                <input
                  type="text"
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="مثلاً تهران"
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  شهر
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="مثلاً تهران"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-gray-300">
                  آدرس کامل
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="4"
                  className={`${inputClass} resize-none`}
                  placeholder="خیابان، کوچه، پلاک و واحد"
                />
              </div>
            </div>

            <h2 className="text-2xl font-black mt-10 mb-6">
              ارسال و پرداخت
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 text-gray-300">
                  روش ارسال
                </label>

                <select
                  name="shippingMethod"
                  value={formData.shippingMethod}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="post">
                    پست پیشتاز، ۱۲۰٬۰۰۰ تومان
                  </option>

                  <option value="express">
                    ارسال سریع، ۲۲۰٬۰۰۰ تومان
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 text-gray-300">
                  روش پرداخت
                </label>

                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="online">
                    پرداخت آنلاین
                  </option>

                  <option value="card">
                    کارت به کارت
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block mb-2 text-gray-300">
                  توضیحات سفارش
                </label>

                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows="3"
                  className={`${inputClass} resize-none`}
                  placeholder="توضیحات اختیاری"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#00FF95] text-black py-4 rounded-xl font-black hover:opacity-90 transition mt-8"
            >
              ثبت نهایی سفارش
            </button>
          </form>

          <aside className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-6 lg:sticky lg:top-28">
            <h2 className="text-2xl font-black mb-6">
              خلاصه سفارش
            </h2>

            <div className="space-y-4">
              {cartItems.map((item) => {
                const itemPrice =
                  Number(
                    String(item.price).replaceAll(",", "")
                  ) * (item.quantity || 1);

                return (
                  <div
                    key={item.id}
                    className="flex justify-between gap-4 pb-4 border-b border-[#2D2D2D]"
                  >
                    <div>
                      <p className="font-bold leading-7">
                        {item.name}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        تعداد: {item.quantity || 1}
                      </p>
                    </div>

                    <span className="whitespace-nowrap">
                      {itemPrice.toLocaleString()} تومان
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex justify-between text-gray-300">
                <span>مجموع کالاها</span>
                <span>
                  {subtotal.toLocaleString()} تومان
                </span>
              </div>

              <div className="flex justify-between text-gray-300">
                <span>هزینه ارسال</span>
                <span>
                  {shippingCost.toLocaleString()} تومان
                </span>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-[#2D2D2D]">
                <span className="font-black">مبلغ نهایی</span>

                <span className="text-xl text-[#00FF95] font-black">
                  {finalPrice.toLocaleString()} تومان
                </span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}

export default Checkout;