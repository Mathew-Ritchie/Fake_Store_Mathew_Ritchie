import React, { useEffect, useState } from "react";
import AddToFavouritesBtn from "../Components/buttons/AddToFavouritesBtn";

export default function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    try {
      const storedFavourites = JSON.parse(localStorage.getItem("myFakeStoreFavourites"));

      if (Array.isArray(storedFavourites)) {
        setFavourites(storedFavourites);
      } else {
        setFavourites([]);
      }
    } catch (error) {
      console.error("Error parsing favourites from localStorage:", error);
      setFavourites([]);
    }
  }, []);

  //console.log(favourites);

  return (
    <div>
      {favourites.map((item) => (
        <div key={item.id}>
          <img src={item.image} style={{ width: "100px" }} />
          <AddToFavouritesBtn />
          <h1>{item.title}</h1>
        </div>
      ))}
    </div>
  );
}
