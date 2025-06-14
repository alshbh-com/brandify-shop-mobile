
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: string;
  email: string;
  roles: string[];
};

const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(false);

  // احضر جميع المستخدمين من auth وuser_roles
  async function fetchUsers() {
    setLoading(true);
    // يجب وجود حسابات مستخدمين حتى تظهر هنا
    let { data: usersData, error } = await supabase.auth.admin.listUsers();
    if (error) { setLoading(false); return; }
    // جلب أدوار المستخدمين
    const { data: rolesData } = await supabase
      .from("user_roles")
      .select("*");
    const getRoles = (userId: string) =>
      rolesData
        ? rolesData.filter((r: any) => r.user_id === userId).map((r: any) => r.role)
        : [];

    setUsers(
      usersData?.users.map((u: any) => ({
        id: u.id,
        email: u.email || "بلا بريد",
        roles: getRoles(u.id),
      })) ?? []
    );
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function addMerchantRole(userId: string) {
    await supabase.from("user_roles").insert([
      { user_id: userId, role: "merchant" },
    ]);
    fetchUsers();
  }
  async function removeMerchantRole(userId: string) {
    await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", "merchant");
    fetchUsers();
  }

  return (
    <div>
      <h2 className="text-2xl mb-4 font-bold">إدارة المستخدمين والتجار</h2>
      {loading && <div>جاري التحميل...</div>}
      <div className="grid gap-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white flex justify-between items-center p-3 rounded-lg shadow-sm">
            <div>
              <div className="font-bold">{user.email}</div>
              <div>
                {user.roles.includes("merchant") ? (
                  <Badge className="bg-yellow-200 text-yellow-700 mr-2">تاجر</Badge>
                ) : (
                  <Badge className="bg-gray-200 mr-2">مستخدم عادي</Badge>
                )}
                {user.roles.length > 1
                  && user.roles.filter(r => r !== "merchant").map(r => (
                  <Badge key={r} className="bg-blue-200 text-blue-700 ml-1">{r}</Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              {user.roles.includes("merchant") ? (
                <Button variant="outline" className="bg-red-200 hover:bg-red-300 text-red-800"
                  onClick={() => removeMerchantRole(user.id)}>
                  إزالة التاجر
                </Button>
              ) : (
                <Button variant="outline" className="bg-green-200 hover:bg-green-300 text-green-800"
                  onClick={() => addMerchantRole(user.id)}>
                  إضافة كتاجر
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default AdminUsersTab;
