import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";


const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="max-w-6xl mx-auto w-full px-4 py-6 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
