import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function Footer() {
  return (
    <footer className="border-t border-[#2D2D2D] mt-24">

      <div className="container mx-auto px-6 py-14">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo */}
          <div>

            <img
              src={logo}
              alt="VapeHub"
              className="h-24 mb-4"
            />

            <p className="text-gray-400 leading-8">
              فروشگاه تخصصی ویپ، پاد سیستم،
              سالت نیکوتین و لوازم جانبی با
              ضمانت اصالت کالا.
            </p>

          </div>

          {/* Links */}
          <div>

            <h3 className="font-bold mb-5">
              دسترسی سریع
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link to="/">خانه</Link>
              <Link to="/products">محصولات</Link>
              <Link to="/blog">بلاگ</Link>
              <Link to="/contact">تماس با ما</Link>

            </div>

          </div>

          {/* Categories */}
          <div>

            <h3 className="font-bold mb-5">
              دسته بندی ها
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <Link to="/products/category/pod">پاد سیستم</Link>
              <Link to="/products/category/vape">ویپ</Link>
              <Link to="/products/category/salt">سالت نیکوتین</Link>
              <Link to="/products/category/juice">جویس</Link>

            </div>

          </div>

          {/* Contact */}
          <div>

            <h3 className="font-bold mb-5">
              اطلاعات تماس
            </h3>

            <div className="flex flex-col gap-3 text-gray-400">

              <span>021-12345678</span>
              <span>info@vapehub.com</span>
              <span>ساری-ایران </span>

            </div>

          </div>

        </div>

        <div className="border-t border-[#2D2D2D] mt-10 pt-6 text-center text-gray-500">

        2026 VapeHub

        </div>

      </div>

    </footer>
  );
}

export default Footer;