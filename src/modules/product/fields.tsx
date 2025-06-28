import { FormInputType } from "@/enum/FormInputType";

export const Fields = () => {
    return [
        {
            name: "search",
            fieldType: FormInputType.TEXT,
            placeholder: "Tìm kiếm sản phẩm",
        },
        {
            name: "ingredients",
            fieldType: FormInputType.SELECT,
            placeholder: "Choose ingredients",
            options: [
                { label: "AHA", value: "AHA" },
                { label: "BHA", value: "BHA" },
                { label: "PHA", value: "PHA" },
                { label: "Tea Tree Extract", value: "Tea Tree Extract" },
                { label: "Niacinamide", value: "Niacinamide" },
            ],
        },
        {
            name: "Skin types",
            fieldType: FormInputType.SELECT,
            placeholder: "Choose skinConcerns",
            options: [
                { label: "Da thường", value: "normal" },
                { label: "Da khô", value: "dry" },
                { label: "Da dầu", value: "oily" },
                { label: "Da hỗn hợp", value: "combination" },
                { label: "Da nhạy cảm", value: "sensitive" },
            ],
        },
    ];
};
