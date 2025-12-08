import { Link } from "react-router";
import WelcomeModal from "../Components/modal/ModalIntro";

export default function LandingPage() {
  return (
    <div className="landing-page-background-div min-h-screen flex flex-col items-center gap-2 w-full bg-gray-100 pb-5">
      <WelcomeModal />
      {/* Link for all items */}
      <div className="px-3 w-full flex justify-center items-center pb-2">
        <Link to="/main" className="w-full h-[100px]">
          <div
            style={{ backgroundImage: 'url("/landing-page-images/landing-pattern.jpeg")' }}
            className="flex items-center w-full h-full bg-cover bg-center mt-2 "
          >
            <button className="bg-gray-700/90 text-gray-100 font-bold text-2xl rounded-r-2xl w-[200px] px-5 py-2.5">
              All Items
            </button>
          </div>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-2 w-full px-3">
        {/* Link for all womens items */}
        <Link to="/main?category=women%27s+clothing" className="h-[400px] w-full sm:w-4/6">
          <div
            style={{ backgroundImage: 'url("/landing-page-images/womens-bg.jpeg")' }}
            className="landing-page-image-div w-full h-full bg-cover bg-center "
          >
            <button className="bg-gray-700/70 text-gray-100 font-bold text-2xl rounded-r-2xl w-[200px] mt-60 px-5 py-2.5">
              Women
            </button>
          </div>
        </Link>

        {/* Link for all mens items */}
        <Link to="/main?category=men%27s+clothing" className="w-full sm:w-2/6 h-[400px]">
          <div
            style={{ backgroundImage: 'url("/landing-page-images/mens-bg.jpeg")' }}
            className="landing-page-image-div w-full h-full bg-cover bg-center "
          >
            <button className="bg-gray-700/70 text-gray-100 font-bold text-2xl rounded-r-2xl w-[200px] mt-60 px-5 py-2.5">
              Men
            </button>
          </div>
        </Link>
      </div>

      <div className="flex justify-center flex-col sm:flex-row items-center gap-2 w-full px-3">
        {/* Link for all Decor */}
        <Link to="/main?category=jewelery" className="w-full sm:w-2/6 h-[400px]">
          <div
            style={{ backgroundImage: 'url("/landing-page-images/jewellery-bg.jpeg")' }}
            className="landing-page-image-div w-full h-full bg-cover bg-center"
          >
            <button className="bg-gray-700/70 text-gray-100 font-bold text-2xl rounded-r-2xl w-[200px] mt-60 px-5 py-2.5">
              Jewellery
            </button>
          </div>
        </Link>

        {/* Link for all tech */}
        <Link to="/main?category=electronics" className="w-full sm:w-4/6 h-[400px]">
          <div
            style={{ backgroundImage: 'url("/landing-page-images/tech-bg.jpeg")' }}
            className="landing-page-image-div h-full w-full bg-cover bg-center"
          >
            <button className="bg-gray-700/70 text-gray-100 font-bold text-2xl rounded-r-2xl w-[200px] mt-60 px-5 py-2.5">
              Tech
            </button>
          </div>
        </Link>
      </div>
    </div>
  );
}
