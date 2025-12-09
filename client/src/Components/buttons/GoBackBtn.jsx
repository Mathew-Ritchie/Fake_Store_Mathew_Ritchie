import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gray-600">
      <button
        onClick={() => navigate(-1)}
        className="home-button flex justify-start items-center px-2.5 gap-2.5 no-underline text-gray-800"
      >
        <IoIosArrowRoundBack className="back-arrow text-white text-3xl" />
        <h2 className="text-white">BACK</h2>
      </button>
    </div>
  );
}
