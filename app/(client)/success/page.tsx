"use client";

import useStore from "@/store";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { motion } from "motion/react";
import {
  Check,
  Home,
  Package,
  ShoppingBag,
  XCircle,
  Loader2,
} from "lucide-react"; // Thêm icon XCircle
import Link from "next/link";

const SuccessContent = () => {
  const { resetCart } = useStore();
  const searchParams = useSearchParams();

  // --- 1. LẤY THAM SỐ TỪ PAYOS ---
  const orderCode = searchParams.get("orderCode");
  const status = searchParams.get("status"); // 'PAID', 'CANCELLED', 'PENDING'
  const code = searchParams.get("code"); // '00' là thành công
  const cancel = searchParams.get("cancel"); // 'true' nếu khách bấm hủy

  // Kiểm tra trạng thái có phải là thành công không
  const isSuccess = status === "PAID" || code === "00";
  const isCancelled = cancel === "true" || status === "CANCELLED";

  // --- 2. LOGIC RESET GIỎ HÀNG ---
  useEffect(() => {
    if (isSuccess) {
      resetCart();
    }
  }, [isSuccess, resetCart]);

  return (
    <div className="py-10 bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center mx-4 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl flex flex-col gap-8 shadow-2xl p-6 max-w-xl w-full text-center border border-gray-100"
      >
        {/* --- 3. HIỂN THỊ LOGIC UI THEO TRẠNG THÁI --- */}

        {/* TRƯỜNG HỢP 1: THÀNH CÔNG */}
        {isSuccess && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm"
            >
              <Check className="text-green-600 w-12 h-12" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900">
              Thanh toán thành công!
            </h1>
            <div className="space-y-2 text-left bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-700 text-center">
                Cảm ơn bạn đã mua hàng. Đơn hàng đang được xử lý và sẽ sớm được
                giao.
              </p>
              <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-2">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="text-black font-bold text-lg">
                  #{orderCode}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Trạng thái:</span>
                <span className="text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded text-sm">
                  Đã thanh toán
                </span>
              </div>
            </div>
          </>
        )}

        {/* TRƯỜNG HỢP 2: ĐÃ HỦY / THẤT BẠI */}
        {isCancelled && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm"
            >
              <XCircle className="text-red-600 w-12 h-12" />
            </motion.div>

            <h1 className="text-3xl font-bold text-red-600">
              Thanh toán bị hủy
            </h1>
            <div className="text-gray-700 mb-4">
              <p>
                Bạn đã hủy giao dịch hoặc có lỗi xảy ra trong quá trình thanh
                toán.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Đơn hàng #{orderCode} chưa được thanh toán.
              </p>
            </div>
          </>
        )}

        {/* TRƯỜNG HỢP 3: CHỜ XỬ LÝ (Load trang mà không rõ trạng thái) */}
        {!isSuccess && !isCancelled && (
          <div className="flex flex-col items-center justify-center py-10">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
            <p>Đang kiểm tra trạng thái giao dịch...</p>
          </div>
        )}

        {/* --- 4. CÁC NÚT ĐIỀU HƯỚNG --- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md group"
          >
            <Home className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Trang chủ
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-white text-black border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 shadow-sm"
          >
            <Package className="w-5 h-5 mr-2" />
            Đơn hàng
          </Link>

          <Link
            href="/shop"
            className="flex items-center justify-center px-4 py-3 font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-300 shadow-md group"
          >
            <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
            Mua tiếp
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

const SuccessPage = () => (
  <Suspense
    fallback={
      <div className="py-10 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    }
  >
    <SuccessContent />
  </Suspense>
);

export default SuccessPage;
