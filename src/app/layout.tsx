// ==========================================
// FILE: src/app/layout.tsx
// ==========================================
// Layout - DODANO: SearchContextProvider + GlobalSearch

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import Chatbot from "@/components/chatbot/Chatbot";
import { ExamContextProvider } from "@/app/matematyka/components/exams/ExamContext";
// 🔥 NOWE IMPORTY
import { SearchContextProvider } from "@/components/GlobalSearch/SearchContext";
import GlobalSearch from "@/components/GlobalSearch/GlobalSearch";

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
    "egzamin ósmoklaisisty",
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
  metadataBase: new URL('https://PatrykKul.github.io/korepetycje'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie",
    description: "Korepetycje z matematyki, angielskiego i programowania w Białymstoku i Zambrowie. 5+ lat doświadczenia, 100% zdawalność egzaminów.",
    url: 'https://PatrykKul.github.io/korepetycje',
    siteName: 'Patryk Kulesza - Korepetycje',
    locale: 'pl_PL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Patryk Kulesza - Korepetycje Matematyka, Angielski, Programowanie",
    description: "Korepetycje z matematyki, angielskiego i programowania w Białymstoku i Zambrowie. 5+ lat doświadczenia.",
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
    google: 'your-google-verification-code',
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
        <meta name="google-site-verification" content="Qavp3KOkeYUTDJ0th33oK8ZhKDVHKK6qTvfrHKbIwuc" />    
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
                  "@id": "https://PatrykKul.github.io/korepetycje/#person",
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
                  "@id": "https://PatrykKul.github.io/korepetycje/#business",
                  "name": "Patryk Kulesza - Korepetycje",
                  "description": "Profesjonalne korepetycje z matematyki, angielskiego i programowania",
                  "founder": {
                    "@id": "https://PatrykKul.github.io/korepetycje/#person"
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
        {/* 🔥 NOWA STRUKTURA - SearchContextProvider owija wszystko */}
        <SearchContextProvider>
          <ExamContextProvider>
            {children}
            <Chatbot />
            {/* 🔥 NOWY KOMPONENT - GlobalSearch */}
            <GlobalSearch />
          </ExamContextProvider>
        </SearchContextProvider>
      </body>
    </html>
  );
}