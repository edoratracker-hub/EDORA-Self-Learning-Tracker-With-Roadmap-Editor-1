import { redirect } from "next/navigation";

const AdminDashboardPage = () => {
  redirect("/dashboard/admin/home");
};

export default AdminDashboardPage;
