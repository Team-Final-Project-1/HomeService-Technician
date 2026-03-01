import TechnicianLayout from "@/components/TechnicianLayout";
const AccountSettings = () => {
  return (
    <TechnicianLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
        <p>
          Here you can update your account information, change your password,
          and manage your preferences.
        </p>
        {/* Add forms and other components for updating account settings here */}
      </div>
    </TechnicianLayout>
  );
};

export default AccountSettings;
