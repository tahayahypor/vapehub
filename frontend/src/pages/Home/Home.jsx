import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar/Navbar";
import FeaturedCategories from "../../components/FeaturedCategories/FeaturedCategories";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import StoreBenefits from "../../components/StoreBenefits/StoreBenefits";
import Footer from "../../components/Footer/Footer";

import hero1 from "../../assets/images/home-slider-disposable-pod-new.png";
import hero2 from "../../assets/images/home-slider-bundle.png";
import hero3 from "../../assets/images/home-slider-uwell.png";
function Home() {
  const images = [hero1, hero2, hero3];

  const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => 
          prev === images.length - 1 ? 0 : prev + 1
        );
      }, 2000);

      return () => clearInterval(interval);
    }, [images.length]);
  return (
    <>
      <Navbar />
<section className="min-h-screen flex items-center relative overflow-hidden">

   <div className="absolute top-0 left-0 w-96 h-96 bg-[#00FF95]/20 blur-[150px] rounded-full"></div>
   <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#00FF95]/10 blur-[150px] rounded-full"></div>

   <div className="container mx-auto px-6 relative z-10">

    <div className="grid lg:grid-cols-2 gap-12 items-center">

      {/* Content */}

      <div>

        <span className="text-[#00FF95] font-semibold">
          فروشگاه تخصصی ویپ و پاد
        </span>

        <h1 className="text-5xl lg:text-7xl font-black leading-tight mt-4">
    
          جدیدترین
          <span className="text-[#00FF95]"> ویپ </span>
          و
          <span className="text-[#00FF95]"> پاد </span>
          برای تجربه‌ای متفاوت
        
        </h1>

        <p className="text-gray-400 text-lg mt-6 leading-8">
          خرید انواع پاد سیستم، ویپ، سالت نیکوتین، جویس و
          لوازم جانبی با ضمانت اصالت کالا و بهترین قیمت.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">

          <button className="bg-[#00FF95] text-black px-8 py-4 rounded-xl font-bold">
            مشاهده محصولات
          </button>

          <button className="border border-[#2D2D2D] px-8 py-4 rounded-xl">
            پرفروش‌ترین‌ها
          </button>

        </div>

        <div className="flex gap-8 mt-10 flex-wrap">

          <div>
            <h3 className="text-3xl font-bold text-[#00FF95]">
              +5000
            </h3>
            <p className="text-gray-400">
              سفارش موفق
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#00FF95]">
              +120
            </h3>
            <p className="text-gray-400">
              محصول موجود
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-[#00FF95]">
              +3000
            </h3>
            <p className="text-gray-400">
              مشتری راضی
            </p>
          </div>

        </div>

      </div>

      {/* Image */}

   
<div className="relative w-full max-w-[650px]">

 {images.map((image, index) => (
  <img
    key={index}
    src={image}
    alt={`Slide ${index}`}
    className={`
      absolute top-0 left-0 w-full rounded-3xl
      transition-opacity duration-1000
      hover:scale-105
      drop-shadow-[0_0_40px_rgba(0,255,149,0.25)]
      ${
        currentSlide === index
          ? "opacity-100"
          : "opacity-0"
      }
    `}
  />
))}

  <img
    src={images[0]}
    alt=""
    className="opacity-0 w-full"
  />

</div>



    </div>

  </div>

</section>
<FeaturedCategories />
<FeaturedProducts />
<StoreBenefits />
<Footer />
    </>
  );
}

export default Home;