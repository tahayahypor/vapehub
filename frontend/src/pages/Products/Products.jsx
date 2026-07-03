import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productService } from "../../services/productService";

const categoryNames = {
  pod: "پاد سیستم",
  vape: "ویپ",
  salt: "سالت نیکوتین",
  juice: "جویس",
  coil: "کویل",
  cartridge: "کارتریج",
  accessories: "لوازم جانبی",
};

function Products() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 12;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const data = await productService.getProducts(
          {
            search: search.trim() || undefined,
            category,
            sort,
            skip: (page - 1) * limit,
            limit,
          },
          {
            signal: controller.signal,
          }
        );

        setProducts(data.items);
        setTotal(data.total);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
          setProducts([]);
          setTotal(0);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [category, search, sort, page]);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setPage(1);

    if (selectedCategory === "all") {
      navigate("/products");
    } else {
      navigate(`/products/category/${selectedCategory}`);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setSort("newest");
    setPage(1);
    navigate("/products");
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black">
            {category
              ? categoryNames[category] || "محصولات"
              : "همه محصولات"}
          </h1>

          <p className="text-gray-400 mt-2">
            {loading ? "در حال بارگذاری..." : `${total} محصول`}
          </p>
        </div>

        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              جستجوی محصول
            </label>

            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="نام یا برند محصول..."
              className="w-full h-12 bg-[#181818] border border-[#2D2D2D] rounded-xl px-4 outline-none focus:border-[#00FF95]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              دسته‌بندی
            </label>

            <select
              value={category || "all"}
              onChange={handleCategoryChange}
              className="w-full h-12 bg-[#181818] border border-[#2D2D2D] rounded-xl px-4 outline-none focus:border-[#00FF95]"
            >
              <option value="all">همه محصولات</option>
              <option value="pod">پاد سیستم</option>
              <option value="vape">ویپ</option>
              <option value="salt">سالت نیکوتین</option>
              <option value="juice">جویس</option>
              <option value="coil">کویل</option>
              <option value="cartridge">کارتریج</option>
              <option value="accessories">لوازم جانبی</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              مرتب‌سازی
            </label>

            <select
              value={sort}
              onChange={(event) => {
                setSort(event.target.value);
                setPage(1);
              }}
              className="w-full h-12 bg-[#181818] border border-[#2D2D2D] rounded-xl px-4 outline-none focus:border-[#00FF95]"
            >
              <option value="newest">جدیدترین</option>
              <option value="price_asc">ارزان‌ترین</option>
              <option value="price_desc">گران‌ترین</option>
              <option value="name">نام محصول</option>
            </select>
          </div>
        </section>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-[460px] bg-[#181818] border border-[#2D2D2D] rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center text-red-400">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-10 text-center">
            <h2 className="text-xl font-black">
              محصولی پیدا نشد
            </h2>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 text-[#00FF95] font-bold"
            >
              پاک‌کردن فیلترها
            </button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() => setPage((current) => current - 1)}
                  className="border border-[#2D2D2D] px-5 py-2 rounded-xl disabled:opacity-40"
                >
                  قبلی
                </button>

                <span>
                  صفحه {page} از {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  className="border border-[#2D2D2D] px-5 py-2 rounded-xl disabled:opacity-40"
                >
                  بعدی
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}

export default Products;