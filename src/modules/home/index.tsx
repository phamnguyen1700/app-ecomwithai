import { images } from "@/routes/config";
import React from "react";
import Category from "./components/Category";
import { HomeTypes } from "@/enum/home";
import ShowInfo from "./components/ShowInfo";

const HomePage = () => {
    const categories = Array.from({ length: 4 }, () => ({
        name: "Skin Concern",
        image: images.acne,
    }));
    const categories2 = Array.from({ length: 6 }, () => ({
        name: "Skin Concern",
        image: images.acne,
    }));
    const skinTypes = Array.from({ length: 6 }, () => ({
        name: "Normal Skin",
        image: images.skin,
    }));
    return (
        <main>
            <ShowInfo title={HomeTypes.HOME} bigTitle description={HomeTypes.DESCRIPTION} image={images.home} buttonLabel="Read more" width={700} height={500} />

            <Category title={HomeTypes.SKIN_CONCERN} categories={categories} btn={"Buy Now"} columns={4} />
            
            <Category title={HomeTypes.SKIN_CONCERN} categories={categories2} columns={6} />

            <ShowInfo title={HomeTypes.DISCOVER} bigTitle description={HomeTypes.DISCOVER_DESC} image={images.about} width={600} height={400} buttonLabel="Read more" />

            <Category categories={skinTypes} btn="Read More" />

            <ShowInfo title={HomeTypes.LOREM_IPSUM} description={HomeTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Add To Cart" reverse border />

            <ShowInfo title={HomeTypes.LOREM_IPSUM} description={HomeTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Add To Cart" textRight border />

            <ShowInfo title={HomeTypes.LOREM_IPSUM} description={HomeTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Add To Cart" reverse border />

            <ShowInfo title={HomeTypes.LOREM_IPSUM} description={HomeTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Add To Cart" textRight border />

            <ShowInfo title={HomeTypes.LOREM_IPSUM} description={HomeTypes.DISCOVER_DESC} image={images.skinType} buttonLabel="Add To Cart" reverse width={700}/>
        </main>
    );
};

export default HomePage;
