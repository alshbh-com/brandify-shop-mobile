
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  merchantStatus?: string;
  whatsappNumber?: string;
};

const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  // احضر جميع المستخدمين من auth وuser_roles وprofiles
  async function fetchUsers() {
    setLoading(true);
    try {
      // جلب المستخدمين من قاعدة البيانات
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");

      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        setLoading(false);
        return;
      }

      // جلب أدوار المستخدمين
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("*");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      }

      const getRoles = (userId: string) =>
        rolesData
          ? rolesData.filter((r: any) => r.user_id === userId).map((r: any) => r.role)
          : [];

      setUsers(
        profilesData?.map((profile: any) => ({
          id: profile.id,
          email: profile.id, // سنستخدم ID كبديل للإيميل مؤقتاً
          name: profile.name,
          roles: getRoles(profile.id),
          merchantStatus: profile.merchant_status,
          whatsappNumber: profile.whatsapp_number,
        })) ?? []
      );
    } catch (error) {
      console.error("Error in fetchUsers:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  async function addMerchantRole(userId: string) {
    try {
      await supabase.from("user_roles").upsert([
        { user_id: userId, role: "merchant" },
      ]);
      
      // تحديث حالة التاجر في الجدول profiles
      await supabase.from("profiles")
        .update({ merchant_status: "approved" })
        .eq("id", userId);
      
      fetchUsers();
    } catch (error) {
      console.error("Error adding merchant role:", error);
    }
  }

  async function removeMerchantRole(userId: string) {
    try {
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "merchant");
      
      // تحديث حالة التاجر في الجدول profiles
      await supabase.from("profiles")
        .update({ merchant_status: "rejected" })
        .eq("id", userId);
      
      fetchUsers();
    } catch (error) {
      console.error("Error removing merchant role:", error);
    }
  }

  async function approveMerchant(userId: string) {
    try {
      await supabase.from("profiles")
        .update({ merchant_status: "approved" })
        .eq("id", userId);
      
      // إضافة دور التاجر إذا لم يكن موجوداً
      await supabase.from("user_roles").upsert([
        { user_id: userId, role: "merchant" },
      ]);
      
      fetchUsers();
    } catch (error) {
      console.error("Error approving merchant:", error);
    }
  }

  async function rejectMerchant(userId: string) {
    try {
      await supabase.from("profiles")
        .update({ merchant_status: "rejected" })
        .eq("id", userId);
      
      fetchUsers();
    } catch (error) {
      console.error("Error rejecting merchant:", error);
    }
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold">إدارة المستخدمين والتجار</h2>
      {loading && <div>جاري التحميل...</div>}
      <div className="grid gap-3">
        {users.length === 0 && !loading && (
          <div className="p-5 text-center text-gray-500">لا توجد مستخدمين مسجلين حتى الآن.</div>
        )}
        {users.map((user) => (
          <div key={user.id} className="bg-white flex justify-between items-center p-3 rounded-lg shadow-sm border">
            <div>
              <div className="font-bold">{user.name}</div>
              <div className="text-sm text-gray-600">{user.id}</div>
              {user.whatsappNumber && (
                <div className="text-sm text-gray-600">واتساب: {user.whatsappNumber}</div>
              )}
              <div className="mt-2">
                {user.roles.includes("merchant") ? (
                  <Badge className="bg-yellow-200 text-yellow-700 mr-2">تاجر</Badge>
                ) : (
                  <Badge className="bg-gray-200 mr-2">مستخدم عادي</Badge>
                )}
                {user.merchantStatus === "pending" && (
                  <Badge className="bg-orange-200 text-orange-700 mr-2">في انتظار الموافقة</Badge>
                )}
                {user.merchantStatus === "approved" && (
                  <Badge className="bg-green-200 text-green-700 mr-2">تاجر معتمد</Badge>
                )}
                {user.merchantStatus === "rejected" && (
                  <Badge className="bg-red-200 text-red-700 mr-2">مرفوض</Badge>
                )}
                {user.roles.filter(r => r !== "merchant" && r !== "user").map(r => (
                  <Badge key={r} className="bg-blue-200 text-blue-700 ml-1">{r}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2 flex-col">
              {user.merchantStatus === "pending" && (
                <>
                  <Button 
                    variant="outline" 
                    className="bg-green-200 hover:bg-green-300 text-green-800"
                    onClick={() => approveMerchant(user.id)}
                  >
                    موافقة على التاجر
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-red-200 hover:bg-red-300 text-red-800"
                    onClick={() => rejectMerchant(user.id)}
                  >
                    رفض التاجر
                  </Button>
                </>
              )}
              {user.roles.includes("merchant") ? (
                <Button 
                  variant="outline" 
                  className="bg-red-200 hover:bg-red-300 text-red-800"
                  onClick={() => removeMerchantRole(user.id)}
                >
                  إزالة التاجر
                </Button>
              ) : (
                !user.merchantStatus && (
                  <Button 
                    variant="outline" 
                    className="bg-green-200 hover:bg-green-300 text-green-800"
                    onClick={() => addMerchantRole(user.id)}
                  >
                    إضافة كتاجر
                  </Button>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminUsersTab;
