import Header from "../components/header";
import Footer from "../components/footer";
import JsonLd from "../components/JsonLd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd />
      <Header />
      {children}
      <Footer />
    </>
  );
}
