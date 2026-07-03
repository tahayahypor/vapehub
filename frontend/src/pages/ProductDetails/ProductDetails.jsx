import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCart } from "../../context/CartContext";
import { featuredProducts } from "../../data/featuredProducts";
const specLabels = {
  type: "نوع محصول",
  battery: "باتری",
  power: "توان خروجی",
  cartridge: "ظرفیت مخزن",
  volume: "حجم",
  nicotine: "میزان نیکوتین",
  usage: "مناسب برای",
  resistance: "مقاومت",
  count: "تعداد",
  capacity: "ظرفیت",
  contents: "محتویات بسته",
  warranty: "ضمانت",
};
function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("description");

  const product = featuredProducts.find(
    (item) => item.id === Number(id)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <>
        <Navbar />

        <main className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-3xl font-black">
            محصول پیدا نشد
          </h1>

          <Link
            to="/products"
            className="inline-block mt-6 bg-[#00FF95] text-black px-6 py-3 rounded-xl font-bold"
          >
            بازگشت به محصولات
          </Link>
        </main>
      </>
    );
  }

  const price = Number(
    String(product.price).replaceAll(",", "")
  );

  const relatedProducts = featuredProducts
    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("محصول به سبد خرید اضافه شد");
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <nav className="flex items-center flex-wrap gap-2 text-sm text-gray-400 mb-8">
          <Link to="/" className="hover:text-[#00FF95]">
            خانه
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-[#00FF95]"
          >
            محصولات
          </Link>

          <span>/</span>

          <span className="text-white line-clamp-1">
            {product.name}
          </span>
        </nav>

        <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="h-[420px] sm:h-[560px] bg-[#111111] border border-[#2D2D2D] rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>

          <div className="lg:py-4">
            <span className="text-[#00FF95] font-bold">
              {product.brand}
            </span>

            <h1 className="text-3xl sm:text-4xl font-black leading-relaxed mt-3">
              {product.name}
            </h1>

            <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 px-4 py-2 rounded-xl mt-5">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              موجود در انبار
            </div>

            <p className="text-3xl sm:text-4xl font-black text-[#00FF95] mt-7">
              {price.toLocaleString()} تومان
            </p>

            <p className="text-gray-300 leading-8 mt-7">
              {product.description}
            </p>

            <div className="grid sm:grid-cols-3 gap-3 mt-8">
              <div className="border border-[#2D2D2D] rounded-xl p-4">
                <p className="font-bold">اصالت کالا</p>
                <p className="text-sm text-gray-400 mt-1">
                  تضمین کیفیت
                </p>
              </div>

              <div className="border border-[#2D2D2D] rounded-xl p-4">
                <p className="font-bold">ارسال سریع</p>
                <p className="text-sm text-gray-400 mt-1">
                  سراسر کشور
                </p>
              </div>

              <div className="border border-[#2D2D2D] rounded-xl p-4">
                <p className="font-bold">پشتیبانی</p>
                <p className="text-sm text-gray-400 mt-1">
                  پیش از خرید
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-[#00FF95] text-black py-4 rounded-xl font-black hover:opacity-90 transition"
              >
                افزودن به سبد خرید
              </button>

              <Link
                to="/cart"
                className="border border-[#2D2D2D] py-4 rounded-xl text-center font-bold hover:border-[#00FF95] hover:text-[#00FF95] transition"
              >
                مشاهده سبد خرید
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-16 sm:mt-24">
          <div className="flex gap-6 overflow-x-auto border-b border-[#2D2D2D]">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-4 whitespace-nowrap font-bold ${
                activeTab === "description"
                  ? "text-[#00FF95] border-b-2 border-[#00FF95]"
                  : "text-gray-400"
              }`}
            >
              توضیحات
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-4 whitespace-nowrap font-bold ${
                activeTab === "specs"
                  ? "text-[#00FF95] border-b-2 border-[#00FF95]"
                  : "text-gray-400"
              }`}
            >
              مشخصات فنی
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 whitespace-nowrap font-bold ${
                activeTab === "reviews"
                  ? "text-[#00FF95] border-b-2 border-[#00FF95]"
                  : "text-gray-400"
              }`}
            >
              نظرات
            </button>
          </div>

          <div className="mt-8">
            {activeTab === "description" && (
              <p className="text-gray-300 leading-9">
                {product.description}
              </p>
            )}

         {activeTab === "specs" && (
          <div className="border border-[#2D2D2D] rounded-2xl overflow-hidden">
            {Object.entries(product.specs).map(
              ([key, value]) => (
                <div
                  key={key}
                  className="grid grid-cols-2 gap-4 p-5 border-b last:border-b-0 border-[#2D2D2D]"
                >
                  <span className="text-gray-400">
                    {specLabels[key] || key}
                  </span>

                  <span className="font-bold text-left">
                    {value}
                  </span>
                </div>
              )
            )}
          </div>
        )}
            {activeTab === "reviews" && (
              <div className="border border-[#2D2D2D] rounded-2xl p-8 text-center text-gray-400">
                هنوز نظری برای این محصول ثبت نشده است
              </div>
            )}
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="mt-16 sm:mt-24">
            <h2 className="text-3xl font-black mb-8">
              محصولات مرتبط
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}

export default ProductDetails;