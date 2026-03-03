import {
    useState,
    useEffect,
  } from "react";
  import { useRouter } from "next/router";
  import AccountInfo from "./AccountInfo";
  import AccountStatus from "./AccountStatus";
  import ServiceCheckbox from "./ServiceCheckbox";
  import Toast from "@/components/ui/Toast";
  import {
    useAccountForm,
  } from "../context/AccountFormContext";
  
  export default function AccountForm() {
  
    const router = useRouter();
    const { setFormActions } =
      useAccountForm();
  
    // =========================
    // STATE
    // =========================
  
    const [isAvailable, setIsAvailable] =
      useState(true);
  
    const toggleAvailability = () =>
      setIsAvailable(prev => !prev);
  
    const [services, setServices] =
      useState<string[]>([]);
  
    const toggleService = (service: string) => {
      setServices(prev =>
        prev.includes(service)
          ? prev.filter(s => s !== service)
          : [...prev, service]
      );
    };
  
    const initialForm = {
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
    };
  
    const [form, setForm] =
      useState(initialForm);
  
    const [savedForm, setSavedForm] =
      useState(initialForm);
  
    const handleChange = (
      field: keyof typeof form,
      value: string
    ) => {
      setForm(prev => ({
        ...prev,
        [field]: value,
      }));
    };
  
    // =========================
    // DIRTY CHECK
    // =========================
  
    const isDirty =
      JSON.stringify({
        ...form,
        isAvailable,
        services,
      }) !==
      JSON.stringify({
        ...savedForm,
        isAvailable: true,
        services: [],
      });
  
    const [isSaving, setIsSaving] =
      useState(false);
  
    const [showToast, setShowToast] =
      useState(false);
  
    // =========================
    // RESET
    // =========================
  
    // ✅ กลับมาเหมือน logic เดิม
    const resetForm = () => {
      setForm(initialForm);
    };
  
    const resetAll = () => {
      resetForm();
      setIsAvailable(true);
      setServices([]);
    };
  
    // =========================
    // SUBMIT
    // =========================
  
    const handleSubmit = async () => {
  
      if (isSaving || showToast || !isDirty)
        return;
  
      setIsSaving(true);
  
      const payload = {
        ...form,
        isAvailable,
        services,
      };
  
      console.log(
        "ACCOUNT SETTINGS:",
        payload
      );
  
      await new Promise(r =>
        setTimeout(r, 1200)
      );
  
      setSavedForm(form);
      setIsSaving(false);
  
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
  
      setShowToast(true);
  
      setTimeout(
        () => setShowToast(false),
        2500
      );
    };
  
    // =========================
    // ✅ SYNC HEADER BUTTON
    // =========================
  
    useEffect(() => {
      setFormActions({
        submit: handleSubmit,
        reset: resetAll,
        isDirty,
        isSaving,
      });
    }, [
      handleSubmit,
      resetAll,
      isDirty,
      isSaving,
    ]);
  
    // =========================
    // REFRESH WARNING
    // =========================
  
    useEffect(() => {
  
      const handler =
        (e: BeforeUnloadEvent) => {
  
          if (!isDirty) return;
  
          e.preventDefault();
          e.returnValue = "";
        };
  
      window.addEventListener(
        "beforeunload",
        handler
      );
  
      return () =>
        window.removeEventListener(
          "beforeunload",
          handler
        );
  
    }, [isDirty]);
  
    // =========================
    // ROUTE GUARD
    // =========================
  
    useEffect(() => {
  
      const handleRouteChange = () => {
  
        if (!isDirty) return;
  
        const ok =
          window.confirm(
            "คุณมีข้อมูลที่ยังไม่ได้บันทึก ต้องการออกหรือไม่?"
          );
  
        if (!ok) {
          router.events.emit(
            "routeChangeError"
          );
          throw "Abort";
        }
      };
  
      router.events.on(
        "routeChangeStart",
        handleRouteChange
      );
  
      return () =>
        router.events.off(
          "routeChangeStart",
          handleRouteChange
        );
  
    }, [isDirty, router]);
  
    // =========================
    // UI (NO HEADER BUTTON HERE)
    // =========================
  
    return (
      <>
        <div className="bg-white border rounded-xl shadow-sm p-6 space-y-10">
  
          <AccountInfo
            form={form}
            onChange={handleChange}
            onRefresh={resetForm}
          />
  
          <AccountStatus
            isAvailable={isAvailable}
            onToggle={toggleAvailability}
          />
  
          <ServiceCheckbox
            services={services}
            onToggleService={toggleService}
          />
  
        </div>
  
        <Toast
          message="บันทึกข้อมูลสำเร็จ"
          show={showToast}
        />
      </>
    );
  }