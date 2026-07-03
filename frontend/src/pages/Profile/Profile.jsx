import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const savedOrders =
  JSON.parse(localStorage.getItem("orders")) || [];

  const userOrders = savedOrders.filter(
  (order) => order.userId === user.id
);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black">
              حساب کاربری
            </h1>

            <p className="text-gray-400 mt-2">
              خوش آمدید، {user.fullName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="border border-red-500/50 text-red-400 px-5 py-2 rounded-xl hover:bg-red-500/10 transition"
          >
            خروج
          </button>
        </div>

        <section className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-6">
          <h2 className="text-2xl font-black mb-6">
            اطلاعات حساب
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-2">
                نام و نام خانوادگی
              </p>

              <p className="font-bold">
                {user.fullName}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-2">
                ایمیل
              </p>

              <p dir="ltr" className="text-right font-bold">
                {user.email}
              </p>
            </div>
          </div>
        </section>
        <section className="mt-10">
  <h2 className="text-2xl font-black mb-6">
    سفارش‌های من
  </h2>

  {userOrders.length === 0 ? (
    <div className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-8 text-center text-gray-400">
      هنوز سفارشی ثبت نکرده‌اید
    </div>
  ) : (
    <div className="space-y-5">
      {userOrders.map((order) => (
        <div
          key={order.id}
          className="bg-[#181818] border border-[#2D2D2D] rounded-2xl p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-xl font-black">
                سفارش #{order.id}
              </h3>

              <p className="text-gray-400 mt-2">
                تاریخ: {order.createdAt}
              </p>
            </div>

            <span className="text-[#00FF95] font-bold">
              {order.status}
            </span>
          </div>

          <div className="mt-5 pt-5 border-t border-[#2D2D2D] space-y-3">
            {order.products.map((product) => (
              <div
                key={product.id}
                className="flex justify-between gap-4"
              >
                <span>
                  {product.name} × {product.quantity}
                </span>

                <span className="text-gray-400">
                  {(
                    Number(
                      String(product.price).replaceAll(",", "")
                    ) * product.quantity
                  ).toLocaleString()}{" "}
                  تومان
                </span>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-5 pt-5 border-t border-[#2D2D2D]">
            <span className="font-bold">جمع کل</span>

            <span className="text-[#00FF95] font-black">
              {order.totalPrice.toLocaleString()} تومان
            </span>
          </div>
        </div>
      ))}
    </div>
  )}
</section>
      </main>
    </>
  );
}

export default Profile;