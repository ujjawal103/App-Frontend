function AppLayout({ children }) {
  return (
    <div className=" w-full flex justify-center bg-gray-100">
      <div className="w-full md:w-[100vw] bg-white shadow-md">
        {children}
      </div>
    </div>
  );
}
export default AppLayout;