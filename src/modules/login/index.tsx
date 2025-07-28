import React, { useState } from "react";
import Image from "next/image";

import { useLogin } from "@/tanstack/auth/login";
import { useRegister } from "@/tanstack/auth/register";
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
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      loginMutation.mutate({
        email,
        password,
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsLoginMode(true);
    setErrors({});
  };

  const validatePassword = (password: string) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (password.length < 8) {
      return "Mật khẩu phải có ít nhất 8 ký tự";
    }
    if (!hasUpperCase) {
      return "Mật khẩu phải có ít nhất 1 chữ hoa";
    }
    if (!hasLowerCase) {
      return "Mật khẩu phải có ít nhất 1 chữ thường";
    }
    if (!hasNumbers) {
      return "Mật khẩu phải có ít nhất 1 số";
    }
    if (!hasSpecialChar) {
      return "Mật khẩu phải có ít nhất 1 ký tự đặc biệt";
    }
    return "";
  };

  const validateField = (field: string, value: string) => {
    let error = "";
    
    switch (field) {
      case "email":
        if (!value) {
          error = "Email là bắt buộc";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;
        
      case "password":
        if (!value) {
          error = "Mật khẩu là bắt buộc";
        } else if (!isLoginMode) {
          error = validatePassword(value);
        }
        break;
        
      case "confirmPassword":
        if (!isLoginMode) {
          if (!value) {
            error = "Xác nhận mật khẩu là bắt buộc";
          } else if (password !== value) {
            error = "Mật khẩu xác nhận không khớp";
          }
        }
        break;
    }
    
    return error;
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Email validation
    const emailError = validateField("email", email);
    if (emailError) newErrors.email = emailError;
    
    // Password validation
    const passwordError = validateField("password", password);
    if (passwordError) newErrors.password = passwordError;
    
    // Confirm password validation (only for register)
    if (!isLoginMode) {
      const confirmPasswordError = validateField("confirmPassword", confirmPassword);
      if (confirmPasswordError) newErrors.confirmPassword = confirmPasswordError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      registerMutation.mutate({
        email,
        password,
      });
    }
  };

  const switchToRegister = () => {
    setIsLoginMode(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    const error = validateField("email", value);
    setErrors(prev => ({ ...prev, email: error }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    const error = validateField("password", value);
    setErrors(prev => ({ ...prev, password: error }));
    
    // Re-validate confirm password if it exists
    if (confirmPassword && !isLoginMode) {
      const confirmError = validateField("confirmPassword", confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    const error = validateField("confirmPassword", value);
    setErrors(prev => ({ ...prev, confirmPassword: error }));
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" className="p-2" data-login-trigger style={{ display: 'none' }}>
            Đăng nhập
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            {/* Logo and Brand Name */}
            <div className="flex flex-col items-center mb-6">
              <Image
                src="/assets/image.png"
                alt="BeautiBot Logo"
                width={60}
                height={60}
                className="object-contain rounded-full mb-2"
              />
              <h2 className="text-xl font-bold text-gray-800">BeautiBot</h2>
            </div>
            
            <DialogTitle className="text-center">
              {isLoginMode ? AuthTypes.LOGIN_TITLE : AuthTypes.REGISTER}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={isLoginMode ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Nhập email của bạn"
                required
                disabled={loginMutation.isPending || registerMutation.isPending}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Nhập mật khẩu của bạn"
                required
                disabled={loginMutation.isPending || registerMutation.isPending}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {!isLoginMode && (
              <div>
                <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  placeholder="Nhập lại mật khẩu"
                  required
                  disabled={registerMutation.isPending}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {isLoginMode && (
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
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  !email || 
                  !password || 
                  (!isLoginMode && !confirmPassword) ||
                  loginMutation.isPending || 
                  registerMutation.isPending
                }
              >
                {isLoginMode 
                  ? (loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập")
                  : (registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký")
                }
              </Button>
            </div>

            <div className="text-center pt-2">
              <p className="text-sm text-gray-600">
                {isLoginMode ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={switchToRegister}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={switchToLogin}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </p>
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
