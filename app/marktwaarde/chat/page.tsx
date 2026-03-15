'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Knowledge base ────────────────────────────────────────────────────────────

interface KbEntry {
  keywords: string[];
  response: string;
}

const DISCLAIMER =
  '\n\n— *Dit is beslissingsondersteuning, geen financieel advies. Raadpleeg een gecertificeerd adviseur voor persoonlijke beslissingen.*';

const KB: KbEntry[] = [
  // ── Maandelijks bedrag / verdeling ────────────────────────────────────────
  {
    keywords: [
      '500', 'maandelijks', 'per maand', 'verdeling', 'hoeveel beleggen',
      'allocat', 'verdelen', 'spreiden over',
    ],
    response:
      `**Een vaste maandelijkse inleg is de slimste manier om te beginnen.**\n\nEen verstandige verdeling voor een beginner:\n\n**70% — Wereldindex ETF (bijv. VWCE of IWDA)**\nBreed gespreide basis. Je belegt in duizenden bedrijven wereldwijd in één product. Dit is je ruggengraat.\n\n**20% — Aanvullend naar keuze (optioneel)**\nBijvoorbeeld een Europa-ETF, technologiefonds of S&P 500 als je een extra mening wilt maken.\n\n**10% — Speculatief (Bitcoin of losse aandelen)**\nAlleen met geld dat je volledig kunt missen. Hoog risico, hoog potentieel.\n\n**Praktisch advies:** Zet elke maand op een vaste datum automatisch je inleg over naar je broker. Dit heet dollar-cost averaging — je koopt soms duur en soms goedkoop, maar over tijd middel je een gezond aankoopprijs.\n\n**Belangrijk eerst:** Heb je al een noodfonds van 3–6 maanden vaste lasten? Zorg daar eerst voor. Dat is geen verlies — dat is fundament.`,
  },

  // ── Noodfonds ─────────────────────────────────────────────────────────────
  {
    keywords: [
      'noodfonds', 'buffer', 'spaargeld', 'eerst sparen', 'noodreserve',
      'nood fonds', 'cashbuffer', 'liquide',
    ],
    response:
      `**Het noodfonds gaat altijd voor beleggen.** Dit is geen voorzichtigheid — dit is rationeel.\n\n**Waarom?**\nAls je belegt zonder buffer en je auto kapot gaat, word je ziek of verlies je tijdelijk inkomen, dan ben je gedwongen te verkopen. Misschien op het slechtste moment. Dat vernietigt rendementen.\n\n**Hoe groot?**\nMinimaal **3 maanden vaste lasten** — huur, boodschappen, verzekeringen, abonnementen. Voor mensen met een onregelmatig inkomen of een eigen bedrijf: liever 6 maanden.\n\n**Waar bewaar je het?**\nNiet in aandelen. Niet in crypto. Op een gewone spaarrekening of deposito met direct opvraagbaar saldo. Het hoeft niet veel rente te geven — het moet er gewoon zijn als je het nodig hebt.\n\n**En daarna?**\nZodra je buffer er is, kun je maandelijks gaan beleggen zonder emotionele druk. Je weet: wat ik inleg, dat is geld dat ik 5–10 jaar niet nodig heb. Dat maakt betere beslissingen.`,
  },

  // ── DCA ───────────────────────────────────────────────────────────────────
  {
    keywords: [
      'dollar-cost', 'dollar cost', 'dca', 'gemiddeld', 'periodiek', 'automatisch',
      'elke maand kopen', 'vast moment', 'systematisch',
    ],
    response:
      `**Dollar-cost averaging (DCA) is de krachtigste gewoonte voor particuliere beleggers.**\n\n**Hoe werkt het?**\nJe belegt elke maand een vast bedrag — ongeacht of de markt omhoog of omlaag staat. Als de koers laag is, koop je meer aandelen voor hetzelfde geld. Als de koers hoog is, koop je minder.\n\n**Het resultaat:** Je aankoopprijs is het gemiddelde over de tijd. Je hebt nooit alles op het hoogtepunt gekocht. Je hoeft niet te timen — en timing verliezen de meeste beleggers sowieso.\n\n**Wanneer is het slim?**\n- Altijd, als je voor de lange termijn belegt\n- Zeker in volatiele markten (zoals Bitcoin of tech)\n- Als je emotioneel gevoelig bent voor marktbewegingen\n\n**Wanneer is het minder optimaal?**\nAls je een groot bedrag ineens hebt en de markt historisch laag staat, is lump sum soms beter. Maar de meeste mensen hebben geen groot bedrag én kunnen niet betrouwbaar het "laagpunt" herkennen. DCA wint in de praktijk.\n\n**Praktisch:** Koppel een automatische overboeking aan je broker op de 1e of 15e van de maand. Dan hoef je er niet meer over na te denken.`,
  },

  // ── Risico vs volatiliteit ─────────────────────────────────────────────────
  {
    keywords: [
      'risico', 'volatiliteit', 'volatiel', 'verschil risico', 'risico volatiliteit',
      'koersschommeling', 'verlies', 'drawdown',
    ],
    response:
      `**Risico en volatiliteit zijn niet hetzelfde — en dat onderscheid is cruciaal.**\n\n**Volatiliteit** = hoeveel de koers beweegt. Bitcoin is zeer volatiel: min 30% in een maand is normaal. Dat voelt pijnlijk, maar is niet per se gevaarlijk als je horizon lang genoeg is.\n\n**Risico** = de kans dat je permanent vermogen verliest. Een aandeel van een slecht bedrijf kan 80% dalen en nooit meer herstellen. Dat is écht risico — niet de dagelijkse koersschommeling.\n\n**Voorbeelden:**\n- Een wereldindex ETF is volatiel, maar het structurele risico is laag — de wereldeconomie groeit op lange termijn\n- Een individueel aandeel van een klein bedrijf kan weinig volatiel zijn maar enorm riskant\n\n**Jouw risico als belegger hangt af van:**\n1. Je **tijdshorizon** — hoe langer, hoe meer volatiliteit je aankunt\n2. Je **psychologie** — kun jij -30% op je scherm zien zonder te verkopen?\n3. Je **financiële situatie** — heb je dat geld over 2 jaar nodig, of over 20 jaar?\n\n**Praktische regel:** Volatiliteit is je vriend als je een lange horizon hebt. Risico minimaliseer je door breed te spreiden en niet te speculeren met geld dat je nodig hebt.`,
  },

  // ── Eerste portefeuille ────────────────────────────────────────────────────
  {
    keywords: [
      'eerste portefeuille', 'beginnen met beleggen', 'hoe begin', 'opbouwen',
      'starten', 'beginner', 'voor het eerst', 'nooit belegd',
    ],
    response:
      `**De beste portefeuille voor een beginner is eenvoudig — en dat is een feature, geen bug.**\n\n**Stap 1: Noodfonds**\n3–6 maanden vaste lasten op een spaarrekening. Doe dit eerst.\n\n**Stap 2: Broker kiezen**\nPopulaire opties voor Nederlanders: DeGiro, Saxo Bank, IBKR, of via je bank. Let op: kosten, aanbod ETFs, en of DEGIRO VWCE aanbiedt. Vergelijk transactiekosten.\n\n**Stap 3: Start simpel**\nEén product: **VWCE** (Vanguard FTSE All-World ETF). Dit is een ETF die belegt in ~3.700 bedrijven wereldwijd. Meer spreiding is bijna niet mogelijk.\n\n**Stap 4: Automatiseer**\nZet elke maand een vast bedrag in. Kijk niet elke dag naar de koers. Wacht.\n\n**Veelgemaakte fouten bij beginners:**\n- Te veel producten kopen (5+ ETFs met overlap)\n- Proberen te timen ("ik wacht tot de markt daalt")\n- Te vroeg verkopen bij de eerste correctie\n- Vergeten het noodfonds op te bouwen\n\n**De simpele waarheid:** 80% van actieve beleggers doet het slechter dan een simpele wereldindex op de lange termijn. Eenvoud wint.`,
  },

  // ── Bitcoin vs ETF ─────────────────────────────────────────────────────────
  {
    keywords: [
      'bitcoin vs etf', 'bitcoin of etf', 'crypto of etf', 'past bitcoin',
      'moet ik bitcoin', 'bitcoin kopen', 'bitcoin beginners',
    ],
    response:
      `**Bitcoin en ETFs dienen een ander doel in je portefeuille.**\n\n**ETFs (bijv. VWCE):**\n- Spreiding over duizenden bedrijven\n- Lage kosten, weinig onderhoud\n- Historisch gemiddeld 7–10% per jaar (niet gegarandeerd)\n- Ruggengraat van je portefeuille\n\n**Bitcoin:**\n- Speculatief, asymmetrisch rendementsprofiel\n- Extreem volatiel: -50% in een jaar is niet uitzonderlijk\n- Geen cashflow, geen winst — waarde is gedreven door vraag en vertrouwen\n- Sterk gecorreleerd met risicobereidheid in de markt\n\n**Mijn perspectief:**\nEen beginner bouwt eerst zijn ETF-basis op. Als dat er staat, kun je 5–10% van je portefeuille in Bitcoin stoppen als je er in gelooft — met geld dat je volledig kunt missen.\n\n**Signaal dat je nog niet klaar bent voor Bitcoin:**\n- Je hebt geen noodfonds\n- Je hebt nog geen basis ETF-portefeuille\n- Je zou panisch verkopen bij -40%\n\n**Pas op voor:** mensen die zeggen "Bitcoin is de toekomst dus ik doe alles erin." Dat is geen strategie, dat is gokken.`,
  },

  // ── ETF uitleg ────────────────────────────────────────────────────────────
  {
    keywords: [
      'wat is een etf', 'etf uitleg', 'hoe werkt etf', 'indexfonds',
      'trackers', 'wat zijn etfs', 'etf kopen',
    ],
    response:
      `**Een ETF (Exchange Traded Fund) is een mandje van aandelen dat je als één product kunt kopen.**\n\n**Hoe werkt het?**\nEen ETF volgt een index — bijvoorbeeld de S&P 500 (500 grootste Amerikaanse bedrijven) of FTSE All-World (3.700+ bedrijven wereldwijd). Als die index stijgt, stijgt jouw ETF. Als die daalt, daalt jouw ETF.\n\n**Waarom is het populair?**\n- **Spreiding:** Eén aankoop = duizenden bedrijven\n- **Goedkoop:** Kosten van 0,07–0,22% per jaar (veel minder dan een beleggingsfonds)\n- **Transparant:** Je weet precies wat erin zit\n- **Liquide:** Je kunt het elke dag kopen en verkopen\n\n**Bekende ETFs voor beginners:**\n- **VWCE** — Vanguard FTSE All-World, wereldwijd gespreide basis\n- **IWDA** — iShares MSCI World, vergelijkbaar (geen kleine markten)\n- **CSPX** — iShares S&P 500, alleen VS\n\n**Accumulating vs Distributing:**\nAccumulating (VWCE) herbeleegt dividenden automatisch — fiscaal vaak gunstiger in Nederland. Distributing keert dividenden uit als cash.\n\n**Waar koop je ze?**\nVia een broker: DEGIRO, Saxo, IBKR. Let op dat de ETF op een Europese beurs staat (Euronext Amsterdam, Xetra) voor toegankelijkheid en fiscaal gemak.`,
  },

  // ── VWCE / Wereldindex / S&P 500 ──────────────────────────────────────────
  {
    keywords: [
      'vwce', 'iwda', 's&p 500', 'sp500', 'sp 500', 'wereldindex',
      'msci world', 'ftse all-world', 'wereldwijde spreiding', 'welk etf',
    ],
    response:
      `**VWCE vs IWDA vs S&P 500 — wat kies je?**\n\n**VWCE (Vanguard FTSE All-World Acc)**\n~3.700 bedrijven, inclusief opkomende markten (China, India, Brazilië). Kosten: 0,22%/jaar. Meest complete werelddekking. Standaard keuze voor wie echt wil spreiden.\n\n**IWDA (iShares MSCI World)**\n~1.400 bedrijven, alleen ontwikkelde markten (VS, Europa, Japan). Kosten: 0,20%/jaar. Vergelijkbaar rendement historisch, maar minder blootstelling aan groeimarkten.\n\n**CSPX / SXR8 (S&P 500)**\n500 grootste Amerikaanse bedrijven. ~0,07%/jaar. Historisch het best presterende, maar 100% afhankelijk van de VS. Minder geografische spreiding.\n\n**Wat kiezen?**\n- Wil je maximale spreiding wereldwijd → **VWCE**\n- Wil je alleen ontwikkelde markten → **IWDA**\n- Wil je bewust meer VS exposure → **S&P 500**\n\n**Opmerking:** Er is veel overlap. VWCE bevat ~65% VS via de weging. Je hoeft niet alledrie te hebben — één solide keuze is beter dan drie overlappende producten.\n\n**In Nederland populairste keuze:** VWCE via DEGIRO of IBKR.`,
  },

  // ── Belasting / Box 3 ──────────────────────────────────────────────────────
  {
    keywords: [
      'belasting', 'box 3', 'fiscaal', 'belastingdienst', 'aangifte',
      'vermogensrendementsheffing', 'belast', 'fiscale',
    ],
    response:
      `**Beleggen in Nederland en belasting — de basis.**\n\n**Box 3: Vermogensrendementsheffing**\nJe beleggingen vallen in Box 3 van de inkomstenbelasting. Je betaalt belasting over een fictief rendement — niet over je werkelijk behaalde rendement.\n\n**Heffingsvrij vermogen (2025/2026):**\nDe eerste ~€57.000 per persoon is vrij van Box 3-heffing (controleer actueel bedrag via Belastingdienst.nl). Heb je een fiscaal partner? Dan is het ~€114.000 gezamenlijk vrijgesteld.\n\n**Praktisch:**\nBen je beginner met een relatief kleine portefeuille, dan valt je belastingdruk mee. Pas bij grotere vermogens wordt Box 3 een significante factor.\n\n**Pensioenrekening (beleggerspensioenen):**\nSommige brokers bieden een lijfrente- of bankspaarrekening. Inleg is aftrekbaar in Box 1, groei is belastingvrij — maar je kunt er niet voor je pensioen bij. Interessant als je nu in een hoge belastingschijf zit.\n\n**Wat ik niet kan doen:**\nConcreet fiscaal advies geven. De wet verandert regelmatig (Box 3 ligt onder druk door rechtszaken). Raadpleeg een belastingadviseur of gebruik de Belastingdienst-tool als je twijfelt over je aangifte.`,
  },

  // ── Rendement / hoeveel winst verwachten ──────────────────────────────────
  {
    keywords: [
      'rendement', 'hoeveel winst', 'verwacht rendement', 'gemiddeld rendement',
      'hoeveel procent', 'historisch rendement', 'hoeveel kan ik verdienen',
      'realistic', 'realistisch',
    ],
    response:
      `**Realistische rendementsverwachtingen — wat historisch klopt.**\n\n**Wereldindex ETF (bijv. VWCE):**\nHistorisch gemiddeld ~7–10% per jaar nominaal, ~5–7% gecorrigeerd voor inflatie. Maar dit is een gemiddelde over tientallen jaren — individuele jaren variëren enorm. -30% in een jaar is normaal. +25% ook.\n\n**S&P 500 (VS):**\nHistorisch ~10–11% per jaar nominaal over de afgelopen 50 jaar. Dit is deels te danken aan de sterke positie van de VS — het is geen garantie voor de toekomst.\n\n**Bitcoin:**\nHistorisch extreem hoge rendementen, maar met extreme neergang-perioden. Van $69.000 naar $16.000 in één jaar (2022). Niemand weet wat de toekomst brengt.\n\n**Wat je NIET mag verwachten:**\n- Gegarandeerde rendementen\n- Elk jaar positief\n- Dat het altijd zo doorgaat als het verleden\n\n**Samengesteld rendement werkt krachtig:**\n€10.000 met 7% per jaar → na 10 jaar ~€19.700 → na 20 jaar ~€38.700 → na 30 jaar ~€76.100. Tijd is je krachtigste instrument.`,
  },

  // ── Wanneer verkopen ───────────────────────────────────────────────────────
  {
    keywords: [
      'wanneer verkopen', 'uitstappen', 'stop-loss', 'verkopen', 'winst nemen',
      'verlies pakken', 'moment verkopen', 'rebalancen', 'rebalanceren',
    ],
    response:
      `**Wanneer verkopen — de rationele aanpak.**\n\n**Goede redenen om te verkopen:**\n- Je tijdshorizon is bereikt (je hebt het geld daadwerkelijk nodig)\n- Je rebalanceert je portefeuille (bijv. Bitcoin groeide naar 25% en je wilt terug naar 10%)\n- Je fundamentele overtuiging over een product is veranderd (niet de prijs — de overtuiging)\n- Je noodfonds is aangesproken en je hebt liquiditeit nodig\n\n**Slechte redenen om te verkopen:**\n- Angst omdat de koers daalt\n- Je hebt nu al 20% verlies en "wil voorkomen dat het verder gaat"\n- Een nieuwsbericht zegt dat het slecht gaat\n- Je vriend zegt dat je nu moet uitstappen\n\n**Over stop-losses:**\nVoor actieve daghandel kan een stop-loss nuttig zijn. Voor langetermijnbeleggen in ETFs is het contraproductief — je verkoopt precies als het laag is en mist het herstel.\n\n**Rebalanceren:**\nEen goede gewoonte is 1x per jaar de verhoudingen in je portefeuille te herstellen. Als Bitcoin enorm gestegen is en nu 30% van je portefeuille uitmaakt terwijl je 10% wilde, dan verkoop je wat. Niet op basis van angst — op basis van strategie.`,
  },

  // ── Emoties / angst bij beleggen ──────────────────────────────────────────
  {
    keywords: [
      'bang', 'angst', 'emoties', 'panik', 'paniek', 'stress', 'zorgen',
      'slecht slapen', 'onrustig', 'bang om geld te verliezen', 'nerveus',
    ],
    response:
      `**Angst en emoties horen bij beleggen — maar ze zijn je slechtste adviseur.**\n\n**Wat er fysiek gebeurt:**\nDe hersenen reageren op vermogensverlies als op een fysieke bedreiging. Cortisol schiet omhoog. Je wil actie ondernemen — "verkoop nu, red wat je kunt." Dit gevoel is evolutionair nuttig, maar financieel destructief.\n\n**Wat historisch altijd is gebeurd:**\nElke marktcrash in de afgelopen 100 jaar — 1929, 2001, 2008, 2020 — is gevolgd door herstel. Beleggers die verkochten in paniek, misten het herstel. Beleggers die bleven zitten, kwamen er sterker uit.\n\n**Hoe je jezelf beschermt:**\n1. Beleg alleen geld dat je écht 5–10 jaar niet nodig hebt\n2. Heb een noodfonds zodat je nooit gedwongen bent te verkopen\n3. Automatiseer je inleg zodat je niet steeds hoeft te beslissen\n4. Kijk minder naar je portefeuille. 1x per kwartaal is genoeg\n\n**Signaal dat je te veel risico neemt:**\nAls een -20% koersdaling je slaap verstoort, dan is je allocatie te agressief voor jouw psychologie. Risico is niet alleen wat je kunt verloven — het is ook wat je psychologisch aankan.`,
  },

  // ── Pensioeen / lange termijn ──────────────────────────────────────────────
  {
    keywords: [
      'pensioen', 'lange termijn', 'ouderdom', 'aow', 'aanvullend pensioen',
      'vermogensopbouw', 'financieel vrij', 'fire', 'vroeg stoppen met werken',
    ],
    response:
      `**Beleggen voor pensioen of lange termijn — de krachtigste aanpak.**\n\n**Waarom zo vroeg mogelijk beginnen?**\nSamengesteld rendement groeit exponentieel. €200/maand met 7% groei:\n- Beginnen op 25 → ~€525.000 op je 65e\n- Beginnen op 35 → ~€243.000 op je 65e\nTien jaar uitstel kost je meer dan de helft.\n\n**Strategie voor lange termijn:**\n- Hoge aandelenallocatie (80–100%) als horizon 20+ jaar is\n- Breed gespreide ETF als kern (VWCE)\n- Naarmate je dichter bij je doel komt, geleidelijk meer obligaties of cash toevoegen\n\n**Aanvullend pensioen via banksparen/lijfrente:**\nAls je een aanmerkelijke pensioenkloof hebt, kan een fiscaal gefaciliteerde lijfrenterekening interessant zijn. Inleg is aftrekbaar in Box 1. Groei is belastingvrij. Je kunt er pas bij op pensioendatum. Vraag dit na bij een fiscalist.\n\n**FIRE (Financial Independence, Retire Early):**\nDoel: een vermogen van 25x je jaaruitgaven. Bij 4% onttrekking per jaar "levend" van je portefeuille. Ambitieus maar realistisch voor mensen die vroeg en consequent beleggen.\n\n**Kern:** Begin vroeg, automatiseer, raak het niet aan.`,
  },

  // ── Diversificatie ─────────────────────────────────────────────────────────
  {
    keywords: [
      'diversificat', 'spreid', 'niet alles in één', 'te geconcentreerd',
      'hoeveel aandelen', 'hoeveel etfs', 'te veel producten',
    ],
    response:
      `**Diversificatie — het enige gratis voordeel in beleggen.**\n\n**Wat is het?**\nJe spreidt je vermogen over veel verschillende beleggingen zodat het slecht gaan van één niet je hele portefeuille treft.\n\n**Hoe diversifieer je goed?**\n- **Geografisch:** Niet alleen Nederland of Europa — ook VS, Azië, opkomende markten\n- **Sectoraal:** Technologie, zorg, energie, financiën — niet alleen tech\n- **Assetklasse:** Aandelen, eventueel obligaties, eventueel alternatieve assets\n\n**Eén ETF kan al goed zijn:**\nVWCE (World ETF) bevat al ~3.700 bedrijven in 50+ landen. Dat is enorm goed gediversifieerd. Je hoeft niet 10 ETFs te kopen.\n\n**Gevaar van over-diversificatie:**\nVeel beginners kopen 5–8 ETFs met veel overlap (VWCE + IWDA + S&P 500 zijn grotendeels hetzelfde). Dit geeft een illusie van spreiding maar complexeert je portefeuille zonder extra voordeel.\n\n**Wat NIET diversificeert:**\n- Meerdere Nederlandse aandelen\n- Meerdere cryptomunten\n- ETFs in dezelfde sector\n\n**Gouden regel:** Eenvoud is je vriend. Twee of drie goed gekozen, complementaire producten zijn beter dan tien overlappende.`,
  },

  // ── Schulden aflossen vs beleggen ─────────────────────────────────────────
  {
    keywords: [
      'schulden', 'schuld', 'lening', 'roodstand', 'krediet', 'creditcard schuld',
      'aflossen of beleggen', 'studielening', 'eerst aflossen',
    ],
    response:
      `**Schulden aflossen of beleggen — de rekenkundige beslissing.**\n\n**De basisregel:**\nAls je rente op schuld hoger is dan je verwacht beleggingsrendement, los dan eerst de schuld af.\n\n**Praktisch:**\n- **Creditcardschuld (15–25% rente):** Altijd eerst aflossen. Geen belegging geeft zeker 20% rendement.\n- **Persoonlijke lening (5–10%):** Aflossen heeft voorkeur. Beleg eventueel parallel als je horizon lang is.\n- **Hypotheek (2–4%):** Hier is de afweging subtieler. Historisch rendement aandelen is 7–10%. Aflossen is "risicovrij rendement" gelijk aan je hypotheekrente.\n- **Studielening (0–2,56%):** Hier kan het zinvol zijn parallel te beleggen gezien de lage rente.\n\n**Psychologisch aspect:**\nSomme mensen voelen schulden als een emotionele last. Die emotionele waarde van schuldenvrij zijn telt ook mee — ook al zegt de wiskunde "beleg liever."\n\n**Hybride aanpak:**\nBetaal altijd meer dan minimum af op dure schulden, bouw tegelijk een noodfonds, en begin daarna pas serieus met beleggen.`,
  },

  // ── Obligaties ────────────────────────────────────────────────────────────
  {
    keywords: [
      'obligaties', 'obligatie', 'bonds', 'staatsobligaties', 'bedrijfsobligaties',
      'veilig beleggen', 'minder risico',
    ],
    response:
      `**Obligaties — het rustpunt in een portefeuille.**\n\n**Wat zijn obligaties?**\nJe leent geld aan een overheid of bedrijf. Zij betalen je een vaste rente (coupon), en aan het einde van de looptijd krijg je je geld terug.\n\n**Waarom obligaties?**\n- Lager risico dan aandelen\n- Stabielere inkomsten (vaste rente)\n- In crises gaan obligaties (staatsobligaties) vaak omhoog als aandelen dalen — ze zijn tegengesteld\n\n**Nadelen:**\n- Lager verwacht rendement dan aandelen (historisch 2–4% voor staatsobligaties)\n- Gevoelig voor rentestijgingen: als de rente stijgt, daalt de obligatiekoers\n\n**Wanneer obligaties toevoegen?**\n- Als je horizon korter is (5–10 jaar)\n- Als je snel met pensioen gaat\n- Als je psychologisch niet kunt omgaan met aandelenvolatiliteit\n\n**Voor beginners onder 40:**\nVaak niet nodig. Met een lange horizon is een hoge aandelenallocatie rationeel. Obligaties worden relevanter naarmate je dichter bij je doel komt.\n\n**ETF-optie:** iShares Core Euro Govt Bond ETF (IEGA) voor Europese staatsobligaties.`,
  },

  // ── Inflatie ───────────────────────────────────────────────────────────────
  {
    keywords: [
      'inflatie', 'koopkracht', 'geld verliest waarde', 'geldontwaarding',
      'waarom beleggen', 'sparen is niet genoeg',
    ],
    response:
      `**Inflatie is de stille slooper van je vermogen.**\n\n**Wat doet inflatie?**\nBij 3% inflatie is €10.000 over 10 jaar nog maar ~€7.440 waard in koopkracht. Jij hebt niets gedaan — maar je vermogen is 26% geslonken.\n\n**Spaarrente vs inflatie:**\nAls je spaarrente lager is dan inflatie, verlies je koopkracht gegarandeerd. Dat is jarenlang het geval geweest in Europa met rentes van 0–1% en inflatie van 2–9%.\n\n**Beleggen als bescherming:**\nAandelen en vastgoed zijn "reële assets" — hun waarde stijgt historisch mee met of harder dan inflatie. Een wereldindex ETF heeft inflatie historisch structureel verslagen.\n\n**Bitcoin als inflatiehedge?**\nDit argument wordt veel gemaakt, maar Bitcoin is tot nu toe enorm gecorreleerd met risicobereidheid — niet met inflatie. In 2022 daalde Bitcoin tegelijk met aandelen, terwijl inflatie hoog was. Het is speculatief, niet defensief.\n\n**Conclusie:**\nNiet beleggen is ook een keuze — en het is een keuze om zeker koopkracht te verliezen. Beleggen in een breed gespreide index is de beste bescherming voor de meeste particulieren.`,
  },

  // ── Broker kiezen ─────────────────────────────────────────────────────────
  {
    keywords: [
      'broker', 'platform', 'degiro', 'ibkr', 'interactive brokers', 'saxo',
      'waar kopen', 'beleggingsplatform', 'welk platform', 'trading 212',
    ],
    response:
      `**Broker kiezen — de meest gebruikte opties voor Nederlanders.**\n\n**DEGIRO**\n✓ Laag op commissies, breed aanbod ETFs\n✓ Populairste broker voor beginners in NL\n✗ Beperkte functies voor geavanceerde beleggers\n✗ Klantenservice is traag\n\n**Interactive Brokers (IBKR)**\n✓ Zeer goedkoop voor grotere volumes\n✓ Breed internationaal aanbod\n✗ Complexe interface voor beginners\n✗ Minimum activiteitsvereisten (afhankelijk van accounttype)\n\n**Saxo Bank**\n✓ Goede interface, breed aanbod\n✓ NL-gereguleerd, sterk\n✗ Hogere kosten voor kleinere beleggers\n\n**Trading 212**\n✓ Gratis commissies, moderne app\n✓ Fractional shares mogelijk\n✗ Relatief nieuw, minder track record\n\n**Wat niet uitkomt:**\nJe bank (ABN AMRO, Rabobank, ING) — hogere kosten, beperkter aanbod, maar wél vertrouwd.\n\n**Advies:** DEGIRO is voor de meeste beginners goed genoeg. Als je groeit, switch naar IBKR voor lagere kosten bij grotere volumes.`,
  },

  // ── Aandelen vs ETF ───────────────────────────────────────────────────────
  {
    keywords: [
      'individuele aandelen', 'losse aandelen', 'aandeel kopen', 'wat is een aandeel',
      'aandelen vs etf', 'zelf aandelen', 'stockpicking', 'aandelen kiezen',
    ],
    response:
      `**Individuele aandelen vs ETFs — een eerlijke vergelijking.**\n\n**Individuele aandelen:**\n- Je kiest zelf bedrijven (Apple, ASML, Shell...)\n- Potentieel hoger rendement als je goed kiest\n- Maar ook: potentieel groter verlies\n- Kost tijd: bedrijfsanalyse, nieuws volgen\n- Enorme spreiding is moeilijk met klein kapitaal\n\n**ETFs:**\n- Je koopt de hele markt in één product\n- Automatisch gespreide over honderden of duizenden bedrijven\n- Goedkoper (lage jaarkosten)\n- Geen tijdsinvestering nodig\n\n**De harde statistiek:**\nMeer dan 80% van actieve fondsbeheerders (professionals!) doet het op de lange termijn slechter dan een simpele index-ETF. Voor particulieren is dat percentage nog hoger.\n\n**Wanneer heeft stockpicking zin?**\nAls je:\n1. Aanzienlijk meer kennis hebt dan de markt over een bepaald bedrijf\n2. Bereid bent veel tijd te steken in analyse\n3. Het doet met een klein deel van je portefeuille (max 10–20%)\n\n**Aanbeveling:** Bouw eerst een ETF-basis. Als je daarna wil experimenteren met losse aandelen, doe dat met een kleine "speelgeldbak" — nooit met je hele vermogen.`,
  },

  // ── Crypto algemeen ───────────────────────────────────────────────────────
  {
    keywords: [
      'crypto', 'cryptocurrency', 'ethereum', 'altcoin', 'solana', 'xrp',
      'defi', 'nft', 'blockchain', 'web3',
    ],
    response:
      `**Crypto beleggen — wat je moet weten voordat je begint.**\n\n**Wat is crypto?**\nDigitale valuta's gebaseerd op blockchain-technologie. Bitcoin is de grootste en oudste. Ethereum is de tweede, met een heel ecosysteem aan applicaties erop.\n\n**Risicoprofiel:**\nCrypto is de meest volatile assetklasse die breed beschikbaar is. -50% in een jaar is normaal. -80% is meerdere keren voorgekomen. Maar ook: +500% in een goed jaar.\n\n**Bitcoin vs altcoins:**\nBitcoin heeft de langste trackrecord, meeste liquiditeit en meeste institutionele adoptie. Altcoins (Ethereum, Solana, etc.) hebben potentieel hoger rendement maar ook veel hoger risico. Veel altcoins zijn ooit naar nul gegaan.\n\n**Hoeveel alloceren?**\nDe meeste serieuze beleggers adviseren: 0–10% van je portefeuille, afhankelijk van risicotolerantie. Nooit meer dan je kunt missen.\n\n**Valkuilen:**\n- FOMO (fear of missing out) bij hype-perioden\n- Kopen bij ATH (all-time high) uit enthousiasme\n- Bewaren op exchange — zelf bewaren op hardware wallet is veiliger\n- Altcoins die beloven "de volgende Bitcoin te worden"\n\n**Advies:** Begrijp wat je koopt. Crypto is niet fout, maar het is speculatief. Bouw eerst een stabiele ETF-basis.`,
  },

  // ── Portefeuille samenstelling / check ────────────────────────────────────
  {
    keywords: [
      'mijn portefeuille', 'klopt mijn portefeuille', 'goede verdeling',
      'beoordeel', 'check mijn', 'feedback op', 'wat vind je van',
    ],
    response:
      `**Ik kan je helpen nadenken over je portefeuille — deel gerust de details.**\n\nAls je je huidige verdeling deelt, kijk ik naar:\n\n1. **Concentratierisico** — Zit je te zwaar in één land, sector of bedrijf?\n2. **Overlap** — Heb je meerdere ETFs die grotendeels hetzelfde bevatten?\n3. **Verhouding risico/horizon** — Past je aandelenallocatie bij je tijdshorizon?\n4. **Kosten** — Zijn de TER (jaarlijkse kosten) van je producten redelijk?\n5. **Complexiteit** — Kun je deze portefeuille begrijpen en volhouden?\n\n**Wat me helpt:**\n- De producten die je aanhoudt\n- Percentages of bedragen per product\n- Je tijdshorizon (wanneer heb je het geld nodig?)\n- Je doel (pensioen, huis kopen, vermogensopbouw?)\n\nDeel gerust de informatie en ik ga er inhoudelijk op in.`,
  },

  // ── Rebalanceren ──────────────────────────────────────────────────────────
  {
    keywords: [
      'rebalanceer', 'rebalanceren', 'herverdelen', 'gewichten herstellen',
      'te veel crypto', 'te veel aandelen', 'portefeuille herstellen',
    ],
    response:
      `**Rebalanceren — je portefeuille in balans houden.**\n\n**Waarom rebalanceren?**\nDoor koersschommelingen verschuiven de verhoudingen in je portefeuille. Als Bitcoin hard stijgt, kan het ineens 30% van je portefeuille zijn terwijl je 10% wilde. Dat betekent meer risico dan je bedoeld had.\n\n**Wanneer rebalanceren?**\n- **Jaarlijks:** Eén keer per jaar de verhoudingen herstellen — simpel en effectief\n- **Drempelwaarde:** Wanneer een asset meer dan 5% afwijkt van je doelaglocatie\n- **Niet te vaak:** Elke maand rebalanceren kost transactiekosten en is niet nodig\n\n**Hoe rebalanceren?**\nOpties:\n1. Verkoop van wat te groot is geworden, koop wat te klein is geworden\n2. Dirigeer nieuwe inleg naar de ondergewogen categorie (goedkoper — geen verkooptransacties)\n\n**Belasting:**\nVerkopen kan belastingimplicaties hebben (realiseren van winst). In Nederland valt dit in Box 3 (vermogensrendementsheffing op fictief rendement), dus realiseren van winst heeft hier geen directe belastingconsequentie op de winst zelf.\n\n**Korte versie:** 1x per jaar kijken, bijsturen via nieuwe inleg, klaar.`,
  },
];

const FALLBACK_RESPONSES = [
  `**Goede vraag — ik wil je goed helpen.**\n\nIk ben een kennisbot met antwoorden over de meest gestelde beleggingsvragen. Probeer je vraag wat specifieker te formuleren, of kies een van de voorbeeldvragen hieronder.\n\n**Onderwerpen waar ik goed in ben:**\n- ETFs, wereldindex, VWCE, S&P 500\n- Bitcoin en crypto\n- Noodfonds en bufferstrategie\n- Maandelijks beleggen en DCA\n- Risico en volatiliteit\n- Broker kiezen\n- Belasting en Box 3\n- Portefeuilleopbouw voor beginners\n\nStel gerust je vraag opnieuw — iets concreter en ik zal je goed kunnen helpen.`,
  `**Ik heb je vraag niet volledig herkend.**\n\nMijn kennisbank is gefocust op praktische beleggingsvragen voor particulieren. Probeer een van deze formuleringen:\n- "Wat is een ETF?"\n- "Hoe werkt DCA?"\n- "Moet ik eerst mijn noodfonds aanvullen?"\n- "Wat is het verschil tussen risico en volatiliteit?"\n\nOf beschrijf je situatie concreter, dan doe ik mijn best.`,
];

function findResponse(input: string): string {
  const normalized = input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const entry of KB) {
    if (entry.keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      return entry.response + DISCLAIMER;
    }
  }

  // Random fallback
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)] + DISCLAIMER;
}

// ─── Typing simulation ─────────────────────────────────────────────────────────

function typeText(
  text: string,
  onUpdate: (partial: string) => void,
  onDone: () => void
): () => void {
  const words = text.split(' ');
  let index = 0;
  const CHUNK = 5; // words per tick
  const DELAY = 28; // ms per tick

  const id = setInterval(() => {
    index = Math.min(index + CHUNK, words.length);
    onUpdate(words.slice(0, index).join(' '));
    if (index >= words.length) {
      clearInterval(id);
      onDone();
    }
  }, DELAY);

  return () => clearInterval(id);
}

// ─── Formatting ────────────────────────────────────────────────────────────────

function formatMessage(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-xs font-mono text-slate-200">$1</code>')
    .replace(/^— (.*)$/gm, '<span class="text-slate-500 italic text-xs">— $1</span>')
    .replace(/\n\n/g, '</p><p class="mt-3">')
    .replace(/\n/g, '<br />');
}

// ─── Starter prompts ───────────────────────────────────────────────────────────

const STARTER_PROMPTS = [
  'Ik heb €500 per maand om te beleggen. Wat is een verstandige verdeling?',
  'Hoe begin ik met het opbouwen van mijn eerste portefeuille?',
  'Past Bitcoin bij mijn profiel, of moet ik me focussen op ETFs?',
  'Ik wil beleggen, maar heb ook een noodfonds nodig. Wat gaat voor?',
  'Wat is het verschil tussen risico en volatiliteit als belegger?',
  'Hoe werkt dollar-cost averaging en wanneer is het slim?',
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const stopTypingRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isTyping) return;

      setInput('');

      const userMsg: Message = { role: 'user', content: trimmed };
      setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: '' }]);
      setIsTyping(true);

      // Thinking delay then type
      const thinkTimeout = setTimeout(() => {
        const fullResponse = findResponse(trimmed);

        const stop = typeText(
          fullResponse,
          (partial) => {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === 'assistant') {
                copy[copy.length - 1] = { role: 'assistant', content: partial };
              }
              return copy;
            });
          },
          () => setIsTyping(false)
        );
        stopTypingRef.current = stop;
      }, 600);

      return () => clearTimeout(thinkTimeout);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleReset = () => {
    stopTypingRef.current?.();
    setMessages([]);
    setIsTyping(false);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-48px)] px-0">

      {/* ── Header ── */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-[#1e2d45] bg-[#0a0e1a]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-100">Beleggingsassistent</h1>
              <p className="text-xs text-slate-500">Veelgestelde vragen over beleggen</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded hover:bg-slate-800"
            >
              Nieuw gesprek
            </button>
          )}
        </div>
      </div>

      {/* ── Message area ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">

          {/* Empty state */}
          {isEmpty && (
            <div className="space-y-8">
              <div className="text-center space-y-3 pt-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Hoe kan ik je helpen?</h2>
                  <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    Stel een vraag over beleggen — ETFs, DCA, noodfonds, risico, Bitcoin of portefeuilleopbouw.
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">Veelgestelde vragen</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => sendMessage(prompt)}
                      className="text-left px-4 py-3 rounded-xl bg-[#111827] border border-[#1e2d45] hover:border-blue-500/30 hover:bg-blue-500/5 transition-all text-sm text-slate-300 hover:text-slate-100 leading-snug group"
                    >
                      <span className="text-blue-500 mr-2 group-hover:text-blue-400 transition-colors">→</span>
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#111827] border border-[#1e2d45] rounded-xl px-5 py-4">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-3">Onderwerpen</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '📊', title: 'ETFs & indices', desc: 'VWCE, S&P 500, wereldindex' },
                    { icon: '🔄', title: 'DCA strategie', desc: 'Periodiek beleggen' },
                    { icon: '🛡️', title: 'Noodfonds', desc: 'Buffer vóór beleggen' },
                    { icon: '₿', title: 'Bitcoin & crypto', desc: 'Risico, allocatie' },
                    { icon: '⚖️', title: 'Risico begrijpen', desc: 'Volatiliteit vs verlies' },
                    { icon: '🏦', title: 'Broker kiezen', desc: 'DEGIRO, IBKR, Saxo' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="flex items-start gap-2.5">
                      <span className="text-base flex-shrink-0">{icon}</span>
                      <div>
                        <p className="text-xs font-medium text-slate-300">{title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isEmpty && (
            <div className="space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      : 'bg-slate-700/50 border border-slate-600 text-slate-400'
                  }`}>
                    {msg.role === 'user' ? 'U' : 'B'}
                  </div>

                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-500/15 border border-blue-500/25 text-slate-200 rounded-tr-sm'
                      : 'bg-[#111827] border border-[#1e2d45] text-slate-300 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? (
                      msg.content ? (
                        <div
                          className="space-y-0"
                          dangerouslySetInnerHTML={{
                            __html: '<p>' + formatMessage(msg.content) + '</p>',
                          }}
                        />
                      ) : (
                        <div className="flex items-center gap-1 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )
                    ) : (
                      <p>{msg.content}</p>
                    )}
                  </div>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* ── Input area ── */}
      <div className="flex-shrink-0 border-t border-[#1e2d45] bg-[#0a0e1a] px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2.5 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Stel een vraag over beleggen..."
              rows={1}
              disabled={isTyping}
              className="flex-1 bg-[#111827] border border-[#1e2d45] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600
                         focus:outline-none focus:border-blue-500/50 transition-colors resize-none
                         disabled:opacity-50 min-h-[40px] max-h-[120px]"
              style={{ height: 'auto' }}
              onInput={(e) => {
                const t = e.currentTarget;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 120) + 'px';
              }}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:bg-slate-700 disabled:opacity-50
                         flex items-center justify-center transition-colors"
              aria-label="Verstuur bericht"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          </form>

          <p className="text-xs text-slate-700 mt-2 text-center leading-relaxed">
            Beslissingsondersteuning — geen financieel advies. Raadpleeg een gecertificeerd adviseur voor persoonlijke beslissingen.
          </p>
        </div>
      </div>

    </div>
  );
}
