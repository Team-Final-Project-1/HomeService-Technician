import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center font-prompt gap-10">
      <h1 className="text-3xl font-bold text-gray-800">
        ยินดีต้อนรับสู่หน้าแรก!
      </h1>
      <Link
        className="px-7 py-5 bg-blue-600  text-white rounded-lg hover:bg-blue-700"
        href="/service-requests"
      >
        <p className="hover:underline">เริ่มใช้งาน</p>
      </Link>
    </div>
  );
};

export default HomePage;
