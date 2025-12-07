"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Address } from "@/sanity.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface GuestAddressFormProps {
  onAddressSubmit: (address: Partial<Address>) => void;
  initialAddress?: Partial<Address> | null;
}

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
}

const GuestAddressForm = ({
  onAddressSubmit,
  initialAddress,
}: GuestAddressFormProps) => {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: initialAddress?.fullName || "",
    phone: initialAddress?.phone || "",
    province: initialAddress?.province || "",
    district: initialAddress?.district || "",
    ward: initialAddress?.ward || "",
    addressLine: initialAddress?.addressLine || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    // Validate phone number format (Vietnamese phone - 10 digits)
    // Format: 0[3-9]xxxxxxxx (10 digits) or +84[3-9]xxxxxxxx (12 characters, 10 digits)
    const phoneRegex = /^(0|\+84)[3-9]\d{8}$/;
    const cleanedPhone = formData.phone.replace(/\s|\.|-/g, "");
    if (!phoneRegex.test(cleanedPhone)) {
      toast.error("Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 số");
      return false;
    }
    if (!formData.province.trim()) {
      toast.error("Vui lòng nhập tỉnh/thành phố");
      return false;
    }
    if (!formData.district.trim()) {
      toast.error("Vui lòng nhập quận/huyện");
      return false;
    }
    if (!formData.ward.trim()) {
      toast.error("Vui lòng nhập phường/xã");
      return false;
    }
    if (!formData.addressLine.trim()) {
      toast.error("Vui lòng nhập địa chỉ cụ thể");
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Tạo object address theo format Address (không cần _id, _type cho guest)
    const address: Partial<Address> = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      province: formData.province.trim(),
      district: formData.district.trim(),
      ward: formData.ward.trim(),
      addressLine: formData.addressLine.trim(),
      label: "home",
      isDefault: false,
    };

    onAddressSubmit(address);
    toast.success("Địa chỉ đã được lưu!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin giao hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Họ và tên <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nhập họ và tên người nhận"
              required
            />
          </div>

          {/* Số điện thoại */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          {/* Tỉnh/Thành phố */}
          <div className="space-y-2">
            <Label htmlFor="province">
              Tỉnh / Thành phố <span className="text-red-500">*</span>
            </Label>
            <Input
              id="province"
              name="province"
              value={formData.province}
              onChange={handleInputChange}
              placeholder="Ví dụ: TP. Hồ Chí Minh, Hà Nội"
              required
            />
          </div>

          {/* Quận/Huyện */}
          <div className="space-y-2">
            <Label htmlFor="district">
              Quận / Huyện <span className="text-red-500">*</span>
            </Label>
            <Input
              id="district"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              placeholder="Ví dụ: Quận 1, Quận Gò Vấp"
              required
            />
          </div>

          {/* Phường/Xã */}
          <div className="space-y-2">
            <Label htmlFor="ward">
              Phường / Xã <span className="text-red-500">*</span>
            </Label>
            <Input
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleInputChange}
              placeholder="Ví dụ: Phường Bến Nghé, Phường 1"
              required
            />
          </div>

          {/* Địa chỉ cụ thể */}
          <div className="space-y-2">
            <Label htmlFor="addressLine">
              Địa chỉ cụ thể <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="addressLine"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleInputChange}
              placeholder="Số nhà, tên đường, khu phố, thôn/ấp..."
              rows={3}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Lưu thông tin
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GuestAddressForm;
