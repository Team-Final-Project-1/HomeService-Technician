type Props = {
    services: string[];
    onToggleService: (service: string) => void;
  };
  
  const SERVICES = [
    "ล้างแอร์",
    "ติดตั้งแอร์",
    "ทำความสะอาดทั่วไป",
    "ซ่อมแอร์",
    "ซ่อมเครื่องซักผ้า",
    "ติดตั้งเตาแก๊ส",
    "ติดตั้งเครื่องดูดควัน",
    "ติดตั้งชักโครก",
    "ติดตั้งเครื่องทำน้ำอุ่น",
  ];
  
  export default function ServiceCheckbox({
    services,
    onToggleService,
  }: Props) {
  
    return (
      <section className="border-t pt-8">
  
        <h2 className="headline-5 mb-6">
          บริการที่รับซ่อม
        </h2>
  
        {/* ✅ Vertical list (เหมือน mock 100%) */}
        <div className="flex flex-col gap-4">
  
          {SERVICES.map((service) => {
  
            const checked =
              services.includes(service);
  
            return (
              <label
                key={service}
                className="flex items-center gap-3 body-3 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onToggleService(service)
                  }
                  className="
                    w-4 h-4
                    accent-blue-600
                    cursor-pointer
                  "
                />
  
                <span>
                  {service}
                </span>
  
              </label>
            );
          })}
  
        </div>
  
      </section>
    );
  }