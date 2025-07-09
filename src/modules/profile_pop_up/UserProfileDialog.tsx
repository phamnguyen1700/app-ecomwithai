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
import { useAddAddressMutation, useGetAddressQuery } from "@/tanstack/address";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/util/Http";

interface UserProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  addresses?: IAddress[];
}

export default function UserProfileDialog({
  user,
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  const { data: addresses = [], refetch } = useGetAddressQuery();
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
                refetch();
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">


        <div className="flex gap-6 px-2">
          {/* LEFT: User Info */}
          <div className="w-1/2 border-r pr-6 space-y-4">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Thông tin người dùng</DialogTitle>
          </DialogHeader>

            <div>
              <Label>Email</Label>
              <Input defaultValue={user.email} disabled />
            </div>
            <div>
              <Label>Vai trò</Label>
              <Input defaultValue={user.role} disabled />
            </div>
          </div>

          {/* RIGHT: Address */}
          <div className="w-1/2 space-y-2">
            <div className="text-lg font-semibold border-b pb-1">
              Địa chỉ giao hàng
            </div>

            {addresses.length === 0 ? (
              // NEW FORM
              <div className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm space-y-3">
                <div>
                  <Label>Họ và tên</Label>
                  <Input ref={fullNameRef} />
                </div>
                <div className="grid grid-cols-2 gap-3">
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
                  <div className="col-span-2">
                    <Label>Mã bưu điện</Label>
                    <Input ref={postalCodeRef} />
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <Checkbox checked disabled />
                  <span className="text-sm text-muted-foreground">
                    Địa chỉ mặc định
                  </span>
                </div>
              </div>
            ) : (
              // EXISTING ADDRESSES
              <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 super-thin-scrollbar">
                {addresses.filter(addr => addr.isDefault).map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    className="p-4 border border-gray-300 rounded-md bg-gray-50 shadow-sm space-y-3"
                  >
                    <div>
                      <Label>Họ và tên</Label>
                      <Input defaultValue={addr.fullName} disabled />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Số điện thoại</Label>
                        <Input defaultValue={addr.phone} disabled />
                      </div>
                      <div>
                        <Label>Thành phố</Label>
                        <Input defaultValue={addr.city} disabled />
                      </div>
                      <div>
                        <Label>Đường</Label>
                        <Input defaultValue={addr.street} disabled />
                      </div>
                      <div>
                        <Label>Quốc gia</Label>
                        <Input defaultValue={addr.country} disabled />
                      </div>
                      <div className="col-span-2">
                        <Label>Mã bưu điện</Label>
                        <Input defaultValue={addr.postalCode} disabled />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-1">
                      <Checkbox checked={addr.isDefault} disabled />
                      <span className="text-sm text-muted-foreground">
                        Địa chỉ mặc định
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-[color:var(--tertiary)] hover:bg-red-300"
            onClick={handleSave}
            disabled={addresses.length > 0}
          >
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
