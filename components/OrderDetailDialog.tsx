"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { format } from "date-fns";
import PriceFormatter from "./PriceFormatter";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Separator } from "./ui/separator";

type Order = MY_ORDERS_QUERYResult[0];

interface OrderDetailDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OrderDetailDialog = ({
  order,
  open,
  onOpenChange,
}: OrderDetailDialogProps) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Chi tiết đơn hàng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header */}
          <div className="text-center border-b pb-4">
            <h1 className="text-2xl font-bold mb-2">HÓA ĐƠN BÁN HÀNG</h1>
            <p className="text-gray-600">Mã đơn hàng: {order.orderNumber}</p>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="font-semibold text-lg mb-2">Thông tin đơn hàng</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span className="font-medium">
                    {order.orderDate
                      ? format(new Date(order.orderDate), "dd/MM/yyyy HH:mm")
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${order?.status === "pending" ? "bg-yellow-100 text-yellow-800" : order?.status === "paid" ? "bg-green-100 text-green-800" : order?.status === "shipped" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                  >
                    {order?.status === "pending"
                      ? "Chờ thanh toán"
                      : order?.status === "paid"
                        ? "Đã thanh toán"
                        : order?.status === "shipped"
                          ? "Đã gửi hàng"
                          : "Đã hủy"}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div>
                <h2 className="font-semibold text-lg mb-2">
                  Địa chỉ giao hàng
                </h2>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">
                    {order.shippingAddress.fullName}
                  </p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                  <p className="text-gray-600">
                    {order.shippingAddress.fullAddress ||
                      [
                        order.shippingAddress.address,
                        order.shippingAddress.ward,
                        order.shippingAddress.district,
                        order.shippingAddress.city,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Products List */}
          <div>
            <h2 className="font-semibold text-lg mb-4">Sản phẩm đã mua</h2>
            <div className="space-y-3">
              {order.products && order.products.length > 0 ? (
                order.products.map((item, index) => {
                  const productImage =
                    item.image ||
                    (item.product?.images && item.product.images[0]);
                  const productName =
                    item.name || item.product?.name || "Sản phẩm";
                  const productPrice = item.price || item.product?.price || 0;
                  const quantity = item.quantity || 1;
                  const itemTotal = productPrice * quantity;

                  return (
                    <div
                      key={item._key || index}
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-shop_light_bg flex items-center justify-center">
                        {productImage ? (
                          <Image
                            src={urlFor(productImage).url()}
                            alt={productName}
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <div className="text-gray-400 text-xs text-center p-2">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base mb-1">
                          {productName}
                        </h3>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm text-gray-600">
                            <span>Giá: </span>
                            <PriceFormatter amount={productPrice} />
                            <span className="ml-2">× {quantity}</span>
                          </div>
                          <div className="font-semibold">
                            <PriceFormatter amount={itemTotal} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Không có sản phẩm nào
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-end">
            <div className="text-right space-y-2">
              <div className="flex items-center gap-4 text-lg">
                <span className="font-semibold">Tổng tiền:</span>
                <PriceFormatter
                  amount={order.totalPrice}
                  className="text-xl font-bold text-shop_dark_green"
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
