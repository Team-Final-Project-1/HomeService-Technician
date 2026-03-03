import TechnicianLayout
  from "@/components/TechnicianLayout";

import AccountForm
  from "@/features/account-settings/components/AccountForm";

import AccountHeaderActions
  from "@/features/account-settings/components/AccountHeaderActions";

import {
  AccountFormProvider,
} from "@/features/account-settings/context/AccountFormContext";

export default function AccountSettingsPage() {

  return (
    <AccountFormProvider>

      <TechnicianLayout
        headerActions={<AccountHeaderActions />}
      >
        <div className="p-4 md:p-6 lg:p-8">
          <AccountForm />
        </div>
      </TechnicianLayout>

    </AccountFormProvider>
  );
}