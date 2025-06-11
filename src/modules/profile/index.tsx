'use client'
import AppForm from "@/components/core/AppForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import { Fields } from "./fields";

const Profile = () => {
    const fields = Fields();
    const handleEdit = (e: any) => {
        console.log(e);
    };
    return (
        <div className="md:container mx-auto p-4 space-y-4 border h-full">
            <div className="w-full h-10 bg-gradient-to-r from-blue-200 via-white to-yellow-100 rounded"></div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="font-bold text-1xl">Alex Rawles</h1>
                        <p className="text-[var(--light-color)]">
                            Tuan@gmail.com
                        </p>
                    </div>
                </div>                
            </div>
            <AppForm items={fields} cols={1} onSubmit={handleEdit} btnText={'Edit'} />
        </div>
    );
};

export default Profile;
