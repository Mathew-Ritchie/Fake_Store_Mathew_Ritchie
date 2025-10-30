//Stores
import useFavouritesStore from "../GlobalStore/useFavouritesStore";
//Components
import FavouriteItems from "../Components/FavouriteItems";
import HomeButton from "../Components/buttons/HomeButton";

//Favourites layout function. If there are items in favourites then they
export default function FavouritesPage() {
  const { favourites } = useFavouritesStore();

  //If there is no favourites or length is equal to 0.
  if (!favourites || favourites.length === 0) {
    return (
      <div className="favourites-empty-message w-full">
        <HomeButton />

        <h2 className="text-center">Your Favourites</h2>
        <p className="text-center">
          You haven't added any items to your favourites yet. Go explore the store!
        </p>
      </div>
    );
  }

  //If there are favourites.
  return (
    <div className="favourites-page-container w-full bg-gray-200 flex flex-col justify-center items-center pb-10">
      <HomeButton />

      <h2 className="cart-page-sub-title bg-white mb-0 p-4 sm:w-[500px] w-full text-center text-3xl">
        Your Favourites
      </h2>
      <FavouriteItems />
    </div>
  );
}
