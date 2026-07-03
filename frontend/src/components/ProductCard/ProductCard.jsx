import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const categoryNames = {
  pod: "پاد سیستم",
  vape: "ویپ",
  salt: "سالت نیکوتین",
  juice: "جویس",
  coil: "کویل",
  cartridge: "کارتریج",
  accessories: "لوازم جانبی",
};

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const price = Number(
    String(product.price).replaceAll(",", "")
  );

  const handleAddToCart = () => {
    addToCart(product);
    toast.success("محصول به سبد خرید اضافه شد");
  };

  return (
    <article className="group bg-[#181818] border border-[#2D2D2D] rounded-2xl overflow-hidden hover:border-[#00FF95] transition flex flex-col h-full">
      <Link
        to={`/products/${product.id}`}
        className="block h-72 bg-[#111111] overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-sm text-[#00FF95] mb-2">
          {product.brand ||
            categoryNames[product.category] ||
            "محصول"}
        </span>

        <Link
          to={`/products/${product.id}`}
          className="font-black text-lg leading-7 min-h-14 hover:text-[#00FF95] transition"
        >
          {product.name}
        </Link>

        <p className="text-[#00FF95] text-xl font-black mt-4">
          {price.toLocaleString()} تومان
        </p>

        <div className="grid grid-cols-2 gap-3 mt-auto pt-6">
          <Link
            to={`/products/${product.id}`}
            className="border border-[#2D2D2D] text-center py-3 rounded-xl font-bold hover:border-[#00FF95] hover:text-[#00FF95] transition"
          >
            مشاهده
          </Link>

          <button
            type="button"
            onClick={handleAddToCart}
            className="bg-[#00FF95] text-black py-3 rounded-xl font-black hover:opacity-90 transition"
          >
            افزودن به سبد
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;