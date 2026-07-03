import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("ایمیل و رمز عبور را وارد کنید");
      return;
    }

    setLoading(true);

    const result = await login(
      formData.email,
      formData.password
    );

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("با موفقیت وارد شدید");

    const destination =
      location.state?.from?.pathname || "/profile";

    navigate(destination, { replace: true });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-[#181818] border border-[#2D2D2D] rounded-2xl p-8"
        >
          <h1 className="text-3xl font-black text-center mb-8">
            ورود به حساب
          </h1>

          <div className="space-y-5">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ایمیل"
              autoComplete="email"
              dir="ltr"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 text-left outline-none focus:border-[#00FF95]"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور"
              autoComplete="current-password"
              dir="ltr"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 text-left outline-none focus:border-[#00FF95]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF95] text-black py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "در حال ورود..." : "ورود"}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            حساب ندارید؟{" "}
            <Link
              to="/register"
              className="text-[#00FF95] font-bold"
            >
              ثبت‌نام کنید
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;