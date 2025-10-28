import useProductsStore from "../../GlobalStore/useProductStore";
import Cart from "../buttons/CartBtn";
import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";
import HomeButton from "../buttons/HomeButton";

export default function ProductPageHeader() {
  const { productInfo } = useProductsStore();
  //   console.log(productInfo);

  return (
    <div className="product-page-header-div bg-gray-700 flex justify-between items-center h-[35px] px-2.5 mb-5 w-full">
      <div className="product-page-header-backbtn-title-div flex justify-between items-center h-[35px] gap-1">
        <HomeButton />
      </div>
      <div className="product-page-header-favbtn-cartbtn-div flex justify-between items-center h-[35px] gap-1">
        <GoToFavouritesBtn />
        <Cart />
      </div>
    </div>
  );
}
