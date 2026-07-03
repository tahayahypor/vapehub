import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("همه فیلدها را کامل کنید");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("رمزهای عبور یکسان نیستند");
      return;
    }

    setLoading(true);

    const result = await register(
      formData.fullName,
      formData.email,
      formData.password
    );

    setLoading(false);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("ثبت‌نام با موفقیت انجام شد");
    navigate("/profile");
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
            ساخت حساب کاربری
          </h1>

          <div className="space-y-5">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="نام و نام خانوادگی"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 outline-none focus:border-[#00FF95]"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ایمیل"
              dir="ltr"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 text-left outline-none focus:border-[#00FF95]"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="رمز عبور"
              dir="ltr"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 text-left outline-none focus:border-[#00FF95]"
            />

            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="تکرار رمز عبور"
              dir="ltr"
              className="w-full bg-black border border-[#2D2D2D] rounded-xl px-4 py-3 text-left outline-none focus:border-[#00FF95]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00FF95] text-black py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            حساب دارید؟{" "}
            <Link to="/login" className="text-[#00FF95] font-bold">
              وارد شوید
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}

export default Register;    