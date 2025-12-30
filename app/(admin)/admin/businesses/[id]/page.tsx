import { getBusinessDetails } from "@/app/actions/admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function BusinessDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next.js 16 pattern: params is a Promise
  const { id } = await params;

  const result = await getBusinessDetails({ businessId: id });

  if (!result.success) {
    return (
      <div className="p-8">
        <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Retour
        </Link>
        <div className="text-red-600">
          Erreur : {result.error}
        </div>
      </div>
    );
  }

  const business = result.data;

  return (
    <div className="p-8">
      <Link href="/admin" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Retour
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-gray-600">{business.user.email}</p>
      </div>

      {/* Info section */}
      <div className="bg-white rounded-lg border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Informations</h2>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-gray-600">Nom :</span>
            <p className="font-medium">{business.name}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Email :</span>
            <p className="font-medium">{business.email || 'Non renseigné'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Téléphone :</span>
            <p className="font-medium">{business.phone || 'Non renseigné'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Adresse :</span>
            <p className="font-medium">{business.address || 'Non renseignée'}</p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Statut abonnement :</span>
            <p className="font-medium">
              <span className={`inline-block px-2 py-1 text-xs rounded ${
                business.subscriptionStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                business.subscriptionStatus === 'TRIAL' ? 'bg-orange-100 text-orange-800' :
                'bg-red-100 text-red-800'
              }`}>
                {business.subscriptionStatus}
              </span>
            </p>
          </div>
          <div>
            <span className="text-sm text-gray-600">Pro :</span>
            <p className="font-medium">{business.isPro ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-3xl font-bold">{business.clients.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Devis</p>
          <p className="text-3xl font-bold">{business.quotes.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Services</p>
          <p className="text-3xl font-bold">{business.services.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <p className="text-sm text-gray-600">Forfaits</p>
          <p className="text-3xl font-bold">{business.packages.length}</p>
        </div>
      </div>
    </div>
  );
}
