import {
    createContext,
    useContext,
    useState,
  } from "react";
  
  type FormContextType = {
    submit?: () => void;
    reset?: () => void;
    isDirty: boolean;
    isSaving: boolean;
    setFormActions: (
      actions: Partial<FormContextType>
    ) => void;
  };
  
  const AccountFormContext =
    createContext<FormContextType | null>(null);
  
  export const AccountFormProvider = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  
    const [state, setState] =
      useState<FormContextType>({
        isDirty: false,
        isSaving: false,
        setFormActions: () => {},
      });
  
    const setFormActions =
      (actions: Partial<FormContextType>) =>
        setState(prev => ({
          ...prev,
          ...actions,
        }));
  
    return (
      <AccountFormContext.Provider
        value={{
          ...state,
          setFormActions,
        }}
      >
        {children}
      </AccountFormContext.Provider>
    );
  };
  
  export const useAccountForm =
    () => {
      const ctx =
        useContext(AccountFormContext);
  
      if (!ctx)
        throw new Error(
          "useAccountForm must be used inside provider"
        );
  
      return ctx;
    };