import { Link } from "react-router-dom";
import podImage from "../../assets/images/pod-system.png";
import vapeImage from "../../assets/images/vape-vaporesso.png";
import saltImage from "../../assets/images/salt-nasty.png";
import juiceImage from "../../assets/images/jiuce-vgod.png";
import coilImage from "../../assets/images/coile.png";
import cartridgeImage from "../../assets/images/cartaige.png";
function FeaturedCategories() {
 const categories = [
  {
    title: "پاد سیستم",
    slug: "pod",
    image: podImage,
  },
  {
    title: "ویپ",
    slug: "vape",
    image: vapeImage,
  },
  {
    title: "سالت نیکوتین",
    slug: "salt",
    image: saltImage,
  },
  {
    title: "جویس",
    slug: "juice",
    image: juiceImage,
  },
  {
    title: "کویل",
    slug: "coil",
    image: coilImage,
  },
  {
    title: "کارتریج",
    slug: "cartridge",
    image: cartridgeImage,
  },
];
  return (
    <section className="py-24">

      <div className="container mx-auto px-6">

        <h2 className="text-4xl font-black text-center mb-4">
          دسته‌بندی محصولات
        </h2>

        <p className="text-center text-gray-400 mb-12">
          محصول مورد نظر خود را انتخاب کنید
        </p>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

          {categories.map((category) => (
                <Link
            key={category.slug}
            to={`/products/category/${category.slug}`}
            className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border border-[#2D2D2D]
                hover:border-[#00FF95]
                transition-all
                duration-300
            "
            >

            <img
                src={category.image}
                alt={category.title}
                className="
                w-full
                h-72
                object-cover
                group-hover:scale-110
                transition-all
                duration-700
                "
            />

            <div className="
                absolute
                inset-0
                bg-gradient-to-t
                from-black
                via-black/40
                to-transparent
            " />

            <div className="
                absolute
                bottom-0
                right-0
                left-0
                p-6
                text-center
            ">
                <h3 className="text-2xl font-bold">
                {category.title}
                </h3>
            </div>

            </Link>
          ))}

        </div>

      </div>

    </section>
  );
}
export default FeaturedCategories;