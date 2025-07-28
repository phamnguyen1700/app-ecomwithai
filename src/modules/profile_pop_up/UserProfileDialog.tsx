"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/types/user";
import { IAddress } from "@/types/address";
import { useRef } from "react";
import { toast } from "react-toastify";
import { useAddAddressMutation } from "@/tanstack/address";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/util/Http";

interface UserProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  addresses?: IAddress[];
  refetchAddresses?: () => void;
}

export default function UserProfileDialog({
  user,
  isOpen,
  onClose,
  addresses = [],
  refetchAddresses,
}: UserProfileDialogProps) {
  const { mutate: addAddress } = useAddAddressMutation();
  const { mutate: setDefaultAddress } = useMutation({
    mutationFn: (id: string) => post(`/address/${id}/set-default`, {}),
  });

  const fullNameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const streetRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  console.log("UserProfileDialog addresses:", addresses);

  const handleSave = () => {
    const payload = {
      fullName: fullNameRef.current?.value || "",
      phone: phoneRef.current?.value || "",
      city: cityRef.current?.value || "",
      street: streetRef.current?.value || "",
      country: countryRef.current?.value || "",
      postalCode: postalCodeRef.current?.value || "",
      isDefault: true,
    };

    addAddress(payload, {
      onSuccess: (res) => {
        const id = res?._id;
        if (!id) return toast.error("Không lấy được ID địa chỉ.");

        setDefaultAddress(id, {
          onSuccess: () => {
            toast.success("Tạo địa chỉ thành công!");
            refetchAddresses?.();
            onClose();
          },
          onError: () => toast.error("Không thể đặt mặc định."),
        });
      },

      onError: () => toast.error("Không thể tạo địa chỉ."),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <div className="flex gap-2 px-2">
          {/* LEFT: User Info + Existing Addresses */}
          <div className="w-1/2 border-r pr-4">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">Thông tin người dùng</DialogTitle>
            </DialogHeader>
            <div className="flex">
              <div className="flex-1 text-sm font-medium">Email:</div>
              <div>{user.email}</div>
            </div>
            <div className="flex">
              <div className="flex-1 text-sm font-medium">Vai trò:</div>
              <div>{user.role}</div>
            </div>

            {/* EXISTING ADDRESSES */}
            {addresses.length > 0 && (
              <div>
                <h4 className="font-medium text-sm mb-2">Địa chỉ hiện có</h4>
                <div className="max-h-[250px] overflow-y-auto space-y-2">
                  {addresses.map((addr, idx) => (
                    <div
                      key={addr._id || idx}
                      className="p-3 border border-gray-200 rounded-md bg-white shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm mb-1">{addr.fullName}</div>
                          <div className="text-xs text-gray-600 mb-1">
                            {addr.street}, {addr.city}, {addr.country} ({addr.postalCode})
                          </div>
                          <div className="text-xs text-gray-500">{addr.phone}</div>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          <Checkbox
                            checked={addr.isDefault}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setDefaultAddress(addr._id, {
                                  onSuccess: () => {
                                    toast.success("Đã đặt làm địa chỉ mặc định!");
                                    refetchAddresses?.();
                                  },
                                  onError: () => toast.error("Không thể đặt làm mặc định."),
                                });
                              }
                            }}
                          />
                          <span className="text-xs text-gray-500">Mặc định</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Add New Address Form */}
          <div className="w-1/2 space-y-1">
            <div className="text-lg font-semibold border-b">
              Thêm địa chỉ mới
            </div>

            {/* ADD NEW ADDRESS FORM */}
            <div className="p-3 border border-gray-300 rounded-md bg-gray-50 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Họ và tên</Label>
                  <Input ref={fullNameRef} />
                </div>
                <div>
                  <Label>Số điện thoại</Label>
                  <Input ref={phoneRef} />
                </div>
                <div>
                  <Label>Thành phố</Label>
                  <Input ref={cityRef} />
                </div>
                <div>
                  <Label>Đường</Label>
                  <Input ref={streetRef} />
                </div>
                <div>
                  <Label>Quốc gia</Label>
                  <Input ref={countryRef} />
                </div>
                <div>
                  <Label>Mã bưu điện</Label>
                  <Input ref={postalCodeRef} />
                </div>
              </div>
              <Button
                className="mt-6 bg-[color:var(--tertiary)] hover:bg-red-300"
                onClick={handleSave}
              >
                Thêm địa chỉ
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
