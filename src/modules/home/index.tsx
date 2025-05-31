import { Button } from "@/components/ui/button";
import React from "react";

const HomePage = () => {
    return (
        <main>
            <div className="flex items-center justify-end">
                <div>
                    <h1 className="text-2xl font-bold">
                        Care For Your Skin, Care For Your Beauty
                    </h1>
                    <p className="text-lg mt-2">
                        Our skin care clinic best dermatologists in Lahore and
                        Islamabad offer premium aesthetics.
                    </p>
                    <Button>Read more</Button>
                </div>
                <div>
                    <img
                        src="/assets/home.png"
                        alt="Hero Image"
                        className="w-1/2 h-auto"
                    />
                </div>
            </div>
        </main>
    );
};

export default HomePage;
