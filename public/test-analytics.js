/**
 * Script de test rapide pour Google Analytics
 *
 * Copier-coller ce script dans la console du navigateur
 * pour activer les analytics en développement
 */

// 1. Activer le consentement
console.log('🔧 Activation du consentement analytics...');
localStorage.setItem('cookie-consent', JSON.stringify({
  necessary: true,
  analytics: true,
  functional: true
}));

// 2. Mettre à jour le consent mode GA4
if (window.gtag) {
  window.gtag('consent', 'update', {
    analytics_storage: 'granted'
  });
  console.log('✅ Consent mode mis à jour: analytics_storage = granted');
} else {
  console.warn('⚠️ gtag non défini, rechargez la page');
}

// 3. Vérifier la configuration
console.log('📊 État actuel:');
console.log('  - Cookie consent:', JSON.parse(localStorage.getItem('cookie-consent')));
console.log('  - gtag défini:', typeof window.gtag !== 'undefined');
console.log('  - dataLayer:', window.dataLayer?.length || 0, 'événements');
console.log('  - Debug mode:', window.location.search.includes('debug_mode=true'));

// 4. Instructions
console.log('\n🎯 Prochaines étapes:');
console.log('  1. Rechargez la page si gtag n\'était pas défini');
console.log('  2. Effectuez vos actions de test (créer client, devis, etc.)');
console.log('  3. Vérifiez les événements dans la console: [GA4 Debug]');
console.log('  4. Vérifiez dans GA4 Admin → DebugView\n');
