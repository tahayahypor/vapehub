import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useCart } from "../../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const totalPrice = cartItems.reduce((total, item) => {
    const price = Number(String(item.price).replaceAll(",", ""));
    return total + price * (item.quantity || 1);
  }, 0);

  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl sm:text-4xl font-black">
            سبد خرید
          </h1>

          {cartItems.length > 0 && (
            <span className="text-gray-400">
              {totalItems} کالا
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-black mb-3">
              سبد خرید شما خالی است
            </h2>

            <p className="text-gray-400 mb-6">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید
            </p>

            <Link
              to="/products"
              className="inline-block bg-[#00FF95] text-black px-7 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-7 items-start">
            <section className="space-y-4">
              {cartItems.map((item) => {
                const numericPrice = Number(
                  String(item.price).replaceAll(",", "")
                );

                const itemTotal =
                  numericPrice * (item.quantity || 1);

                return (
                  <article
                    key={item.id}
                    className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">
                      <Link
                        to={`/products/${item.id}`}
                        className="w-full sm:w-32 h-40 sm:h-32 bg-white rounded-xl overflow-hidden shrink-0"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain p-2"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between gap-4">
                          <div>
                            <Link
                              to={`/products/${item.id}`}
                              className="font-black text-lg hover:text-[#00FF95] transition"
                            >
                              {item.name}
                            </Link>

                            <p className="text-gray-400 text-sm mt-2">
                              قیمت واحد:{" "}
                              {numericPrice.toLocaleString()} تومان
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                            className="self-start text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-lg transition"
                          >
                            حذف
                          </button>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 mt-6">
                          <div>
                            <p className="text-gray-400 text-sm mb-2">
                              تعداد
                            </p>

                            <div className="flex items-center border border-[#2D2D2D] rounded-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() =>
                                  decreaseQuantity(item.id)
                                }
                                className="w-10 h-10 hover:bg-[#2D2D2D] transition"
                              >
                                −
                              </button>

                              <span className="w-10 text-center font-black">
                                {item.quantity}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  increaseQuantity(item.id)
                                }
                                className="w-10 h-10 bg-[#00FF95] text-black font-black hover:opacity-90 transition"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <div className="text-left">
                            <p className="text-gray-400 text-sm mb-2">
                              مجموع
                            </p>

                            <p className="text-[#00FF95] text-xl font-black">
                              {itemTotal.toLocaleString()} تومان
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-6 lg:sticky lg:top-28">
              <h2 className="text-2xl font-black mb-6">
                خلاصه سفارش
              </h2>

              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span>تعداد کالا</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between">
                  <span>مجموع کالاها</span>
                  <span>{totalPrice.toLocaleString()} تومان</span>
                </div>

                <div className="flex justify-between">
                  <span>هزینه ارسال</span>
                  <span>محاسبه در تسویه‌حساب</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#2D2D2D]">
                <span className="font-bold">جمع کل</span>

                <span className="text-[#00FF95] text-xl font-black">
                  {totalPrice.toLocaleString()} تومان
                </span>
              </div>

              <Link
                to="/checkout"
                className="block w-full mt-6 bg-[#00FF95] text-black text-center py-4 rounded-xl font-black hover:opacity-90 transition"
              >
                ادامه فرایند خرید
              </Link>

              <Link
                to="/products"
                className="block text-center mt-4 text-gray-400 hover:text-white transition"
              >
                ادامه خرید
              </Link>
            </aside>
          </div>
        )}
      </main>
    </>
  );
}

export default Cart;