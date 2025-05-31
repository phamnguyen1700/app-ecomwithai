import { Button } from "@/components/ui/button";
import { images } from "@/routes/config";
import Image from "next/image";
import React from "react";
import Category from "./components/Category";
import { HomeTypes } from "@/enum/home";
import ShowInfo from "./components/ShowInfo";

const HomePage = () => {
    const categories = Array.from({ length: 4 }, () => ({
        name: "Skin Concern",
        image: images.acne,
    }));
    const skinTypes = Array.from({ length: 6 }, () => ({
        name: "Normal Skin",
        image: images.skin,
    }));
    return (
        <main>
            <div className="flex items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[color:var(--primary)]">
                        Care For Your Skin, Care For Your Beauty
                    </h1>
                    <p className="text-lg mt-2 my-6">
                        Our skin care clinic best dermatologists in Lahore and
                        Islamabad offer premium aesthetics.
                    </p>
                    <Button className="rounded-md py-1 px-8 bg-[color:var(--primary)]">
                        Read more
                    </Button>
                </div>
                <div>
                    <Image
                        src={images.home}
                        alt="Hero Image"
                        loading="lazy"
                        width={700}
                        height={700}
                    />
                </div>
            </div>
            <Category
                title={HomeTypes.SKIN_CONCERN}
                categories={categories}
                btn={"Buy Now"}
                columns={4}
            />
            <Category
                title={HomeTypes.SKIN_CONCERN}
                categories={categories}
                columns={3}
            />

            <ShowInfo
                title={HomeTypes.DISCOVER}
                description={HomeTypes.DISCOVER_DESC}
                image={images.about}
                buttonLabel="Read more"
            />
            <Category categories={skinTypes} btn="Read More" />
            <ShowInfo
                title={HomeTypes.LOREM_IPSUM}
                description={HomeTypes.DISCOVER_DESC}
                image={images.skincr}
                buttonLabel="Add To Cart"
                reverse
            />
            <ShowInfo
                title={HomeTypes.LOREM_IPSUM}
                description={HomeTypes.DISCOVER_DESC}
                image={images.skincr}
                buttonLabel="Add To Cart"
            />
            <ShowInfo
                title={HomeTypes.LOREM_IPSUM}
                description={HomeTypes.DISCOVER_DESC}
                image={images.skincr}
                buttonLabel="Add To Cart"
                reverse
            />
        </main>
    );
};

export default HomePage;
