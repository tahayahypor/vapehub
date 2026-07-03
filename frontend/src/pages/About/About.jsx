import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import logo from "../../assets/images/logo.png";

function About() {
  return (
    <>
      <Navbar />

      <main>
        <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#00FF95] font-bold">
                درباره فروشگاه
              </span>

              <h1 className="text-4xl sm:text-5xl font-black mt-4">
                VapeHub
              </h1>

              <p className="text-gray-300 leading-9 mt-6">
                ویپ‌هاب فروشگاهی تخصصی برای بررسی و عرضه
                دستگاه‌های ویپ، پاد سیستم و لوازم جانبی
                است. هدف ما ارائه اطلاعات دقیق، محصولات
                معتبر و تجربه خرید ساده و مطمئن است.
              </p>

              <p className="text-gray-400 leading-8 mt-4">
                محصولات پیش از قرارگرفتن در فروشگاه از نظر
                اصالت و مشخصات بررسی می‌شوند و کاربران
                می‌توانند پیش از خرید از مشاوره تخصصی
                استفاده کنند.
              </p>
            </div>

            <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl flex items-center justify-center h-80 overflow-hidden">
              <img
                src={logo}
                alt="VapeHub"
                className="w-full h-full object-contain p-8"
              />
            </div>
          </div>
        </section>

        <section className="border-y border-[#2D2D2D]">
          <div className="container mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-6">
            <div>
              <h2 className="text-xl font-black text-[#00FF95]">
                اصالت محصولات
              </h2>

              <p className="text-gray-400 leading-7 mt-3">
                بررسی مشخصات و تأمین کالا از منابع معتبر.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#00FF95]">
                مشاوره تخصصی
              </h2>

              <p className="text-gray-400 leading-7 mt-3">
                راهنمایی برای انتخاب دستگاه و لوازم سازگار.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#00FF95]">
                پیگیری سفارش
              </h2>

              <p className="text-gray-400 leading-7 mt-3">
                مشاهده وضعیت سفارش از طریق حساب کاربری.
              </p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 sm:px-6 py-12">
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <h2 className="text-xl font-black text-yellow-400">
              محدودیت سنی
            </h2>

            <p className="text-gray-300 mt-3">
              فروش محصولات این فروشگاه فقط به افراد بالای
              ۱۸ سال انجام می‌شود.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default About;