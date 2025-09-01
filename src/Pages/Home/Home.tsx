import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_400px_at_50%_-20%,oklch(0.97_0_0/.8),transparent)] dark:bg-[radial-gradient(1200px_400px_at_50%_-20%,oklch(0.269_0_0/.4),transparent)]">
      <Navbar />
      <main className=" w-full px-12 py-6 flex-1 mt-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
