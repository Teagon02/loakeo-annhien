import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number;
  discount: number;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex items-center gap-2">
      <PriceFormatter amount={price} className="text-shop_dark_green" />
      {price && discount && (
        <PriceFormatter
          amount={price + (price * discount) / 100}
          className="text-shop_light_text line-through font-normal"
        />
      )}
    </div>
  );
};

export default PriceView;
