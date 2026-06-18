import PageLayout from "../components/layout/PageLayout/PageLayout";
import { Colors } from "@/styles/colors";
import { AuthProvider } from "@/context/AuthContext";
import RoleSwitcher from "@/components/dev/RoleSwitcher";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: Colors.appBackground,
          margin: 0,
          fontFamily: "Inter, sans-serif",
        }}
      >
        <AuthProvider>
          <PageLayout>{children}</PageLayout>
          {/* ── DEV ONLY: remove before production ── */}
          <RoleSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
