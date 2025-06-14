
import React, { useState, useEffect } from "react";

interface CouponFormProps {
  show: boolean;
  editing?: any;
  form: any;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onFormChange: (u: Partial<any>) => void;
}

const CouponForm: React.FC<CouponFormProps> = ({
  show,
  editing,
  form,
  onClose,
  onSubmit,
  onFormChange,
}) => {
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    setErrors({});
  }, [show, editing]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form
        className="bg-white p-6 rounded-xl min-w-[340px] max-w-[98vw] flex flex-col gap-5 shadow-lg"
        onSubmit={(e) => {
          setErrors({});
          if (!form.code) setErrors((er: any) => ({ ...er, code: "أدخل الكود" }));
          if (!form.discount_percent) setErrors((er: any) => ({ ...er, discount_percent: "أدخل نسبة الخصم" }));
          if (!form.end_date) setErrors((er: any) => ({ ...er, end_date: "تاريخ الانتهاء مطلوب" }));
          if (Object.keys(errors).length === 0) onSubmit(e);
          else e.preventDefault();
        }}
        dir="rtl"
      >
        <div className="flex justify-between items-center pb-2 border-b">
          <h3 className="text-xl font-bold">{editing ? "تعديل كوبون" : "إضافة كوبون"}</h3>
          <button type="button" onClick={onClose} className="font-bold text-gray-400 hover:text-gray-700 text-xl">&times;</button>
        </div>
        <div>
          <label className="block font-bold mb-1">كود الكوبون</label>
          <input
            type="text"
            value={form.code}
            onChange={e => onFormChange({ code: e.target.value.replace(/\s/g, '').toUpperCase() })}
            className="w-full border rounded px-3 py-2"
            maxLength={16}
            required
          />
          {errors.code && <div className="text-red-600 text-xs mt-1">{errors.code}</div>}
        </div>
        <div>
          <label className="block font-bold mb-1">نسبة الخصم (%)</label>
          <input
            type="number"
            value={form.discount_percent}
            onChange={e => onFormChange({ discount_percent: e.target.value })}
            min={1}
            max={100}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.discount_percent && <div className="text-red-600 text-xs mt-1">{errors.discount_percent}</div>}
        </div>
        <div>
          <label className="block font-bold mb-1">تاريخ البداية</label>
          <input
            type="date"
            value={form.start_date ?? ''}
            onChange={e => onFormChange({ start_date: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-bold mb-1">تاريخ الانتهاء</label>
          <input
            type="date"
            value={form.end_date ?? ''}
            onChange={e => onFormChange({ end_date: e.target.value })}
            className="w-full border rounded px-3 py-2"
            required
          />
          {errors.end_date && <div className="text-red-600 text-xs mt-1">{errors.end_date}</div>}
        </div>
        <div>
          <label className="block font-bold mb-1">الحد الأقصى للاستخدام</label>
          <input
            type="number"
            value={form.max_usage}
            onChange={e => onFormChange({ max_usage: e.target.value })}
            min={1}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-3 mt-2">
          <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold">{editing ? "تحديث" : "حفظ"}</button>
          <button type="button" className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg" onClick={onClose}>إلغاء</button>
        </div>
      </form>
    </div>
  );
};

export default CouponForm;
