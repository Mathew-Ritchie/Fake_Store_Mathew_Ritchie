import { Link } from "react-router";

export default function LandingPage() {
  return (
    <div className="landing-page-background-div min-h-screen flex flex-col items-center gap-2 w-full bg-gray-100">
      <div
        style={{ backgroundImage: 'url("/landing-page-images/landing-pattern.jpeg")' }}
        className="landing-page-image-div w-full h-[100px] bg-cover bg-center mt-5"
      >
        <Link to="/main">
          <button className="landing-page-start-btn button-style-1 px-5 py-2.5 text-xl">
            All Items
          </button>
        </Link>
      </div>

      <div className="flex justify-center items-center gap-2 w-full">
        <div
          style={{ backgroundImage: 'url("/landing-page-images/womens-bg.jpg")' }}
          className="landing-page-image-div h-[400px] w-4/6 bg-cover bg-center "
        >
          <Link to="/main">
            <button className="landing-page-start-btn button-style-1 mt-20 px-5 py-2.5 text-xl">
              Women
            </button>
          </Link>
        </div>
        <div
          style={{ backgroundImage: 'url("/landing-page-images/mens-bg.jpg")' }}
          className="landing-page-image-div w-2/6 h-[400px] bg-cover bg-center "
        >
          <Link to="/main">
            <button className="landing-page-start-btn button-style-1 mt-20 px-5 py-2.5 text-xl">
              Men
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 w-full">
        <div
          style={{ backgroundImage: 'url("/landing-page-images/decor-bg.jpg")' }}
          className="landing-page-image-div w-2/6 h-[400px] bg-cover bg-center"
        >
          <Link to="/main">
            <button className="landing-page-start-btn button-style-1 mt-20 px-5 py-2.5 text-xl">
              Decor
            </button>
          </Link>
        </div>
        <div
          style={{ backgroundImage: 'url("/landing-page-images/tech-bg.jpg")' }}
          className="landing-page-image-div h-[400px] w-4/6 bg-cover bg-center"
        >
          <Link to="/main">
            <button className="landing-page-start-btn button-style-1 mt-20 px-5 py-2.5 text-xl">
              Tech
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
