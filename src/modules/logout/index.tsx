import AppForm from "@/components/core/AppDiaglogForm";
import { AuthTypes } from "@/enum/auth";
import { useAuthStore } from "@/zustand/store/userAuth";
import React from "react";
import { toast } from "react-toastify";

const LogoutPage = () => {
    const logoutState = useAuthStore((state) => state.clearAuth);
    
    const handleLogout = () => {
        logoutState();
        toast.success("Logout thành công!");
        window.location.reload();
    };

    return (
        <AppForm
            triggerText={AuthTypes.LOGOUT}
            title={AuthTypes.LOGOUT_TITLE}
            description={AuthTypes.LOGOUT_DES}
            fields={[]}
            onSubmit={handleLogout}
        />
    );
};

export default LogoutPage;
