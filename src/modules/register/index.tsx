import AppForm from "@/components/core/AppDiaglogForm";
import React from "react";
import { AuthTypes } from "@/enum/auth";
import { Button } from "@/components/ui/button";
import { registerFields } from "./fields";
import { useRegister } from "@/tanstack/auth/register";

const RegisterPage = () => {
    const registerMutation = useRegister();

    const handleRegister = (data: Record<string, string>) => {
        registerMutation.mutate({
          email: data.email,
          password: data.password,
        });
      };

    return (
        <AppForm
            trigger={
                <Button variant="ghost" className="p-2">
                    Đăng ký
                </Button>
            }
            title={AuthTypes.REGISTER}
            description={AuthTypes.REGISTER_DES}
            fields={registerFields}
            onSubmit={handleRegister}
        />
    );
};

export default RegisterPage;
