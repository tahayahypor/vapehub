function StoreBenefits() {
  const benefits = [
    {
      title: "ارسال سریع",
      icon: "🚚",
      description: "ارسال سفارشات در سریع‌ترین زمان ممکن",
    },
    {
      title: "ضمانت اصالت",
      icon: "✅",
      description: "تضمین اصل بودن تمامی محصولات",
    },
    {
      title: "پشتیبانی",
      icon: "🎧",
      description: "پاسخگویی و مشاوره قبل از خرید",
    },
    {
      title: "پرداخت امن",
      icon: "🔒",
      description: "درگاه پرداخت کاملاً ایمن",
    },
  ];

  return (
    <section className="py-24">

      <div className="container mx-auto px-6">

        <h2 className="text-4xl font-black text-center mb-4">
          چرا VapeHub؟
        </h2>

        <p className="text-center text-gray-400 mb-12">
          خریدی مطمئن با بهترین خدمات
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {benefits.map((item, index) => (
            <div
              key={index}
              className="
                bg-[#181818]
                border border-[#2D2D2D]
                rounded-3xl
                p-8
                text-center
                hover:border-[#00FF95]
                hover:-translate-y-2
                transition-all
                duration-300
              "
            >
              <div className="text-5xl mb-4">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-400 leading-7">
                {item.description}
              </p>
            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default StoreBenefits;