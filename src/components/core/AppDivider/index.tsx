import React from "react";

type Props = {
    className?: string;
};

const AppDivider = ({ className = "" }: Props) => {
    return (
        <hr className={`my-2 border-[#000000] border-[1.2px] ${className}`} />
    );
};

export default AppDivider;
