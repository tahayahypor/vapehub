import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

function NotFound() {
  return (
    <>
      <Navbar />

      <main className="min-h-[calc(100vh-160px)] flex items-center justify-center px-4 py-16">
        <div className="text-center">
          <p className="text-8xl sm:text-9xl font-black text-[#00FF95]">
            404
          </p>

          <h1 className="text-3xl sm:text-4xl font-black mt-6">
            صفحه پیدا نشد
          </h1>

          <p className="text-gray-400 mt-4">
            آدرس واردشده وجود ندارد یا صفحه جابه‌جا شده است.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
            <Link
              to="/"
              className="bg-[#00FF95] text-black px-7 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              بازگشت به خانه
            </Link>

            <Link
              to="/products"
              className="border border-[#2D2D2D] px-7 py-3 rounded-xl font-bold hover:border-[#00FF95] hover:text-[#00FF95] transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default NotFound;