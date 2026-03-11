import { Toaster } from "react-hot-toast";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: { fontSize: "14px", borderRadius: "10px", padding: "12px 16px" },
      }} />
      <AppRouter />
    </>
  );
}
