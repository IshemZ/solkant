import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Not authenticated → login
  if (!session) {
    redirect("/login");
  }

  // Not super admin → redirect to normal dashboard
  if (session.user.role !== 'SUPER_ADMIN') {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
