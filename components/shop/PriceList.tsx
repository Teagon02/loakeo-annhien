import React from "react";
import { Title } from "../ui/text";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

const priceArray = [
  {
    title: "Dưới 2.000.000 đ",
    value: "0-2000000",
  },
  {
    title: "2.000.000 đ - 5.000.000 đ",
    value: "2000000-5000000",
  },
  {
    title: "5.000.000 đ - 15.000.000 đ",
    value: "5000000-15000000",
  },
  {
    title: "15.000.000 đ - 25.000.000 đ",
    value: "15000000-25000000",
  },
  {
    title: "Trên 25.000.000 đ",
    value: "25000000-1000000000",
  },
];

interface Props {
  selectedPrice?: string | null;
  setSelectedPrice: React.Dispatch<React.SetStateAction<string | null>>;
}
const PriceList = ({ selectedPrice, setSelectedPrice }: Props) => {
  return (
    <div className="w-full bg-white p-5">
      <Title className="text-base font-black">Giá</Title>
      <RadioGroup value={selectedPrice || ""} className="mt-2 space-y-1">
        {priceArray.map((price) => (
          <div
            onClick={() => setSelectedPrice(price?.value as string)}
            key={price?.value}
            className="flex items-center space-x-2 hover:cursor-pointer"
          >
            <RadioGroupItem
              value={price?.value as string}
              id={price?.value}
              className="rounded-sm"
            />
            <Label
              htmlFor={price?.value}
              className={`${selectedPrice === price?.value ? "font-semibold text-shop_dark_green" : "font-normal"}`}
            >
              {price?.title}
            </Label>
          </div>
        ))}
        {selectedPrice && (
          <button
            onClick={() => setSelectedPrice(null)}
            className="text-sm font-medium mt-1 underline underline-offset-2 decoration hover:text-dark_green hoverEffect text-left"
          >
            Reset giá
          </button>
        )}
      </RadioGroup>
    </div>
  );
};

export default PriceList;
