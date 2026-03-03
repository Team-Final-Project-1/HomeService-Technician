type Props = {
  isAvailable: boolean;
  onToggle: () => void;
};

export default function AccountStatus({
  isAvailable,
  onToggle,
}: Props) {

  return (
    <section className="border-t pt-8">

      <h2 className="headline-5 mb-6">
        สถานะบัญชี
      </h2>

      {/* ✅ Toggle Row */}
      <div
        onClick={onToggle}
        className="flex items-start gap-4 cursor-pointer"
      >

        {/* Toggle */}
        <div
          className={`
            w-12 h-6 rounded-full relative transition shrink-0 mt-1
            ${isAvailable
              ? "bg-blue-600"
              : "bg-gray-300"}
          `}
        >
          <div
            className={`
              w-5 h-5 bg-white rounded-full absolute top-0.5 transition
              ${isAvailable
                ? "right-0.5"
                : "left-0.5"}
            `}
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">

          <span className="body-5 font-medium">
            พร้อมให้บริการ
          </span>

          <p className="body-4 text-gray-500 max-w-xl">
            ระบบจะแสดงคำสั่งซ่อมในบริเวณใกล้เคียงตำแหน่งที่อยู่ปัจจุบัน
            ให้สามารถเลือกรับงานได้
          </p>

        </div>

      </div>

    </section>
  );
}