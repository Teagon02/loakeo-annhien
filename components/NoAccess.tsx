import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Logo from "./Logo";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "./ui/button";

const NoAccess = ({
  details = "Đăng nhập để xem giỏ hàng và thanh toán. Đừng bỏ lỡ những sản phẩm yêu thích của bạn!",
}: {
  details?: string;
}) => {
  return (
    <div className="flex items-center justify-center py-12 md:py-32 bg-gray-100 p-4">
      <Card className="w-full max-w-md p-5">
        <CardHeader className="flex flex-col items-center gap-1">
          <Logo />
          <CardTitle className="text-2xl font-bold text-center">
            Chào mừng quay trở lại!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-medium text-center text-darkColor/80">{details}</p>
          <SignInButton mode="modal">
            <Button className="w-full" size="lg">
              Đăng nhập
            </Button>
          </SignInButton>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm text-muted-foreground text-center">
            Chưa có tài khoản?
          </div>
          <SignUpButton mode="modal">
            <Button className="w-full" variant="outline" size="lg">
              Đăng ký
            </Button>
          </SignUpButton>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NoAccess;
