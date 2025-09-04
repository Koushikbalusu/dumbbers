import Image from "next/image";
import React from "react";
import style from "./home.module.css";

const heroimgurl = "https://res.cloudinary.com/dziymwwa3/image/upload/v1757017876/8b349ee5-1a9d-4aa5-9a5d-dc8fb8b2ab73.png";
export default function Home() {
  return (
    <>
      <div className={style.herosection} id="herosection">
        <Image className={style.heroimg} src={heroimgurl} alt="heroimg" width={500} height={500} />
      </div>
      <div className={style.categoriessection} id ="categoriessection">
        
      </div>
    </>
  );
}
