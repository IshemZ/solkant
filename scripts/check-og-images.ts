#!/usr/bin/env tsx

/**
 * Script de vérification des images OpenGraph
 *
 * Vérifie que toutes les images OpenGraph requises existent
 * et respectent les spécifications (dimensions, poids)
 *
 * Usage: npx tsx scripts/check-og-images.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OG_DIR = path.join(__dirname, '..', 'public', 'images', 'og');

// Images requises pour le SEO
const REQUIRED_IMAGES = [
  // Priorité 1 - Pages principales
  { file: 'home.png', page: 'Page d\'accueil', priority: 1 },
  { file: 'features.png', page: 'Page fonctionnalités', priority: 1 },
  { file: 'pricing.png', page: 'Page tarifs', priority: 1 },

  // Priorité 2 - Blog
  { file: 'blog.png', page: 'Page blog', priority: 2 },
  { file: 'article-devis.png', page: 'Article "Comment faire devis"', priority: 2 },
  { file: 'article-choisir-logiciel.png', page: 'Article "Choisir logiciel"', priority: 2 },
  { file: 'article-erreurs-devis.png', page: 'Article "Erreurs devis"', priority: 2 },
  { file: 'article-digitalisation.png', page: 'Article "Digitalisation"', priority: 2 },
  { file: 'article-gestion-clients.png', page: 'Article "Gestion clients"', priority: 2 },

  // Priorité 3 - Pages secondaires
  { file: 'contact.png', page: 'Page contact', priority: 3 },
];

// Spécifications techniques
const SPECS = {
  width: 1200,
  height: 630,
  maxSize: 300 * 1024, // 300 KB
};

interface ImageCheck {
  file: string;
  exists: boolean;
  size?: number;
  valid?: boolean;
  issues?: string[];
}

async function checkImage(filename: string): Promise<ImageCheck> {
  const filepath = path.join(OG_DIR, filename);
  const result: ImageCheck = {
    file: filename,
    exists: false,
    issues: [],
  };

  try {
    const stats = fs.statSync(filepath);
    result.exists = true;
    result.size = stats.size;

    // Vérifier la taille du fichier
    if (result.size > SPECS.maxSize) {
      result.issues!.push(
        `⚠️  Fichier trop lourd (${(result.size / 1024).toFixed(0)} KB > ${SPECS.maxSize / 1024} KB)`
      );
    }

    // Note: Pour vérifier les dimensions, il faudrait une lib comme 'image-size'
    // Pour l'instant on vérifie juste l'existence et le poids

    result.valid = result.issues!.length === 0;
  } catch (error) {
    result.exists = false;
  }

  return result;
}

async function main() {
  console.log('🔍 Vérification des images OpenGraph pour Solkant\n');
  console.log('📁 Dossier:', OG_DIR, '\n');

  // Grouper par priorité
  const byPriority = REQUIRED_IMAGES.reduce((acc, img) => {
    if (!acc[img.priority]) acc[img.priority] = [];
    acc[img.priority].push(img);
    return acc;
  }, {} as Record<number, typeof REQUIRED_IMAGES>);

  let totalMissing = 0;
  let totalIssues = 0;

  for (const priority of [1, 2, 3]) {
    console.log(`\n📊 PRIORITÉ ${priority}${priority === 1 ? ' (Critique - à créer en premier)' : ''}`);
    console.log('─'.repeat(70));

    const images = byPriority[priority] || [];

    for (const { file, page } of images) {
      const check = await checkImage(file);

      if (!check.exists) {
        console.log(`❌ ${file.padEnd(35)} → ${page}`);
        console.log(`   Manquant`);
        totalMissing++;
      } else if (!check.valid) {
        console.log(`⚠️  ${file.padEnd(35)} → ${page}`);
        check.issues?.forEach(issue => console.log(`   ${issue}`));
        totalIssues++;
      } else {
        console.log(`✅ ${file.padEnd(35)} → ${page} (${(check.size! / 1024).toFixed(0)} KB)`);
      }
    }
  }

  // Résumé
  console.log('\n' + '═'.repeat(70));
  console.log('\n📈 RÉSUMÉ\n');

  const totalImages = REQUIRED_IMAGES.length;
  const existingImages = totalImages - totalMissing;
  const validImages = existingImages - totalIssues;

  console.log(`Total d'images requises:     ${totalImages}`);
  console.log(`Images existantes:           ${existingImages} (${((existingImages / totalImages) * 100).toFixed(0)}%)`);
  console.log(`Images valides:              ${validImages} (${((validImages / totalImages) * 100).toFixed(0)}%)`);
  console.log(`Images manquantes:           ${totalMissing}`);
  console.log(`Images avec problèmes:       ${totalIssues}`);

  // Recommandations
  console.log('\n💡 RECOMMANDATIONS\n');

  if (totalMissing > 0) {
    console.log(`⚠️  ${totalMissing} image(s) manquante(s)`);
    console.log(`   → Consultez public/images/og/CREATION-GUIDE.md pour créer les images`);
    console.log(`   → Utilisez Canva (gratuit) avec template 1200x630px`);
    console.log(`   → Priorité : Créez d'abord les images de Priorité 1\n`);
  }

  if (totalIssues > 0) {
    console.log(`⚠️  ${totalIssues} image(s) avec problèmes`);
    console.log(`   → Compressez avec TinyPNG.com (https://tinypng.com)`);
    console.log(`   → Objectif : < 300 KB par image\n`);
  }

  if (totalMissing === 0 && totalIssues === 0) {
    console.log('🎉 Toutes les images OpenGraph sont présentes et valides !');
    console.log('   Testez-les avec Facebook Debugger et Twitter Card Validator\n');
  }

  // Code de sortie
  if (totalMissing > 0 || totalIssues > 0) {
    console.log('⚠️  Action requise : Créez/optimisez les images manquantes\n');
    process.exit(1);
  } else {
    process.exit(0);
  }
}

main().catch(console.error);
