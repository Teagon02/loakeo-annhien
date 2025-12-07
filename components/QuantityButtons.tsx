import React from "react";
import useStore from "@/store";
import { Product } from "@/sanity.types";
import { Button } from "./ui/button";
import { Minus } from "lucide-react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

interface Props {
  product: Product | null | undefined;
  className?: string;
}

const QuantityButtons = ({ product, className }: Props) => {
  const { addItem, removeItem, getItemCount } = useStore();
  const itemCount = getItemCount(product?._id as string);
  const isOutOfStock = product?.stock === 0;

  const handleRemoveProduct = () => {
    removeItem(product?._id as string);
    if (itemCount > 1) {
      toast.success("Giảm số lượng thành công");
    } else {
      toast.success(
        `${product?.name?.substring(0, 12)}... đã được xóa khỏi giỏ hàng`
      );
    }
  };

  const handleAddToCart = () => {
    if ((product?.stock as number) > itemCount) {
      addItem(product as Product);
      toast.success("Tăng số lượng thành công");
    } else {
      toast.error("Không thể thêm vì sản phẩm đã hết hàng");
    }
  };

  return (
    <div className={cn("flex items-center gap-1 pb-1 text-base", className)}>
      {/* Giảm sản phẩm */}
      <Button
        onClick={handleRemoveProduct}
        variant="outline"
        size="icon"
        disabled={itemCount === 0 || isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Minus />
      </Button>
      <span className="text-sm font-semibold w-6 text-center text-darkColor">
        {itemCount}
      </span>
      {/* Tăng sản phẩm */}
      <Button
        onClick={handleAddToCart}
        variant="outline"
        size="icon"
        disabled={isOutOfStock}
        className="w-6 h-6 border hover:bg-shop_dark_green/20 hoverEffect"
      >
        <Plus />
      </Button>
    </div>
  );
};

export default QuantityButtons;
