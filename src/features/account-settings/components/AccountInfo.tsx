type FormType = {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
  };
  
  type Props = {
    form: FormType;
    onChange: (
      field: keyof FormType,
      value: string
    ) => void;
    onRefresh: () => void;
  };
  
  export default function AccountInfo({
    form,
    onChange,
    onRefresh,
  }: Props) {
  
    const Label = ({
      text,
    }: {
      text: string;
    }) => (
      <label className="body-3 text-gray-700 flex items-center gap-1">
        {text}
        <span className="text-red-500">*</span>
      </label>
    );
  
    return (
      <section>
  
        <h2 className="headline-5 mb-6">
          รายละเอียดบัญชี
        </h2>
  
        {/* ✅ FORM LAYOUT (Pixel-like mock) */}
        <div className="flex flex-col gap-5">
  
          {/* First Name */}
          <div className="flex flex-col gap-2">
            <Label text="ชื่อ" />
            <input
              className="input"
              value={form.firstName}
              onChange={(e) =>
                onChange("firstName", e.target.value)
              }
            />
          </div>
  
          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <Label text="นามสกุล" />
            <input
              className="input"
              value={form.lastName}
              onChange={(e) =>
                onChange("lastName", e.target.value)
              }
            />
          </div>
  
          {/* Phone */}
          <div className="flex flex-col gap-2">
            <Label text="เบอร์ติดต่อ" />
            <input
              className="input"
              value={form.phone}
              onChange={(e) =>
                onChange("phone", e.target.value)
              }
            />
          </div>
  
          {/* Address + Refresh */}
          <div className="flex flex-col gap-2">
            <Label text="ตำแหน่งที่อยู่ปัจจุบัน" />
  
            <div className="flex gap-3">
              <input
                className="input flex-1"
                value={form.address}
                onChange={(e) =>
                  onChange("address", e.target.value)
                }
              />
  
              <button
                type="button"
                className="btn-secondary whitespace-nowrap"
                onClick={onRefresh}
              >
                รีเฟรช
              </button>
            </div>
          </div>
  
        </div>
  
      </section>
    );
  }