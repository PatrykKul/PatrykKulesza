import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie | Białystok, Zambrów",
    template: "%s | Patryk Kulesza - Korepetycje"
  },
  description: "Korepetycje z matematyki, angielskiego i programowania w Białymstoku i Zambrowie. 5+ lat doświadczenia, 100% zdawalność egzaminów. Python, Data Science, Next.js. Zajęcia online i stacjonarne.",
  keywords: [
    "korepetycje Białystok",
    "korepetycje matematyka Białystok", 
    "korepetycje angielski Białystok",
    "korepetycje programowanie",
    "nauka Python",
    "przygotowanie do matury",
    "egzamin ósmoklasisty",
    "Zambrów korepetycje",
    "Data Science nauka",
    "Next.js kursy",
    "korepetycje online"
  ],
  authors: [{ name: "Patryk Kulesza" }],
  creator: "Patryk Kulesza",
  publisher: "Patryk Kulesza",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://patryk-korepetycje.pl'), // Zmień na swoją domenę
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie",
    description: "Korepetycje z matematyki, angielskiego i programowania w Białymstoku i Zambrowie. 5+ lat doświadczenia, 100% zdawalność egzaminów.",
    url: 'https://patryk-korepetycje.pl',
    siteName: 'Patryk Kulesza - Korepetycje',
    images: [
      {
        url: '/og-image.jpg', // Stwórz ten obrazek 1200x630px
        width: 1200,
        height: 630,
        alt: 'Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie',
      },
    ],
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie",
    description: "Korepetycje z matematyki, angielskiego i programowania w Białymstoku i Zambrowie. 5+ lat doświadczenia.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Dodaj po weryfikacji w Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Preconnect dla szybszego ładowania */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured Data - JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": "https://patryk-korepetycje.pl/#person",
                  "name": "Patryk Kulesza",
                  "givenName": "Patryk",
                  "familyName": "Kulesza",
                  "jobTitle": "Korepetytor",
                  "description": "Doświadczony korepetytor matematyki, angielskiego i programowania",
                  "telephone": "+48662581368",
                  "email": "patryk27_2003@o2.pl",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Białystok",
                    "addressRegion": "Podlaskie",
                    "addressCountry": "PL"
                  },
                  "knowsAbout": ["Matematyka", "Angielski", "Programowanie", "Python", "Data Science"],
                  "alumniOf": "Politechnika Białostocka"
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://patryk-korepetycje.pl/#business",
                  "name": "Patryk Kulesza - Korepetycje",
                  "description": "Profesjonalne korepetycje z matematyki, angielskiego i programowania",
                  "founder": {
                    "@id": "https://patryk-korepetycje.pl/#person"
                  },
                  "serviceArea": [
                    {
                      "@type": "City",
                      "name": "Białystok"
                    },
                    {
                      "@type": "City", 
                      "name": "Zambrów"
                    }
                  ],
                  "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Usługi korepetycji",
                    "itemListElement": [
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Korepetycje z matematyki",
                          "description": "Matematyka na wszystkich poziomach"
                        },
                        "priceRange": "60-80 PLN"
                      },
                      {
                        "@type": "Offer", 
                        "itemOffered": {
                          "@type": "Service",
                          "name": "Korepetycje z angielskiego",
                          "description": "Angielski konwersacyjny i przygotowanie do egzaminów"
                        },
                        "priceRange": "50-70 PLN"
                      },
                      {
                        "@type": "Offer",
                        "itemOffered": {
                          "@type": "Service", 
                          "name": "Korepetycje z programowania",
                          "description": "Python, Next.js, Data Science"
                        },
                        "priceRange": "70-100 PLN"
                      }
                    ]
                  },
                  "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "5",
                    "reviewCount": "60",
                    "bestRating": "5"
                  },
                  "telephone": "+48662581368",
                  "email": "patryk27_2003@o2.pl",
                  "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Białystok",
                    "addressRegion": "Podlaskie", 
                    "addressCountry": "PL"
                  }
                }
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}