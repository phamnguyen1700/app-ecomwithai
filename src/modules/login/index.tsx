import AppForm from "@/components/core/AppDiaglogForm";
import React from "react";
import { loginFields } from "./fields";
import { useLogin } from "@/tanstack/auth/login";
import { AuthTypes } from "@/enum/auth";
import { Button } from "@/components/ui/button";
import Icon from "@/components/assests/icons";
const LoginPage = () => {
    const loginMutation = useLogin();

    const handleLogin = (data: Record<string, string>) => {
        loginMutation.mutate({
            email: data.email,
            password: data.password,
        });
    };
    return (
        <>
            <AppForm
                trigger={
                    <Button variant="ghost" className="p-2">
                        <Icon name="user" size={20} />
                    </Button>
                }
                title={AuthTypes.LOGIN}
                description={AuthTypes.LOGIN_DES}
                fields={loginFields}
                onSubmit={handleLogin}
            />
        </>
    );
};

export default LoginPage;
