import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getMyOrders } from "@/sanity/queries";
import Container from "@/components/Container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableHead } from "@/components/ui/table";
import { TableHeader, TableRow } from "@/components/ui/table";
import OrdersComponent from "@/components/OrdersComponent";
import { ScrollBar } from "@/components/ui/scroll-area";

const OrdersPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }
  const orders = await getMyOrders(userId);
  console.log("orders", orders);
  return (
    <div>
      <Container className="py-10">
        {orders && orders.length > 0 ? (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Đơn hàng của bạn</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] md:w-auto">
                        Mã đơn hàng
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Ngày đặt
                      </TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Tổng tiền</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-center w-[80px] min-w-[80px]">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <OrdersComponent orders={orders} />
                </Table>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <FileX className="h-24 w-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Không có đơn hàng nào
            </h2>
            <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
              Có vẻ như bạn chưa đặt đơn hàng nào. Bắt đầu mua sắm để xem đơn
              hàng của bạn ở đây!
            </p>
            <Button asChild className="mt-6">
              <Link href="/shop">Xem sản phẩm</Link>
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
};

export default OrdersPage;
