import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner";

export default function App({ Component, pageProps }: AppProps) {
  const toastBase = "!flex !items-center !justify-center !text-center";
  return (
    <>
      <Component {...pageProps} />

      <Toaster
        position="top-center"
        richColors
        style={{ fontFamily: "Prompt, sans-serif" }}
        toastOptions={{
          classNames: {
            toast: "!text-[16px] !rounded-xl !min-w-[360px] !px-6 !py-6",
            success: `${toastBase} !bg-green-100 !text-green-500 !border-green-500`,
            error: `${toastBase} !bg-red-100 !text-red-500 !border-red-500`,
            warning: `${toastBase} !bg-yellow-100 !text-yellow-500 !border-yellow-500`,
            info: `${toastBase} !bg-blue-100 !text-blue-500 !border-blue-500`,
          },
        }}
      />
    </>
  );
}
