import Sidebar from "@/components/layout/sidebar/Sidebar";
import Header from "@/components/layout/header/Header";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header title="Audit Insight" />

        <main style={{ padding: "24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}