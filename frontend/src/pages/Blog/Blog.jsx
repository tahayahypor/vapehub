import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import podImage from "../../assets/images/pod-system.png";
import coilImage from "../../assets/images/coile.png";
import saltImage from "../../assets/images/salt-nasty.png";

const articles = [
  {
    id: 1,
    title: "راهنمای انتخاب پاد سیستم مناسب",
    category: "راهنمای خرید",
    image: podImage,
    excerpt:
      "برای انتخاب پاد سیستم باید ظرفیت باتری، نوع کارتریج، توان دستگاه و شیوه مصرف را بررسی کنید.",
  },
  {
    id: 2,
    title: "چه زمانی باید کویل دستگاه را تعویض کنیم؟",
    category: "آموزش نگهداری",
    image: coilImage,
    excerpt:
      "کاهش طعم، ایجاد مزه سوختگی و کم‌شدن بخار از مهم‌ترین نشانه‌های زمان تعویض کویل هستند.",
  },
  {
    id: 3,
    title: "تفاوت سالت نیکوتین و جویس",
    category: "آموزش",
    image: saltImage,
    excerpt:
      "سالت نیکوتین و جویس از نظر میزان نیکوتین، نوع دستگاه مناسب و شیوه مصرف تفاوت دارند.",
  },
];

function Blog() {
  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-12">
        <div className="max-w-2xl mb-10">
          <span className="text-[#00FF95] font-bold">
            مجله VapeHub
          </span>

          <h1 className="text-4xl sm:text-5xl font-black mt-3">
            بلاگ
          </h1>

          <p className="text-gray-400 leading-8 mt-4">
            راهنماهای خرید، آموزش نگهداری و اطلاعات کاربردی
            محصولات.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="group bg-[#181818] border border-[#2D2D2D] rounded-2xl overflow-hidden hover:border-[#00FF95] transition"
            >
              <div className="h-64 overflow-hidden bg-[#111111]">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <span className="text-sm text-[#00FF95] font-bold">
                  {article.category}
                </span>

                <h2 className="text-xl font-black leading-8 mt-3">
                  {article.title}
                </h2>

                <p className="text-gray-400 leading-7 mt-4">
                  {article.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-16 border-t border-[#2D2D2D] pt-10">
          <h2 className="text-2xl font-black">
            نکته مهم
          </h2>

          <p className="text-gray-400 leading-8 mt-4 max-w-3xl">
            مطالب این بخش صرفاً برای آشنایی و استفاده صحیح
            از محصولات نوشته شده‌اند. فروش محصولات فروشگاه
            فقط به افراد بالای ۱۸ سال انجام می‌شود.
          </p>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Blog;