import React from "react";
import PriceFormatter from "./PriceFormatter";

interface Props {
  price: number;
  discount: number;
  className?: string;
}
const PriceView = ({ price, discount, className }: Props) => {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <PriceFormatter amount={price} className="text-shop_dark_green" />
      {price && discount ? (
        <>
          <PriceFormatter
            amount={price + (price * discount) / 100}
            className="text-shop_light_text line-through font-normal"
          />
        </>
      ) : null}
    </div>
  );
};

export default PriceView;
