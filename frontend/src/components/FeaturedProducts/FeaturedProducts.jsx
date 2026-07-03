import { Swiper, SwiperSlide } from "swiper/react";
import {Navigation,Pagination,Autoplay,} from "swiper/modules";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProductCard from "../ProductCard/ProductCard";
import { featuredProducts } from "../../data/featuredProducts";

function FeaturedProducts() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black">
              محصولات ویژه
            </h2>

            <p className="text-gray-400 mt-3">
              محبوب‌ترین محصولات فروشگاه
            </p>
          </div>

          <Link
            to="/products"
            className="self-start text-[#00FF95] font-bold hover:underline"
          >
            مشاهده همه محصولات
          </Link>
        </div>

        <Swiper
          modules={[
            Navigation,
            Pagination,
            Autoplay,
          ]}
          navigation
          pagination={{
            clickable: true,
          }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={featuredProducts.length > 4}
          grabCursor
          watchOverflow
          spaceBetween={20}
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="
            pb-14
            [&_.swiper-button-next]:text-[#00FF95]
            [&_.swiper-button-prev]:text-[#00FF95]
            [&_.swiper-pagination-bullet]:bg-gray-400
            [&_.swiper-pagination-bullet-active]:bg-[#00FF95]
          "
        >
          {featuredProducts.map((product) => (
            <SwiperSlide
              key={product.id}
              className="h-auto"
            >
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default FeaturedProducts;