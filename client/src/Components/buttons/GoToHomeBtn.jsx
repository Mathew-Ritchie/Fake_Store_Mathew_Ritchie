import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function HomeButton() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-600">
      <button
        onClick={() => navigate("/")}
        className="home-button flex justify-start items-center px-2.5 gap-2.5 no-underline text-gray-800"
      >
        <IoIosArrowRoundBack className="back-arrow text-white text-3xl" />
        <h2 className="text-white">HOME</h2>
      </button>
    </div>
  );
}
