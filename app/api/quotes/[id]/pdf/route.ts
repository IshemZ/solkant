import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getQuote } from '@/app/actions/quotes'
import { renderToStream } from '@react-pdf/renderer'
import QuotePDF from '@/components/QuotePDF'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.businessId) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params
  const result = await getQuote(id)

  if (result.error || !result.data) {
    return NextResponse.json({ error: 'Devis introuvable' }, { status: 404 })
  }

  try {
    const pdfElement = QuotePDF({ quote: result.data })
    const stream = await renderToStream(pdfElement)

    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${result.data.quoteNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    )
  }
}
