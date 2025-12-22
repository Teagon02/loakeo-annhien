"use client";
import useStore from "@/store";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Address } from "@/sanity.types";
import Container from "@/components/Container";
import NoAccess from "@/components/NoAccess";
import EmptyCart from "@/components/EmptyCart";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import AddToWishList from "@/components/AddToWishList";
import { toast } from "react-hot-toast";
import PriceFormatter from "@/components/PriceFormatter";
import QuantityButtons from "@/components/QuantityButtons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { client } from "@/sanity/lib/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AddressFormDialog from "@/components/AddressFormDialog";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

const CartPage = () => {
  const {
    deleteCartProduct,
    getTotalPrice,
    getItemCount,
    getSubTotalPrice,
    resetCart,
  } = useStore();
  const [loading, setLoading] = useState(false);
  const groupedItems = useStore((state) => state.getGroupedItems());
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const fetchAddresses = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const query = `*[_type == "address" && userId == $userId] | order(_createdAt desc)`;
      const data = await client.fetch(query, { userId: user.id });
      setAddresses(data);
      const defautAddress = data.find((address: Address) => address.isDefault);
      if (defautAddress) {
        setSelectedAddress(defautAddress);
      } else if (data.length > 0) {
        setSelectedAddress(data[0]);
      } else {
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isSignedIn && user) {
      fetchAddresses();
    }
  }, [isSignedIn, user, fetchAddresses]);

  const handleCheckout = async () => {
    if (!groupedItems?.length) {
      toast.error("Giỏ hàng trống, không thể thanh toán.");
      return;
    }

    if (!selectedAddress) {
      toast.error("Vui lòng chọn địa chỉ giao hàng trước khi thanh toán.");
      return;
    }

    setLoading(true);
    try {
      // gọi server action để tạo link thanh toán
      const checkoutUrl = await createCheckoutSession({
        items: groupedItems,
        address: selectedAddress,
        userId: user?.id as string,
        totalPrice: getTotalPrice(),
      });
      if (checkoutUrl) {
        window.location.href = checkoutUrl.url;
      } else {
        toast.error("Không thể khởi tạo thanh toán.");
      }
    } catch (error) {
      console.error("Error checkout session:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể khởi tạo thanh toán.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Render cart items (reusable for both signed in and guest)
  const renderCartItems = () => (
    <div className="lg:col-span-2 rounded-lg">
      <div className="border bg-white rounded-md">
        {groupedItems?.map(({ product }) => {
          const itemCount = getItemCount(product?._id ?? "");
          return (
            <div
              key={product?._id}
              className="border-b p-2.5 last:border-b-0 flex items-center justify-between gap-5"
            >
              <div className="flex flex-1 items-start gap-2 h-36 md:h-44">
                {/* Ảnh sản phẩm */}
                {product?.images && (
                  <Link
                    href={`/product/${product?.slug?.current}`}
                    className="border p-0.5 md:p-1 mr-2 rounded-md overflow-hidden group"
                  >
                    <Image
                      src={urlFor(product?.images[0])
                        .width(320)
                        .quality(85)
                        .format("webp")
                        .url()}
                      alt="Ảnh sản phẩm"
                      width={500}
                      height={500}
                      sizes="(max-width: 768px) 128px, 160px"
                      loading="lazy"
                      unoptimized
                      className="w-32 md:w-40 h-32 md:h-40 object-cover rounded-md group-hover:scale-105 hoverEffect"
                    />
                  </Link>
                )}
                {/* Tên sản phẩm */}
                <div className="h-full flex flex-1 flex-col justify-between py-1">
                  <div className="flex flex-col gap-0.5 md:gap-1.5">
                    <h2 className="text-base font-semibold line-clamp-1">
                      {product?.name}
                    </h2>
                    <p className="text-sm capitalize">
                      Danh mục:{" "}
                      <span className="font-semibold">
                        {product?.categories?.join(", ")}
                      </span>
                    </p>
                    <p className="text-sm capitalize">
                      Trạng thái:{" "}
                      <span className="font-semibold">{product?.status}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Thêm vào yêu thích - chỉ hiện khi đã đăng nhập */}
                    {isSignedIn && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <AddToWishList
                              product={product}
                              className="relative top-0 right-0"
                            />
                          </TooltipTrigger>
                          <TooltipContent className="font-semibold">
                            <p>Thêm vào yêu thích</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {/* Xoá khỏi giỏ hàng */}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Trash2
                            onClick={() => {
                              deleteCartProduct(product?._id as string);
                              toast.success("Sản phẩm đã xoá khỏi giỏ hàng");
                            }}
                            className="w-4 h-4 md:w-5 md:h-5 mr-1 text-gray-500 hover:text-red-600 hoverEffect"
                          />
                        </TooltipTrigger>
                        <TooltipContent className="font-semibold">
                          <p>Xoá khỏi giỏ hàng</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>

              {/* Giá sản phẩm */}
              <div className="flex flex-col items-start justify-between h-36 md:h-44 p-0.5 md:p-1">
                <PriceFormatter
                  amount={(product?.price as number) * itemCount}
                  className="text-lg font-semibold"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-gray-500 font-semibold">Kho:</span>
                    <span
                      className={`font-semibold ${
                        (product?.stock as number) === 0
                          ? "text-red-600"
                          : "text-shop_light_green"
                      }`}
                    >
                      {(product?.stock as number) > 0
                        ? product?.stock
                        : "Hết hàng"}
                    </span>
                  </div>
                  <QuantityButtons product={product} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Reset giỏ hàng */}
        <div className="my-5">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                className="font-semibold hover:scale-105 hoverEffect ml-2"
                variant="destructive"
                size="sm"
              >
                Reset giỏ hàng
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Bạn có chắc chắn muốn xoá tất cả sản phẩm khỏi giỏ hàng?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Hành động này không thể hoàn tác. Điều này sẽ xóa tất cả sản
                  phẩm khỏi giỏ hàng của bạn.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction onClick={resetCart}>Xoá</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );

  // Render order summary (reusable)
  const renderOrderSummary = (className?: string) => (
    <div className={className}>
      <h2 className="text-xl font-semibold mb-4">Tóm tắt đơn hàng</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Tạm tính: </span>
          <PriceFormatter amount={getSubTotalPrice()} />
        </div>
        <div className="flex items-center justify-between">
          <span>Giảm giá: </span>
          <PriceFormatter amount={getSubTotalPrice() - getTotalPrice()} />
        </div>
        <Separator />
        <div className="flex items-center justify-between font-semibold text-lg">
          <span>Tổng tiền: </span>
          <PriceFormatter
            amount={useStore.getState().getTotalPrice()}
            className="text-lg font-semibold text-black"
          />
        </div>
        <Button
          className="w-full rounded-full font-semibold -tracking-wide hoverEffect"
          size="lg"
          disabled={loading || !selectedAddress}
          onClick={handleCheckout}
        >
          {loading ? "Đang xử lý..." : "Thanh toán"}
        </Button>
      </div>
    </div>
  );

  // Render address section for signed in users
  const renderSignedInAddress = () => (
    <div className="bg-white rounded-md mt-5">
      <Card>
        <CardHeader>
          <CardTitle>Địa chỉ giao hàng</CardTitle>
        </CardHeader>
        <CardContent>
          {addresses && addresses.length > 0 ? (
            <RadioGroup
              defaultValue={
                addresses
                  ?.find((address) => address.isDefault)
                  ?._id?.toString() || addresses[0]?._id?.toString()
              }
              value={selectedAddress?._id?.toString()}
              onValueChange={(value) => {
                const addr = addresses.find((a) => a._id?.toString() === value);
                if (addr) setSelectedAddress(addr);
              }}
            >
              {addresses.map((address) => (
                <div
                  key={address._id}
                  onClick={() => setSelectedAddress(address)}
                  className={`flex items-center space-x-2 cursor-pointer ${selectedAddress?._id === address._id && "text-shop_dark_green"}`}
                >
                  <RadioGroupItem
                    value={address._id?.toString() || ""}
                    id={address._id?.toString() || ""}
                  />
                  <Label
                    htmlFor={address._id?.toString() || ""}
                    className="grid gap-1.5 flex-1 cursor-pointer"
                  >
                    <span>
                      {address?.fullName} - {address?.phone}
                    </span>
                    <span>
                      {address?.addressLine}, {address?.ward},{" "}
                      {address?.district}, {address?.province}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Chưa có địa chỉ. Vui lòng thêm địa chỉ mới.
            </p>
          )}
          <AddressFormDialog
            onAddressAdded={fetchAddresses}
            addresses={addresses}
          />
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="bg-gray-50 pb-52 md:pb-10">
      {isSignedIn ? (
        <Container>
          {groupedItems?.length ? (
            <>
              <div className="flex items-center gap-2 py-5">
                <ShoppingCart className="text-darkColor" />
                <Title>Giỏ hàng</Title>
              </div>
              <div className="grid lg:grid-cols-3 md:gap-8">
                {renderCartItems()}
                {/* Summary */}
                <div>
                  <div className="lg:col-span-1">
                    {/* Tóm tắt đơn hàng */}
                    <div className="hidden md:inline-block w-full bg-white p-6 rounded-lg border">
                      {renderOrderSummary()}
                    </div>
                    {/* Địa chỉ giao hàng */}
                    {renderSignedInAddress()}
                  </div>
                </div>
                {/* Tóm tắt đơn hàng cho mobile view */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white pt-2">
                  <div className="bg-white p-4 rounded-lg border mx-4">
                    {renderOrderSummary()}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <EmptyCart />
          )}
        </Container>
      ) : (
        <NoAccess />
      )}
    </div>
  );
};

export default CartPage;
