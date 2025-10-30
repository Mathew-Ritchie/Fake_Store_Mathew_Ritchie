import StoreItems from "../Components/StoreItems";
import SortAndFilterHeader from "../Components/Headers_and_Footers/SortAndFilterHeader";
import WelcomeModal from "../Components/modal/ModalIntro";

export default function MainPage() {
  return (
    <div className="w-full bg-gray-100 h-screen">
      <WelcomeModal />
      <SortAndFilterHeader />
      <StoreItems />
    </div>
  );
}
