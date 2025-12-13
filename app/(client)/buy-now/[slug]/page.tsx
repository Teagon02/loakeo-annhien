"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import Container from "@/components/Container";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import sanityLoader from "@/lib/image-loader";
import PriceFormatter from "@/components/PriceFormatter";
import PriceView from "@/components/PriceView";
import GuestAddressForm from "@/components/GuestAddressForm";
import { Address } from "@/sanity.types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "react-hot-toast";
import { Minus, Plus, Zap, Eye } from "lucide-react";
import { Title } from "@/components/ui/text";
import Link from "next/link";
import { createCheckoutSession } from "@/actions/createCheckoutSession";

const BuyNowPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddress, setSelectedAddress] =
    useState<Partial<Address> | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        const query = `*[_type == "product" && slug.current == $slug] | order(name asc)[0] {
          ...,
          "categories": categories[]->title
        }`;
        const productData = await client.fetch(
          query,
          { slug },
          { next: { revalidate: 300 } } // Cache 5 phút cho product data
        );
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Không thể tải thông tin sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity < 1) return;
    if (product?.stock && newQuantity > product.stock) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }
    setQuantity(newQuantity);
  };

  const calculateTotal = () => {
    if (!product?.price) return 0;
    const basePrice = product.price;
    return basePrice * quantity;
  };

  const handleCheckout = async () => {
    if (!product) {
      toast.error("Sản phẩm không hợp lệ");
      return;
    }

    if (!selectedAddress) {
      toast.error("Vui lòng nhập thông tin giao hàng trước khi thanh toán.");
      return;
    }

    if (product.stock === 0) {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    setCheckoutLoading(true);
    try {
      const items = [
        {
          product: product,
          quantity: quantity,
        },
      ];

      // Thêm "(vãng lai)" vào tên khách hàng
      const addressWithGuestLabel = {
        ...selectedAddress,
        fullName: `${selectedAddress.fullName} (vãng lai)`,
      };

      const checkout = await createCheckoutSession({
        items,
        address: addressWithGuestLabel as Address,
        userId: null,
        totalPrice: calculateTotal(),
      });

      if (!checkout?.url) {
        throw new Error("Không thể tạo link thanh toán.");
      }

      window.location.href = checkout.url;
    } catch (error) {
      console.error("PayOS checkout error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Không thể khởi tạo thanh toán.";
      toast.error(errorMessage);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg">Đang tải thông tin sản phẩm...</p>
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-lg text-red-500">Không tìm thấy sản phẩm</p>
        </div>
      </Container>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="bg-gray-50 pb-10 min-h-screen">
      <Container>
        <div className="flex items-center gap-2 py-5">
          <Zap className="text-darkColor" />
          <Title>Mua ngay</Title>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Thông tin sản phẩm */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-5">
                  {/* Ảnh sản phẩm */}
                  {product.images && product.images.length > 0 && (
                    <div className="w-full md:w-48 h-48 border rounded-md overflow-hidden">
                      <Image
                        src={urlFor(product.images[0]).url()}
                        alt={product.name || "Sản phẩm"}
                        loader={sanityLoader}
                        width={200}
                        height={200}
                        sizes="(max-width: 768px) 100vw, 192px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Chi tiết sản phẩm */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-xl font-bold">{product.name}</h2>
                      <p className="text-sm text-gray-600 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <PriceView
                        price={product.price as number}
                        discount={product.discount as number}
                        className="text-lg font-bold"
                      />
                      <span
                        className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                          isOutOfStock
                            ? "bg-red-100 text-red-600"
                            : "text-green-600 bg-green-100"
                        }`}
                      >
                        {isOutOfStock ? "Hết hàng" : "Có sẵn"}
                      </span>
                    </div>

                    {/* Chọn số lượng */}
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">Số lượng:</span>
                      <div className="flex items-center gap-2 border rounded-md">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityChange(-1)}
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-semibold">
                          {quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8"
                          onClick={() => handleQuantityChange(1)}
                          disabled={
                            isOutOfStock ||
                            (product.stock ? quantity >= product.stock : false)
                          }
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {product.stock && (
                        <span className="text-sm text-gray-500">
                          (Còn {product.stock} sản phẩm)
                        </span>
                      )}
                    </div>

                    {/* Button xem chi tiết */}
                    <div className="pt-2">
                      <Link href={`/product/${slug}`}>
                        <Button variant="outline" className="w-full md:w-auto">
                          <Eye className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form địa chỉ & Tóm tắt */}
          <div className="space-y-5">
            {/* Tóm tắt đơn hàng */}
            <Card>
              <CardHeader>
                <CardTitle>Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Đơn giá:</span>
                  <PriceFormatter amount={product.price || 0} />
                </div>

                <div className="flex items-center justify-between">
                  <span>Số lượng:</span>
                  <span>{quantity}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>Tổng tiền:</span>
                  <PriceFormatter
                    amount={calculateTotal()}
                    className="text-lg font-semibold text-black"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form địa chỉ */}
            <GuestAddressForm
              onAddressSubmit={(address) => {
                setSelectedAddress(address);
              }}
              initialAddress={selectedAddress}
            />

            {/* Button thanh toán */}
            <Button
              className="w-full rounded-full font-semibold tracking-wide hoverEffect"
              size="lg"
              disabled={checkoutLoading || !selectedAddress || isOutOfStock}
              onClick={handleCheckout}
            >
              {checkoutLoading
                ? "Đang xử lý..."
                : isOutOfStock
                  ? "Hết hàng"
                  : "Thanh toán"}
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BuyNowPage;
