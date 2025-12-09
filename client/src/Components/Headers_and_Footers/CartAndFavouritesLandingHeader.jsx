import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";
import GoToCartBtn from "../buttons/GoToCartBtn";

export default function CartAndFavouritesLandingHeader() {
  return (
    <div className="cart-and-favourites-landing-header-div flex justify-end items-center bg-gray-600 w-full text-center relative z-10 py-1 px-5 ">
      <GoToFavouritesBtn />
      <GoToCartBtn />
    </div>
  );
}
