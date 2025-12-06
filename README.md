# DinnerSwipe

Een moderne web applicatie voor het kiezen van de perfecte menu door te swipen door heerlijke gerechten.

## Features

- **Guest Swipe Experience**: Intuïtieve swipe interface voor het kiezen van gerechten
- **Admin Dashboard**: Volledig CRUD systeem voor het beheren van gerechten
- **Tournament System**: Automatisch toernooi voor het rangschikken van favoriete gerechten
- **Image Upload**: Upload afbeeldingen voor gerechten naar Supabase Storage
- **Responsive Design**: Werkt perfect op desktop, tablet en mobiel
- **TypeScript**: Volledig getype applicatie voor betere ontwikkelaarservaring

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Language**: TypeScript

## Setup Instructions

### 1. Clone het project

```bash
git clone <repository-url>
cd DinnerTinder
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Environment Variabelen

Maak een `.env.local` bestand aan in de root van het project met de volgende variabelen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://igpfvcihykgouwiulxwn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncGZ2Y2loeWdwiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwODY2NzUsImV4cCI6MjA3OTY2MjY3NX0.6pGw2PX1MIC_YtUnR758NwmEsLggcz-o9wN9pY14lXU
SUPABASE_SERVICE_ROLE=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlncGZ2Y2loeWdwiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDA4ODY2NzUsImV4cCI6MjA3OTY2MjY3NX0.DhY-ZENRF8GtEo1CpRpipufCPWXOozrnKxffwQ0gyvs
```

### 4. Supabase Database Setup

1. Ga naar je Supabase project: https://igpfvcihykgouwiulxwn.supabase.co
2. Navigeer naar de SQL Editor
3. Voer het volgende SQL script uit om de `dishes` tabel te maken:

```sql
CREATE TABLE dishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('voor', 'hoofd', 'na')),
  name TEXT NOT NULL,
  subtitle TEXT,
  ingredients TEXT NOT NULL,
  preparation TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index voor betere performance
CREATE INDEX idx_dishes_category ON dishes(category);
CREATE INDEX idx_dishes_created_at ON dishes(created_at DESC);
```

### 5. Supabase Storage Setup

1. Navigeer naar Storage in je Supabase dashboard
2. Maak een nieuwe bucket genaamd `dish-images`
3. Zet de volgende policies:

```sql
-- Policy voor het uploaden van afbeeldingen
CREATE POLICY "Allow image uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'dish-images' AND
  auth.role() = 'authenticated'
);

-- Policy voor het bekijken van afbeeldingen
CREATE POLICY "Allow public image access" ON storage.objects
FOR SELECT USING (
  bucket_id = 'dish-images'
);
```

### 6. Start de applicatie

```bash
npm run dev
```

De applicatie is nu beschikbaar op `http://localhost:3000`

## Project Structuur

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── intro/             # Category intro pages
│   ├── swipe/             # Swipe interface pages
│   ├── duel/              # Tournament duel pages
│   ├── top3/               # Top 3 selection pages
│   ├── final/              # Final menu display
│   ├── layout.tsx          # Root layout
│   └── page.tsx           # Home page
├── components/              # Reusable React components
│   ├── Header.tsx          # Navigation header
│   ├── DishCardLarge.tsx   # Large dish card for swipe
│   ├── DishCardSmall.tsx   # Small dish card for rankings
│   ├── DuelCard.tsx        # Two-choice duel interface
│   ├── ProgressDots.tsx    # Progress indicator
│   ├── PrimaryButton.tsx    # Primary CTA button
│   └── SecondaryButton.tsx  # Secondary button
├── lib/                    # Utility libraries
│   ├── supabase.ts         # Supabase client & types
│   └── tournament.ts        # Tournament logic
├── types/                  # TypeScript type definitions
│   └── index.ts            # Main types file
└── theme.ts                # Theme configuration
```

## Gebruik

### Guest Flow

1. **Home**: Startpagina met categorie keuze
2. **Intro**: Uitleg van swipe regels per categorie
3. **Swipe**: Swipe door 10 gerechten per categorie
   - Links: Niet leuk (0 punten)
   - Rechts: Leuk (1 punt)
   - Omhoog: Favoriet (2 punten)
4. **Duel**: Toernooi tussen gerechten met score ≥ 1
5. **Top 3**: Kies winnaar uit top 3 gerangschikte gerechten
6. **Final**: Bekijk complete menu met 3 winnaars

### Admin Flow

1. **Login**: Inloggen met e-mail/wachtwoord of magic link
2. **Dashboard**: Overzicht van statistieken en recente gerechten
3. **Gerechten Beheren**: 
   - Lijst van alle gerechten met filters
   - Nieuw gerecht toevoegen
   - Bestaand gerecht bewerken
   - Gerecht verwijderen
4. **Image Upload**: Upload afbeeldingen naar Supabase Storage

## Componenten

### Reusable Components

- **Header**: Navigatie header met admin link
- **DishCardLarge**: Grote kaart voor swipe interface
- **DishCardSmall**: Kleine kaart voor rankings
- **DuelCard**: Twee-keuze duel interface
- **ProgressDots**: Visuele voortgang indicator
- **PrimaryButton**: Primaire call-to-action knop
- **SecondaryButton**: Secundaire knop

### Pages

#### Guest Pages
- `/` - Homepagina met categorie keuze
- `/intro/[category]` - Uitleg per categorie
- `/swipe/[category]` - Swipe interface
- `/duel/[category]` - Toernooi duels
- `/top3/[category]` - Top 3 selectie
- `/final` - Complete menu

#### Admin Pages
- `/admin/login` - Admin login
- `/admin` - Dashboard met statistieken
- `/admin/dishes` - Gerechten lijst met filters
- `/admin/dishes/new` - Nieuw gerecht formulier
- `/admin/dishes/[id]` - Gerecht bewerken

## Database Schema

```sql
dishes (
  id: UUID (Primary Key)
  category: 'voor' | 'hoofd' | 'na'
  name: String
  subtitle: String (optional)
  ingredients: String
  preparation: String
  image_url: String (optional)
  created_at: Timestamp
)
```

## Theme Customization

De applicatie gebruikt een centraal theme systeem in `src/theme.ts`. Pas deze waarden aan om het uiterlijk aan te passen aan je Figma design:

```typescript
export const theme = {
  colors: {
    primary: { /* Primaire kleuren */ },
    secondary: { /* Secundaire kleuren */ },
    categories: {
      voor: { /* Voorgerecht kleuren */ },
      hoofd: { /* Hoofdgerecht kleuren */ },
      na: { /* Nagerecht kleuren */ },
    }
  },
  // ... andere theme opties
}
```

## Deployment

### Vercel (Aanbevolen)

1. Installeer Vercel CLI:
```bash
npm i -g vercel
```

2. Build de applicatie:
```bash
npm run build
```

3. Deploy naar Vercel:
```bash
vercel --prod
```

4. Voeg environment variabelen toe in Vercel dashboard

### Environment Variabelen voor Production

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE` (alleen voor server-side operations)

## Ontwikkeling

### Lokaal ontwikkelen

```bash
# Start development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build voor productie
npm run build
```

### Nieuwe features toevoegen

1. Maak nieuwe componenten in `src/components/`
2. Voeg nieuwe pages toe in `src/app/`
3. Update types in `src/types/`
4. Test op alle devices (responsive design)

## Bijdragen

1. Fork het project
2. Maak een feature branch: `git checkout -b feature/naam`
3. Commit changes: `git commit -m "Beschrijving"`
4. Push: `git push origin feature/naam`
5. Open Pull Request

## License

MIT License - zie LICENSE bestand voor details

## Support

Voor vragen of support, neem contact op via project issues.
