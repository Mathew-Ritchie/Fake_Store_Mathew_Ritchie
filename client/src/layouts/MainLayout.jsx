import { Outlet } from "react-router-dom";
import MainHeader from "../Components/Headers_and_Footers/MainHeader";
import MainFooter from "../Components/Headers_and_Footers/MainFooter";
import LoginAndRegisterHeader from "../Components/Headers_and_Footers/LoginAndRegisterHeader";
import CartAndFavouritesLandingHeader from "../Components/Headers_and_Footers/CartAndFavouritesLandingHeader";

export default function MainLayout() {
  return (
    <div className="main-layout-div flex flex-col min-h-screen justify-between">
      <div>
        <MainHeader />
        <LoginAndRegisterHeader />
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
}
