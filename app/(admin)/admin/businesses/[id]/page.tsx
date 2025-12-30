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
        <h1 className="text-2xl font-bold">{business.name}</h1>
        <p className="text-gray-600">{business.user.email}</p>
      </div>

      {/* Info section */}
      <div className="bg-white p-6 rounded-lg border mb-8">
        <h2 className="text-xl font-bold mb-4">Informations</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-medium">{business.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{business.email || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Téléphone</p>
            <p className="font-medium">{business.phone || 'Non renseigné'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Adresse</p>
            <p className="font-medium">{business.address || 'Non renseignée'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Statut abonnement</p>
            <p className="font-medium">{business.subscriptionStatus}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pro</p>
            <p className="font-medium">{business.isPro ? 'Oui' : 'Non'}</p>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Clients</p>
          <p className="text-2xl font-bold">{business.clients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Devis</p>
          <p className="text-2xl font-bold">{business.quotes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Services</p>
          <p className="text-2xl font-bold">{business.services.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <p className="text-sm text-gray-600">Forfaits</p>
          <p className="text-2xl font-bold">{business.packages.length}</p>
        </div>
      </div>
    </div>
  );
}
