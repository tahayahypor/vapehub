import { Link } from "react-router-dom";
import { useState } from "react";
import Container from "../Container/Container";
import logo from "../../assets/images/logo.png";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
function Navbar() {
  const [showProducts, setShowProducts] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-[#2D2D2D] bg-[#0F0F0F] sticky top-0 z-50">
      <Container>
        <div className="h-20 flex items-center justify-between">

          {/* Right Side - Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="VapeHub Logo"
              className="h-40 w-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-8">

            <Link
              to="/"
              className="hover:text-[#00FF95] transition"
            >
              خانه
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setShowProducts(true)}
              onMouseLeave={() => setShowProducts(false)}
            >
              <button className="hover:text-[#00FF95] transition">
                محصولات ▼
              </button>

              {showProducts && (
                <div className="absolute top-full right-0 pt-2 w-56">
                  <div className="bg-[#181818] border border-[#2D2D2D] rounded-xl shadow-xl overflow-hidden">

                    <Link
                      to="/products/category/pod"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      پاد سیستم
                    </Link>

                    <Link
                      to="/products/category/vape"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      ویپ
                    </Link>

                    <Link
                      to="/products/category/salt"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      سالت نیکوتین
                    </Link>

                    <Link
                      to="/products/category/juice"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      جویس
                    </Link>

                    <Link
                      to="/products/category/coil"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      کویل
                    </Link>

                    <Link
                      to="/products/category/cartridge"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      کارتریج
                    </Link>

                    <Link
                      to="/products/category/accessories"
                      className="block px-4 py-3 hover:bg-[#222222]"
                    >
                      لوازم جانبی
                    </Link>

                  </div>
                </div>
              )}
            </div>

            <Link
              to="/blog"
              className="hover:text-[#00FF95] transition"
            >
              بلاگ
            </Link>

            <Link
              to="/about"
              className="hover:text-[#00FF95] transition"
            >
              درباره ما
            </Link>

            <Link
              to="/contact"
              className="hover:text-[#00FF95] transition"
            >
              تماس با ما
            </Link>

          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">

           <Link
            to="/cart"
            className="
              relative
              text-xl
              hover:text-[#00FF95]
              transition
            "
          >
            🛒

            {cartItems.length > 0 && (
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-[#00FF95]
                  text-black
                  w-5
                  h-5
                  rounded-full
                  flex
                  items-center
                  justify-center
                  text-xs
                  font-bold
                "
              >
                {cartItems.length}
              </span>
            )}
          </Link>
              {user?.role === "admin" && (
            <Link
              to="/admin"
              className="px-4 py-2 rounded-lg border border-[#00FF95] text-[#00FF95] hover:bg-[#00FF95] hover:text-black transition"
            >
              مدیریت
            </Link>
          )}
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="px-4 py-2 rounded-lg border border-[#2D2D2D] hover:border-[#00FF95] hover:text-[#00FF95] transition"
                >
                  {user.fullName}
                </Link>

                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-[#00FF95] text-black font-semibold hover:opacity-90 transition"
                >
                  خروج
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-[#2D2D2D] hover:border-[#00FF95] hover:text-[#00FF95] transition"
                >
                  ورود
                </Link>

                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-[#00FF95] text-black font-semibold hover:opacity-90 transition"
                >
                  ثبت نام
                </Link>
              </>
            )}

          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-3xl"
          >
            ☰
          </button>

        </div>
      </Container>
{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="md:hidden border-t border-[#2D2D2D] bg-[#0F0F0F]">
    <div className="flex flex-col p-5 gap-4">

      <Link
        to="/"
        onClick={() => setMobileMenuOpen(false)}
      >
        خانه
      </Link>

      {/* Mobile Products Dropdown */}
      <div>

        <button
          onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
          className="flex items-center justify-between w-full"
        >
          <span>محصولات</span>
          <span>
            {mobileProductsOpen ? "▲" : "▼"}
          </span>
        </button>

        {mobileProductsOpen && (
          <div className="mt-3 mr-4 flex flex-col gap-3 text-sm text-gray-300">

            <Link
              to="/products/category/pod"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              پاد سیستم
            </Link>

            <Link
              to="/products/category/vape"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              ویپ
            </Link>

            <Link
              to="/products/category/salt"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              سالت نیکوتین
            </Link>

            <Link
              to="/products/category/juice"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              جویس
            </Link>

            <Link
              to="/products/category/coil"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              کویل
            </Link>

            <Link
              to="/products/category/cartridge"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              کارتریج
            </Link>

            <Link
              to="/products/category/accessories"
              onClick={() => {
                setMobileMenuOpen(false);
                setMobileProductsOpen(false);
              }}
            >
              لوازم جانبی
            </Link>

          </div>
        )}

      </div>

      <Link
        to="/blog"
        onClick={() => setMobileMenuOpen(false)}
      >
        بلاگ
      </Link>

      <Link
        to="/about"
        onClick={() => setMobileMenuOpen(false)}
      >
        درباره ما
      </Link>

      <Link
        to="/contact"
        onClick={() => setMobileMenuOpen(false)}
      >
        تماس با ما
      </Link>

      <Link
        to="/cart"
        onClick={() => setMobileMenuOpen(false)}
      >
        سبد خرید
      </Link>
      {user?.role === "admin" && (
        <Link
          to="/admin"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[#00FF95] font-bold"
        >
          پنل مدیریت
        </Link>
      )}
    {user ? (
  <>
    <Link
      to="/profile"
      onClick={() => setMobileMenuOpen(false)}
    >
      حساب {user.fullName}
    </Link>

    <button
      type="button"
      onClick={() => {
        logout();
        setMobileMenuOpen(false);
      }}
      className="bg-[#00FF95] text-black px-4 py-2 rounded-lg text-center font-semibold"
    >
      خروج از حساب
    </button>
  </>
) : (
  <>
    <Link
      to="/login"
      onClick={() => setMobileMenuOpen(false)}
    >
      ورود
    </Link>

    <Link
      to="/register"
      onClick={() => setMobileMenuOpen(false)}
      className="bg-[#00FF95] text-black px-4 py-2 rounded-lg text-center font-semibold"
    >
      ثبت نام
    </Link>
  </>
)}

    </div>
  </div>
)}
    </header>
  );
}

export default Navbar;