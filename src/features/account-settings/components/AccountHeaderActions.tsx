import { useAccountForm }
  from "../context/AccountFormContext";

export default function AccountHeaderActions() {

  const {
    submit,
    reset,
    isDirty,
    isSaving,
  } = useAccountForm();

  return (
    <>
      <button
        className="btn-secondary"
        type="button"
        onClick={reset}
        disabled={isSaving}
      >
        ยกเลิก
      </button>

      <button
        className="btn-primary"
        type="button"
        onClick={submit}
        disabled={
          isSaving || !isDirty
        }
      >
        {isSaving ? (
          <span className="flex gap-2 items-center">
            <span className="spinner" />
            กำลังบันทึก...
          </span>
        ) : (
          "ยืนยัน"
        )}
      </button>
    </>
  );
}