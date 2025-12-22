import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number;
  discount: number;
  className?: string;
}
const PriceView = ({ price, discount }: Props) => {
  return (
    <div className="flex items-center gap-1 whitespace-nowrap">
      <PriceFormatter amount={price} className="text-sm text-shop_dark_green" />
      {price && discount ? (
        <>
          <PriceFormatter
            amount={price + (price * discount) / 100}
            className="text-sm text-shop_light_text line-through font-normal"
          />
        </>
      ) : null}
    </div>
  );
};

export default PriceView;
