import Header from "./components/Header";
import Hero from "./components/Hero";
import DealsStrip from "./components/DealsStrip";
import OrderNow from "./components/OrderNow";
import Highlights from "./components/Highlights";
import Menu from "./components/Menu";
import Locations from "./components/Locations";
import Footer from "./components/Footer";
import MobileOrderBar from "./components/MobileOrderBar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="pb-20 md:pb-0">
        <Hero />
        <DealsStrip />
        <OrderNow />
        <Highlights />
        <Menu />
        <Locations />
      </main>
      <Footer />
      <MobileOrderBar />
    </>
  );
}
