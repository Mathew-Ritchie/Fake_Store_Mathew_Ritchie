import useProductsStore from "../../GlobalStore/useProductStore";
import Cart from "../buttons/GoToCartBtn";
import GoToFavouritesBtn from "../buttons/GoToFavouritesBtn";
import NavigateButton from "../buttons/NavigateButton";
import BackButton from "../buttons/NavigateButton";

export default function ProductPageHeader() {
  const { productInfo } = useProductsStore();
  //   console.log(productInfo);

  return (
    <div className="product-page-header-div bg-gray-600 flex justify-between items-center h-[35px] px-2.5 mb-5 w-full">
      {/* Btn receives a label and a path */}
      <NavigateButton label="BACK" path={-1} />

      <div className="product-page-header-favbtn-cartbtn-div flex justify-between items-center h-[35px] gap-1">
        <GoToFavouritesBtn />
        <Cart />
      </div>
    </div>
  );
}
