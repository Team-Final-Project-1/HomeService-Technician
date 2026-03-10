const AuthenLoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center gap-6">
      {/* Shield Icon */}
      <div className="relative flex items-center justify-center">
        {/* วงแหวนหมุน */}
        <div className="w-20 h-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
        {/* ไอคอนตรงกลาง */}
        <svg
          className="absolute w-8 h-8 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      </div>

      {/* ข้อความ */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-[16px] font-semibold text-gray-800">
          กำลังยืนยันสิทธิ์การเข้าใช้ระบบ
        </p>
        <p className="text-[13px] text-gray-400">โปรดรอสักครู่...</p>
      </div>

      {/* จุด 3 จุดเคลื่อนไหว */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default AuthenLoadingScreen;
