import React, { useState } from "react";
import { loginFields } from "./fields";
import { useLogin } from "@/tanstack/auth/login";
import { AuthTypes } from "@/enum/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ForgotPasswordDialog from "@/components/common/ForgotPasswordDialog";

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email,
      password,
    });
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="p-2">
            Đăng nhập
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{AuthTypes.LOGIN}</DialogTitle>
            <p className="text-sm text-gray-600">{AuthTypes.LOGIN_DES}</p>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                required
                disabled={loginMutation.isPending}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                required
                disabled={loginMutation.isPending}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                className="text-sm text-blue-600 hover:text-blue-800 p-0 h-auto"
                onClick={() => {
                  setOpen(false);
                  setForgotPasswordOpen(true);
                }}
              >
                Quên mật khẩu?
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loginMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={!email || !password || loginMutation.isPending}
              >
                {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </>
  );
};

export default LoginPage;
