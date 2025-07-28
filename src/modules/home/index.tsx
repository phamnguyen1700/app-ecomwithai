import { images } from "@/routes/config";
import React from "react";
import Category from "./components/Category";
import { AppTypes } from "@/enum/home";
import ShowInfo from "./components/ShowInfo";

const HomePage = () => {
    const categories = [
        { name: "normal", image: "https://tse1.explicit.bing.net/th/id/OIP.L9ITDPy7lMIwcNp2xc45EAEyDM?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "dry", image: "https://yoosun.vn/wp-content/uploads/2025/02/da-hon-hop-da-kho-va-da-dau-la-gi.webp" },
        { name: "oily", image: "https://yoosun.vn/wp-content/uploads/2025/02/da-hon-hop-da-kho-va-da-dau-da-nao-tot-hon.webp" },
        { name: "combination", image: "https://blogchamsoc.com/wp-content/uploads/2020/03/lam-sao-nhan-biet-da-hon-hop.jpg" },
    ];
    const categories2 = [
        { name: "acne", image: "https://tse1.explicit.bing.net/th/id/OIP.eXo3mWGBkh3GF66LI8xRkgHaD3?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "dullness", image: "https://tse1.explicit.bing.net/th/id/OIP.-0a-nXsXHzPnE08xuD7QSQHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "blackheads", image: "https://tse1.explicit.bing.net/th/id/OIP.GAv4SFzCPn9iYSn_YjAmigHaEs?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "dryness", image: "https://file.hstatic.net/1000036599/file/bieu_hien_da_kho_bong_troc__705c883acc9e41c2ad1d72e91246fd37.jpg" },
        { name: "irritation", image: "https://vitaclinic.vn/storage/app/media/di-ung-da-mat-2.jpg" },
        { name: "redness", image: "https://th.bing.com/th/id/OIP.utsupAGz5347uJoGahtarwHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3" },
    ];
    const skinTypes = [
        { name: "normal", image: "https://tse1.explicit.bing.net/th/id/OIP.L9ITDPy7lMIwcNp2xc45EAEyDM?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "dry", image: "https://yoosun.vn/wp-content/uploads/2025/02/da-hon-hop-da-kho-va-da-dau-la-gi.webp" },
        { name: "oily", image: "https://yoosun.vn/wp-content/uploads/2025/02/da-hon-hop-da-kho-va-da-dau-da-nao-tot-hon.webp" },
        { name: "combination", image: "https://blogchamsoc.com/wp-content/uploads/2020/03/lam-sao-nhan-biet-da-hon-hop.jpg" },
        { name: "sensitive", image: "https://tse1.explicit.bing.net/th/id/OIP.L9ITDPy7lMIwcNp2xc45EAEyDM?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
        { name: "acne-prone", image: "https://tse1.explicit.bing.net/th/id/OIP.eXo3mWGBkh3GF66LI8xRkgHaD3?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
    ];
    return (
        <main>
            <ShowInfo title={AppTypes.HOME} bigTitle description={AppTypes.DESCRIPTION} image={images.home} buttonLabel="Tìm hiểu thêm" width={700} height={500} />

            <Category title={AppTypes.SHOP_CATEGORIES} categories={categories} btn={"Mua ngay"} columns={4} />
            
            <Category title={AppTypes.SKIN_CONCERN} categories={categories2} columns={6} />

            <ShowInfo title={AppTypes.DISCOVER} bigTitle description={AppTypes.DISCOVER_DESC} image={images.about} width={600} height={400} buttonLabel="Tìm hiểu thêm" />

            <Category categories={skinTypes} btn="Xem thêm" />

            <ShowInfo title={AppTypes.LOREM_IPSUM} description={AppTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Thêm vào giỏ hàng" reverse border />

            <ShowInfo title={AppTypes.LOREM_IPSUM} description={AppTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Thêm vào giỏ hàng" textRight border />

            <ShowInfo title={AppTypes.LOREM_IPSUM} description={AppTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Thêm vào giỏ hàng" reverse border />

            <ShowInfo title={AppTypes.LOREM_IPSUM} description={AppTypes.DISCOVER_DESC} image={images.skincr} buttonLabel="Thêm vào giỏ hàng" textRight border />

            <ShowInfo title={AppTypes.LOREM_IPSUM} description={AppTypes.DISCOVER_DESC} image={images.skinType} buttonLabel="Thêm vào giỏ hàng" reverse width={700}/>
        </main>
    );
};

export default HomePage;
