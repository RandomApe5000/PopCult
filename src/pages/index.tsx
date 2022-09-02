import type { NextPage } from "next";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Minter from "../components/Minter";

const Home: NextPage = () => {
  return (
    <>
      <div className="background"></div>
      <div className="wrapper">
        <Header />
        <Minter />
        <Footer />
      </div>
    </>
  );
};

export default Home;
