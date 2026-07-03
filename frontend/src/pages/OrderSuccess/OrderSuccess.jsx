import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

function OrderSuccess() {
  const { orderId } = useParams();
  const { user } = useAuth();

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const order = orders.find(
    (item) =>
      String(item.id) === orderId &&
      item.userId === user.id
  );

  if (!order) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-black">
            سفارش پیدا نشد
          </h1>

          <Link
            to="/profile"
            className="inline-block mt-6 text-[#00FF95] font-bold"
          >
            مشاهده حساب کاربری
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl bg-[#181818] border border-[#2D2D2D] rounded-2xl p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#00FF95] text-black flex items-center justify-center text-3xl font-black">
            ✓
          </div>

          <h1 className="text-3xl font-black mt-6">
            سفارش شما ثبت شد
          </h1>

          <p className="text-gray-400 mt-3">
            سفارش شما دریافت شد و در انتظار بررسی است
          </p>

          <div className="mt-8 border border-[#2D2D2D] rounded-xl overflow-hidden text-right">
            <div className="flex justify-between gap-4 p-4 border-b border-[#2D2D2D]">
              <span className="text-gray-400">کد سفارش</span>
              <span className="font-black">#{order.id}</span>
            </div>

            <div className="flex justify-between gap-4 p-4 border-b border-[#2D2D2D]">
              <span className="text-gray-400">تاریخ</span>
              <span>{order.createdAt}</span>
            </div>

            <div className="flex justify-between gap-4 p-4 border-b border-[#2D2D2D]">
              <span className="text-gray-400">وضعیت</span>
              <span className="text-[#00FF95] font-bold">
                {order.status}
              </span>
            </div>

            <div className="flex justify-between gap-4 p-4">
              <span className="text-gray-400">مبلغ کل</span>
              <span className="text-[#00FF95] font-black">
                {order.totalPrice.toLocaleString()} تومان
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <Link
              to="/profile"
              className="bg-[#00FF95] text-black py-3 rounded-xl font-bold"
            >
              پیگیری سفارش
            </Link>

            <Link
              to="/products"
              className="border border-[#2D2D2D] py-3 rounded-xl font-bold hover:border-[#00FF95]"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default OrderSuccess;