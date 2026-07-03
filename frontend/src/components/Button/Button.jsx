function Button({ children }) {
  return (
    <button
      className="
      bg-[#00FF95]
      text-black
      px-5
      py-3
      rounded-xl
      font-bold
      hover:opacity-90
      transition
      "
    >
      {children}
    </button>
  );
}

export default Button;