import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";

const statusStyles = {
  "در انتظار بررسی": "bg-yellow-500/10 text-yellow-400",
  "تایید شده": "bg-blue-500/10 text-blue-400",
  "ارسال شده": "bg-[#00FF95]/10 text-[#00FF95]",
  "لغو شده": "bg-red-500/10 text-red-400",
};

const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem("orders")) || [];
  } catch {
    return [];
  }
};

function Admin() {
  const [orders, setOrders] = useState(readOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] =
    useState(null);

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(updatedOrders)
    );
  };

  const deleteOrder = (id) => {
    const confirmed = window.confirm(
      `سفارش #${id} حذف شود؟`
    );

    if (!confirmed) return;

    const updatedOrders = orders.filter(
      (order) => order.id !== id
    );

    saveOrders(updatedOrders);

    if (expandedOrderId === id) {
      setExpandedOrderId(null);
    }

    toast.success("سفارش حذف شد");
  };

  const changeStatus = (id, status) => {
    const updatedOrders = orders.map((order) =>
      order.id === id
        ? { ...order, status }
        : order
    );

    saveOrders(updatedOrders);
    toast.success("وضعیت سفارش تغییر کرد");
  };

  const pendingOrders = orders.filter(
    (order) =>
      order.status === "در انتظار بررسی"
  ).length;

  const completedOrders = orders.filter(
    (order) =>
      order.status === "تایید شده" ||
      order.status === "ارسال شده"
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "لغو شده")
    .reduce(
      (total, order) =>
        total + Number(order.totalPrice || 0),
      0
    );

  const filteredOrders = orders.filter((order) => {
    const searchValue = search
      .trim()
      .toLowerCase();

    const customer = order.customer || {};

    const matchesSearch =
      !searchValue ||
      [
        order.id,
        customer.fullName,
        customer.phone,
        customer.email,
      ].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      );

    const matchesStatus =
      statusFilter === "all" ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-3xl sm:text-4xl font-black mb-8">
          پنل مدیریت سفارش‌ها
        </h1>

        <section className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5">
            <p className="text-gray-400">
              کل سفارش‌ها
            </p>

            <p className="text-3xl font-black mt-3">
              {orders.length}
            </p>
          </div>

          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5">
            <p className="text-gray-400">
              در انتظار بررسی
            </p>

            <p className="text-3xl font-black text-yellow-400 mt-3">
              {pendingOrders}
            </p>
          </div>

          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5">
            <p className="text-gray-400">
              تایید یا ارسال‌شده
            </p>

            <p className="text-3xl font-black text-[#00FF95] mt-3">
              {completedOrders}
            </p>
          </div>

          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5">
            <p className="text-gray-400">
              مجموع فروش
            </p>

            <p className="text-2xl font-black text-[#00FF95] mt-3">
              {totalRevenue.toLocaleString()} تومان
            </p>
          </div>
        </section>

        <section className="grid md:grid-cols-[1fr_260px] gap-4 mb-8">
          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="نام، موبایل، ایمیل یا کد سفارش..."
            className="w-full h-12 bg-[#181818] border border-[#2D2D2D] rounded-xl px-4 outline-none focus:border-[#00FF95]"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="w-full h-12 bg-[#181818] border border-[#2D2D2D] rounded-xl px-4 outline-none focus:border-[#00FF95]"
          >
            <option value="all">
              همه وضعیت‌ها
            </option>

            <option value="در انتظار بررسی">
              در انتظار بررسی
            </option>

            <option value="تایید شده">
              تایید شده
            </option>

            <option value="ارسال شده">
              ارسال شده
            </option>

            <option value="لغو شده">
              لغو شده
            </option>
          </select>
        </section>

        {filteredOrders.length === 0 ? (
          <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-10 text-center text-gray-400">
            سفارشی پیدا نشد
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => {
              const customer =
                order.customer || {};

              const isExpanded =
                expandedOrderId === order.id;

              const subtotal =
                order.subtotal ??
                Number(order.totalPrice || 0) -
                  Number(order.shippingCost || 0);

              return (
                <article
                  key={order.id}
                  className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-5 sm:p-6"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl sm:text-2xl font-black">
                          سفارش #{order.id}
                        </h2>

                        <span
                          className={`px-3 py-1 rounded-lg text-sm font-bold ${
                            statusStyles[order.status] ||
                            "bg-gray-500/10 text-gray-400"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <p className="text-gray-400 mt-2">
                        {order.createdAt}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          changeStatus(
                            order.id,
                            e.target.value
                          )
                        }
                        className="bg-black border border-[#2D2D2D] rounded-xl px-4 py-2 outline-none focus:border-[#00FF95]"
                      >
                        <option>
                          در انتظار بررسی
                        </option>

                        <option>تایید شده</option>
                        <option>ارسال شده</option>
                        <option>لغو شده</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          setExpandedOrderId(
                            isExpanded
                              ? null
                              : order.id
                          )
                        }
                        className="border border-[#2D2D2D] px-4 py-2 rounded-xl hover:border-[#00FF95] hover:text-[#00FF95] transition"
                      >
                        {isExpanded
                          ? "بستن جزئیات"
                          : "مشاهده جزئیات"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteOrder(order.id)
                        }
                        className="bg-red-500/10 text-red-400 px-4 py-2 rounded-xl hover:bg-red-500/20 transition"
                      >
                        حذف
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="grid lg:grid-cols-2 gap-8 mt-6 pt-6 border-t border-[#2D2D2D]">
                      <section>
                        <h3 className="text-[#00FF95] font-black mb-5">
                          اطلاعات گیرنده
                        </h3>

                        <div className="space-y-3 text-gray-300">
                          <p>
                            نام:{" "}
                            <span className="text-white">
                              {customer.fullName}
                            </span>
                          </p>

                          <p>
                            موبایل:{" "}
                            <span
                              dir="ltr"
                              className="inline-block text-white"
                            >
                              {customer.phone}
                            </span>
                          </p>

                          {customer.email && (
                            <p>
                              ایمیل:{" "}
                              <span className="text-white">
                                {customer.email}
                              </span>
                            </p>
                          )}

                          {(customer.province ||
                            customer.city) && (
                            <p>
                              استان و شهر:{" "}
                              <span className="text-white">
                                {customer.province}{" "}
                                {customer.city}
                              </span>
                            </p>
                          )}

                          {customer.postalCode && (
                            <p>
                              کد پستی:{" "}
                              <span className="text-white">
                                {customer.postalCode}
                              </span>
                            </p>
                          )}

                          <p>
                            آدرس:{" "}
                            <span className="text-white">
                              {customer.address}
                            </span>
                          </p>

                          <p>
                            روش ارسال:{" "}
                            <span className="text-white">
                              {customer.shippingMethod ===
                              "express"
                                ? "ارسال سریع"
                                : "پست پیشتاز"}
                            </span>
                          </p>

                          <p>
                            روش پرداخت:{" "}
                            <span className="text-white">
                              {customer.paymentMethod ===
                              "card"
                                ? "کارت به کارت"
                                : "پرداخت آنلاین"}
                            </span>
                          </p>

                          {customer.note && (
                            <p>
                              توضیحات:{" "}
                              <span className="text-white">
                                {customer.note}
                              </span>
                            </p>
                          )}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[#00FF95] font-black mb-5">
                          محصولات سفارش
                        </h3>

                        <div className="space-y-4">
                          {order.products.map((item) => {
                            const quantity =
                              item.quantity || 1;

                            const itemTotal =
                              Number(
                                String(
                                  item.price
                                ).replaceAll(",", "")
                              ) * quantity;

                            return (
                              <div
                                key={item.id}
                                className="flex justify-between gap-4 pb-4 border-b border-[#2D2D2D]"
                              >
                                <div>
                                  <p className="font-bold">
                                    {item.name}
                                  </p>

                                  <p className="text-sm text-gray-400 mt-1">
                                    تعداد: {quantity}
                                  </p>
                                </div>

                                <span className="whitespace-nowrap">
                                  {itemTotal.toLocaleString()}{" "}
                                  تومان
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        <div className="space-y-3 mt-5">
                          <div className="flex justify-between text-gray-400">
                            <span>مجموع کالاها</span>

                            <span>
                              {Number(
                                subtotal
                              ).toLocaleString()}{" "}
                              تومان
                            </span>
                          </div>

                          <div className="flex justify-between text-gray-400">
                            <span>هزینه ارسال</span>

                            <span>
                              {Number(
                                order.shippingCost || 0
                              ).toLocaleString()}{" "}
                              تومان
                            </span>
                          </div>

                          <div className="flex justify-between pt-4 border-t border-[#2D2D2D]">
                            <span className="font-black">
                              مبلغ نهایی
                            </span>

                            <span className="text-[#00FF95] font-black">
                              {Number(
                                order.totalPrice
                              ).toLocaleString()}{" "}
                              تومان
                            </span>
                          </div>
                        </div>
                      </section>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

export default Admin;