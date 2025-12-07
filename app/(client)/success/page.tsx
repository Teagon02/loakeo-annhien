"use client";

import Link from "next/link";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";
import { Title } from "@/components/ui/text";
import useStore from "@/store";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderCode = searchParams?.get("orderCode");
  const { resetCart } = useStore();
  const saveCartToServer = useStore((state) => state.saveCartToServer);

  useEffect(() => {
    if (!orderCode) return;
    resetCart();
    // Persist empty cart to server if user is logged in
    saveCartToServer();
  }, [orderCode, resetCart, saveCartToServer]);

  return (
    <Container className="py-20 flex flex-col gap-4 items-center text-center">
      <Title className="text-2xl">Thanh toán thành công</Title>
      {orderCode && (
        <p className="text-gray-600">
          Mã thanh toán PayOS của bạn: <strong>#{orderCode}</strong>
        </p>
      )}
      <p className="text-gray-600">
        Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng ngay khi nhận được
        thông tin thanh toán từ PayOS.
      </p>
      <div className="flex gap-3 mt-3">
        <Button asChild variant="secondary">
          <Link href="/shop">Tiếp tục mua sắm</Link>
        </Button>
        <Button asChild>
          <Link href="/cart">Về giỏ hàng</Link>
        </Button>
      </div>
    </Container>
  );
};

const PaymentSuccessPage = () => {
  return (
    <Suspense
      fallback={
        <Container className="py-20 flex flex-col gap-4 items-center text-center">
          <Title className="text-2xl">Thanh toán thành công</Title>
          <p className="text-gray-600">Đang tải...</p>
        </Container>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;
