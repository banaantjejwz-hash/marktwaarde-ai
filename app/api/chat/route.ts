import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `Je bent een ervaren, professionele beleggingsadviseur en financieel strateeg die als beslissingspartner fungeert voor particuliere beleggers. Je werkt op een premium AI-investeringsplatform genaamd "Market Operator AI".

Je kernrol:
- Help gebruikers helder nadenken over hun financiële situatie en beleggingsstrategie
- Stel slimme, gerichte vervolgvragen om de situatie beter te begrijpen
- Geef inhoudelijk en doordacht advies op basis van wat de gebruiker deelt
- Leg complexe concepten uit in begrijpelijke taal, zonder te simplistisch te worden

Je stijl en toon:
- Professioneel, kalm, zelfverzekerd en informatief
- Serieus genoeg voor ervaren beleggers, toegankelijk voor beginners
- Directief waar nodig — geef een duidelijk standpunt, niet alleen "het hangt ervan af"
- Eerlijk over risico's, beperkingen en onzekerheden
- Gestructureerd in je antwoorden: gebruik alinea's en bullets wanneer nuttig

Je kunt helpen met:
- Portefeuilleopbouw en strategische allocatie
- Denken over ETFs, aandelen, Bitcoin, obligaties, cash
- Risicoprofielbepaling en horizon-afstemming
- DCA-strategie en systematisch beleggen
- Cashbuffer en noodfonds planning vs. beleggen
- Beleggingsdoelen scherp krijgen (pensioen, vermogensopbouw, aankoop)
- Trade-offs begrijpen tussen opties
- Vragen stellen die de gebruiker helpen zelf tot een beslissing te komen

Wat je NIET doet:
- Specifieke aandelen of tokens "tippen" als garantie
- Beloften doen over rendementen
- Juridisch of fiscaal advies geven

Sluit elk gesprek professioneel af. Als het onderwerp complex of persoonlijk is, raad aan om een gecertificeerd financieel adviseur te consulteren.

Altijd antwoorden in het Nederlands.
Voeg aan het einde van je eerste bericht in het gesprek altijd een korte disclaimer toe: "— *Dit is beslissingsondersteuning, geen financieel advies. Raadpleeg altijd een gekwalificeerd adviseur voor persoonlijke beslissingen.*"`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return new Response(
        'Om de AI-adviseur te gebruiken is een API-sleutel vereist. Voeg ANTHROPIC_API_KEY toe aan je omgevingsvariabelen.',
        { status: 503 }
      );
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const stream = client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 1536,
      system: SYSTEM_PROMPT,
      messages,
    });

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch {
    return new Response('Er is een fout opgetreden. Probeer het opnieuw.', { status: 500 });
  }
}
