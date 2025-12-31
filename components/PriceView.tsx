import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number;
  discount: number;
  className?: string;
}
const PriceView = ({ price, discount }: Props) => {
  const originalPrice =
    price && discount ? price + (price * discount) / 100 : null;

  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-2">
        {originalPrice && (
          <PriceFormatter
            amount={originalPrice}
            className="text-sm text-shop_light_text line-through font-normal"
          />
        )}
        {discount ? (
          <span className="text-sm font-bold text-red-500 border border-red-500/50 bg-red-100/50 px-1 rounded-full shrink-0">
            -{discount}%
          </span>
        ) : null}
      </div>
      <PriceFormatter
        amount={price}
        className="text-sm text-shop_dark_green font-semibold"
      />
    </div>
  );
};

export default PriceView;
