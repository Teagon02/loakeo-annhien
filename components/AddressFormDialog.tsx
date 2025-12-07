"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Address } from "@/sanity.types";

// Extended Address type to include userId and email from schema
interface AddressWithUserId extends Address {
  userId?: string;
  email?: string;
}

interface AddressFormDialogProps {
  onAddressAdded: () => void;
  addresses?: AddressWithUserId[];
}

interface AddressFormData {
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  addressLine: string;
  label: "home" | "office" | "other";
  isDefault: boolean;
}

const AddressFormDialog = ({
  onAddressAdded,
  addresses = [],
}: AddressFormDialogProps) => {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    addressLine: "",
    label: "home",
    isDefault: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Gọi API route để tạo địa chỉ
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          province: formData.province.trim(),
          district: formData.district.trim(),
          ward: formData.ward.trim(),
          addressLine: formData.addressLine.trim(),
          label: formData.label,
          isDefault: formData.isDefault,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create address");
      }

      toast.success(data.message || "Thêm địa chỉ thành công!");
      setOpen(false);

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        addressLine: "",
        label: "home",
        isDefault: false,
      });

      // Refresh addresses list
      onAddressAdded();
    } catch (error) {
      console.error("Error creating address:", error);

      // Hiển thị lỗi chi tiết hơn để debug
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi thêm địa chỉ";

      // Kiểm tra các lỗi phổ biến
      if (errorMessage.includes("Unauthorized")) {
        toast.error("Vui lòng đăng nhập để thêm địa chỉ.");
      } else if (
        errorMessage.includes("permission") ||
        errorMessage.includes("Permission")
      ) {
        toast.error(
          "Bạn không có quyền thêm địa chỉ. Vui lòng kiểm tra cấu hình Sanity permissions."
        );
      } else if (errorMessage.includes("Invalid phone")) {
        toast.error("Số điện thoại không hợp lệ.");
      } else if (errorMessage.includes("Missing required")) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      } else {
        toast.error(`Lỗi: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-4">
          Thêm địa chỉ mới
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          <DialogDescription>
            Vui lòng điền đầy đủ thông tin địa chỉ nhận hàng
          </DialogDescription>
        </DialogHeader>
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

          {/* Loại địa chỉ */}
          <div className="space-y-2">
            <Label htmlFor="label">Loại địa chỉ</Label>
            <select
              id="label"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            >
              <option value="home">Nhà riêng</option>
              <option value="office">Văn phòng</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* Đặt làm mặc định */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={formData.isDefault}
              onCheckedChange={handleCheckboxChange}
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Đặt làm địa chỉ mặc định
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu địa chỉ"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormDialog;
