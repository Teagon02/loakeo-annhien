"use client";
import React, { useState } from "react";
import { MY_ORDERS_QUERYResult } from "@/sanity.types";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { format } from "date-fns";
import PriceFormatter from "./PriceFormatter";
import { Eye } from "lucide-react";
import { TooltipContent } from "@/components/ui/tooltip";
import OrderDetailDialog from "./OrderDetailDialog";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[0] | null
  >(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOrderClick = (order: MY_ORDERS_QUERYResult[0]) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => {
            return (
              <Tooltip key={order?.orderNumber}>
                <TooltipTrigger asChild>
                  <TableRow
                    className="cursor-pointer hover:bg-gray-100 h-12"
                    onClick={() => handleOrderClick(order)}
                  >
                    <TableCell className="font-medium">
                      {order?.orderNumber}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {order?.orderDate
                        ? format(new Date(order.orderDate), "HH:mm dd/MM/yyyy ")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {order?.shippingAddress?.fullName ||
                        order?.shippingAddress?.phone ||
                        "Khách hàng"}
                    </TableCell>

                    <TableCell>
                      <PriceFormatter
                        amount={order?.totalPrice}
                        className="text-black font-medium"
                      />
                    </TableCell>
                    <TableCell>
                      {order?.status && (
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
                      )}
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      {order?.payosOrderCode && (
                        <p className="font-medium line-clamp-1">
                          {order?.payosOrderCode
                            ? order?.payosOrderCode
                            : "----"}
                        </p>
                      )}
                    </TableCell>
                    <TableCell
                      onClick={(event) => {
                        event.stopPropagation();
                        handleOrderClick(order);
                      }}
                      className="flex items-center justify-center group cursor-pointer w-[80px] min-w-[80px] sticky right-0 bg-white z-10"
                    >
                      <Eye
                        size={18}
                        className="group-hover:text-shop_light_green hoverEffect transition-colors sm:w-5 sm:h-5"
                      />
                    </TableCell>
                  </TableRow>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Xem chi tiết đơn hàng</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </TableBody>

      <OrderDetailDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
};

export default OrdersComponent;
