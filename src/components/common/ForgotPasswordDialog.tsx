"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForgotPass, useResetPass } from "@/tanstack/user";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/otp-input";

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

const ForgotPasswordDialog: React.FC<ForgotPasswordDialogProps> = ({
  open,
  onClose,
}) => {
  const [step, setStep] = useState<"email" | "otp" | "password">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const forgotPassMutation = useForgotPass();
  const resetPassMutation = useResetPass();

  const handleEmailSubmit = () => {
    if (!email) return;
    
    forgotPassMutation.mutate(email, {
      onSuccess: () => {
        setStep("otp");
      },
    });
  };

  const handleOtpSubmit = () => {
    if (!otp || otp.length !== 6) return;
    setStep("password");
  };

  const handlePasswordSubmit = () => {
    if (!newPassword || !confirmPassword) return;
    if (newPassword !== confirmPassword) return;
    if (newPassword.length < 6) return;

    resetPassMutation.mutate({ email, otp, newPassword }, {
      onSuccess: () => {
        // Reset form và đóng dialog
        setStep("email");
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      },
    });
  };

  const handleClose = () => {
    // Reset form khi đóng
    setStep("email");
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                disabled={forgotPassMutation.isPending}
              />
            </div>
            <Button
              onClick={handleEmailSubmit}
              disabled={!email || forgotPassMutation.isPending}
              className="w-full"
            >
              {forgotPassMutation.isPending ? "Đang gửi..." : "Gửi mã xác nhận"}
            </Button>
          </div>
        );

      case "otp":
        return (
          <div className="space-y-4">
            <div>
              <Label>Mã xác nhận (6 số)</Label>
              <InputOTP
                value={otp}
                onChange={(value) => setOtp(value)}
                maxLength={6}
                disabled={resetPassMutation.isPending}
                className="justify-center"
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Nhập mã 6 số đã được gửi đến email của bạn
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("email")}
                className="flex-1"
              >
                Quay lại
              </Button>
              <Button
                onClick={handleOtpSubmit}
                disabled={otp.length !== 6 || resetPassMutation.isPending}
                className="flex-1"
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        );

      case "password":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                disabled={resetPassMutation.isPending}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                disabled={resetPassMutation.isPending}
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <p className="text-red-500 text-sm">Mật khẩu không khớp</p>
            )}
            {newPassword && newPassword.length < 6 && (
              <p className="text-red-500 text-sm">Mật khẩu phải có ít nhất 6 ký tự</p>
            )}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("otp")}
                className="flex-1"
                disabled={resetPassMutation.isPending}
              >
                Quay lại
              </Button>
              <Button
                onClick={handlePasswordSubmit}
                disabled={
                  !newPassword ||
                  !confirmPassword ||
                  newPassword !== confirmPassword ||
                  newPassword.length < 6 ||
                  resetPassMutation.isPending
                }
                className="flex-1"
              >
                {resetPassMutation.isPending ? "Đang đổi mật khẩu..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </div>
        );
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "email":
        return "Quên mật khẩu";
      case "otp":
        return "Nhập mã xác nhận";
      case "password":
        return "Đặt mật khẩu mới";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "email":
        return "Nhập email để nhận mã xác nhận";
      case "otp":
        return `Mã xác nhận đã được gửi đến ${email}`;
      case "password":
        return "Nhập mật khẩu mới cho tài khoản của bạn";
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getStepTitle()}</DialogTitle>
          <p className="text-sm text-gray-600">{getStepDescription()}</p>
        </DialogHeader>
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog; 