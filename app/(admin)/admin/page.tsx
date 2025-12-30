import { getAllBusinesses } from "@/app/actions/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

function getSubscriptionStatusClass(status: string): string {
  if (status === 'ACTIVE') {
    return 'bg-green-100 text-green-800';
  }
  if (status === 'TRIAL') {
    return 'bg-orange-100 text-orange-800';
  }
  return 'bg-red-100 text-red-800';
}

export default async function AdminDashboardPage() {
  const result = await getAllBusinesses();

  if (!result.success) {
    return (
      <div className="p-8">
        <div className="text-red-600">
          Erreur : {result.error}
        </div>
      </div>
    );
  }

  const businesses = result.data;

  // Calculate stats
  const stats = {
    total: businesses.length,
    active: businesses.filter(b => b.subscriptionStatus === 'ACTIVE').length,
    trial: businesses.filter(b => b.subscriptionStatus === 'TRIAL').length,
    canceled: businesses.filter(b => b.subscriptionStatus === 'CANCELED').length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Administration Solkant</h1>
        <p className="text-gray-600">Gestion des businesses et utilisateurs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Actifs</p>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Essais</p>
          <p className="text-3xl font-bold text-orange-600">{stats.trial}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Annulés</p>
          <p className="text-3xl font-bold text-red-600">{stats.canceled}</p>
        </div>
      </div>

      {/* Business List */}
      <div className="bg-white rounded-lg border">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Businesses</h2>
          <div className="space-y-4">
            {businesses.map((business) => (
              <Link
                key={business.id}
                href={`/admin/businesses/${business.id}`}
                className="block p-4 border rounded hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{business.name}</h3>
                    <p className="text-sm text-gray-600">{business.user.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs rounded ${getSubscriptionStatusClass(business.subscriptionStatus)}`}>
                      {business.subscriptionStatus}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      {business._count.clients} clients · {business._count.quotes} devis
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
