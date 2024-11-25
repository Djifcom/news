// styles
import "../globals.css";

// Libs
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, getFormatter } from 'next-intl/server';

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import Head from "next/head";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { Inter } from "next/font/google";
import { draftMode } from "next/headers";

import { Suspense } from "react";

// Components
import { Header } from "@components/layouts/Header";
import { Footer } from "@components/layouts/Footer";

// icons
import { Search } from 'lucide-react';

import AlertBanner from "./alert-banner";
import PortableText from "./portable-text";

import type { SettingsQueryResult } from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { allPostsQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

import type { AllPostsQueryResult } from "@/sanity.types";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  });
  const title = settings?.title || demo.title;
  const description = settings?.description || demo.description;

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});


export default async function RootLayout({
  children,
  params: {locale}
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {

  const posts: AllPostsQueryResult[] = await sanityFetch<AllPostsQueryResult[]>({
    query: allPostsQuery
  });

  const messages = await getMessages();

    // Get a formatter instance with the locale
    const format = await getFormatter({locale});
    const dateTime = new Date()
    // Format the date using the formatter, ensuring it returns a string
    const formattedDateTime = format.dateTime(dateTime, {
      dateStyle: 'full'
    });

    console.log("all posts", posts)
  
  return (
    <html lang={locale} className={`${inter.variable} bg-white text-black scroll-smooth overflow-x-hidden`} suppressHydrationWarning >
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
      </Head>

      <body className="flex flex-col items-center bg-gray-600 mx-0 my-0 overflow-x-hidden">
        <NextIntlClientProvider messages={messages}>
        <Header posts={posts} locale={locale} title={demo.title} description={'Les nouvelles de Zio'} dateTime={formattedDateTime} />
            {draftMode().isEnabled && <AlertBanner />}
            <main className="bg-white pt-[290px] lg:pt-[330px] w-full max-w-[1200px] min-h-screen">{children}</main>
            <Suspense>
              <Footer locale={locale} />
            </Suspense>
          {draftMode().isEnabled && <VisualEditing />}
          <SpeedInsights />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
