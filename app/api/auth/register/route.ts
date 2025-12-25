import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateVerificationToken } from "@/app/actions/auth";

// Simple in-memory rate limiting (production: use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(
  identifier: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Rate limiting by IP
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    if (!rateLimit(ip, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Trop de tentatives. Réessayez dans 15 minutes." },
        { status: 429 }
      );
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user with Business in a transaction
    // ⚠️ emailVerified reste null jusqu'à validation du token
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: null, // Non vérifié initialement
        business: {
          create: {
            name: `Institut de ${name || "beauté"}`,
            email: email,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Générer token de vérification et envoyer email
    const verificationResult = await generateVerificationToken(user.id);

    if (!verificationResult.success) {
      // L'utilisateur est créé mais l'email n'a pas pu être envoyé
      console.error(
        "Échec envoi email vérification:",
        verificationResult.error
      );

      // On retourne quand même un succès car l'utilisateur existe
      // Il pourra redemander un email depuis /check-email
      return NextResponse.json(
        {
          user,
          message: "Compte créé. Veuillez vérifier votre email.",
          warning:
            "L'email de vérification n'a pas pu être envoyé. Vous pourrez le renvoyer depuis votre profil.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        user,
        message:
          "Compte créé avec succès ! Veuillez vérifier votre email pour activer votre compte.",
        trackSignUp: true, // Flag pour tracking GA4
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
