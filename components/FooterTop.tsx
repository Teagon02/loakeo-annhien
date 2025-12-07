import React from "react";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

interface ContactItemData {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

const data: ContactItemData[] = [
  {
    title: "Địa chỉ",
    subtitle: "Ấp 4, phường Tân Triều, tỉnh Đồng Nai",
    icon: (
      <MapPin className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Gọi cho tôi",
    subtitle: "0937 639 663",
    icon: (
      <Phone className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Giờ làm việc",
    subtitle: "8:00 - 20:00 (Tất cả các ngày trong tuần)",
    icon: (
      <Clock className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
  {
    title: "Email",
    subtitle: "loakeoannhien@gmail.com",
    icon: (
      <Mail className="w-6 h-6 text-gray-600 group-hover:text-primary transition-colors" />
    ),
  },
];
const FooterTop = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 border-b">
      {data?.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 group hover:bg-gray-50 p-4 transition-colors hoverEffect"
        >
          {item?.icon}
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-black hoverEffect">
              {item?.title}
            </h3>
            <p className="text-gray-600 text-sm mt-1 group-hover:text-gray-900 hoverEffect">
              {item?.subtitle}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FooterTop;
