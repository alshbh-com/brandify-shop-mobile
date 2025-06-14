
import React from "react";
import { Badge } from "@/components/ui/badge";

interface Coupon {
  id: string;
  code: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  max_usage: number;
  usage_count: number;
  is_active: boolean;
  created_at: string;
}
interface AdminCouponsTabProps {
  coupons: Coupon[];
  onAddCoupon: () => void;
  onEditCoupon: (coupon: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
}

const AdminCouponsTab: React.FC<AdminCouponsTabProps> = ({
  coupons,
  onAddCoupon,
  onEditCoupon,
  onDeleteCoupon,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">الكوبونات</h2>
        <button
          className="bg-blue-600 text-white rounded-lg px-5 py-2 font-bold"
          onClick={onAddCoupon}
        >
          + إضافة كوبون
        </button>
      </div>
      <div className="grid gap-3">
        {coupons.length === 0 && (
          <div className="p-5 text-center text-gray-500">لا توجد كوبونات حتى الآن.</div>
        )}
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white p-4 rounded-lg flex justify-between items-center shadow-sm border">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xl">
                <Badge className="bg-yellow-200 text-gray-700 rounded px-4 py-1">{coupon.code}</Badge>
              </span>
              <span>
                خصم: <b>{coupon.discount_percent}%</b>
                {" | "}
                الصلاحية: من <b dir="ltr">{coupon.start_date.slice(0,10)}</b> إلى <b dir="ltr">{coupon.end_date.slice(0,10)}</b>
              </span>
              <span>
                الاستخدام: {coupon.usage_count}/{coupon.max_usage ?? 1} &nbsp;
                الحالة: <Badge className={coupon.is_active ? "bg-green-200 text-green-600" : "bg-gray-200 text-gray-600"}>{coupon.is_active ? "مفعل" : "غير مفعل"}</Badge>
              </span>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-yellow-500 rounded-lg px-3 py-1 text-white"
                onClick={() => onEditCoupon(coupon)}
              >تعديل</button>
              <button
                className="bg-red-500 rounded-lg px-3 py-1 text-white"
                onClick={() => onDeleteCoupon(coupon.id)}
              >حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCouponsTab;
