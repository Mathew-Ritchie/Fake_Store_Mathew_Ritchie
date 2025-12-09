import WelcomeModal from "../Components/modal/ModalIntro";
import LinksComponentLandingPage from "../Components/LinksComponentLandingPage";
import LandingPageWelcomeHeader from "../Components/Headers_and_Footers/LandingPageWelcomeHeader";
import CartAndFavouritesLandingHeader from "../Components/Headers_and_Footers/CartAndFavouritesLandingHeader";

export default function LandingPage() {
  return (
    <div className="landing-page-background-div min-h-screen flex flex-col items-center w-full bg-gray-100 pb-5">
      <WelcomeModal />
      <CartAndFavouritesLandingHeader />
      <LandingPageWelcomeHeader />
      <LinksComponentLandingPage />
    </div>
  );
}
