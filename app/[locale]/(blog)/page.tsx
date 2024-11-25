import Link from "next/link";
import { Suspense } from "react";
import Image from "next/image";
import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";
import MoreStories from "./more-stories";
import Onboarding from "./onboarding";

import type { HeroQueryResult, SettingsQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { heroQuery, settingsQuery } from "@/sanity/lib/queries";
import { unstable_setRequestLocale } from "next-intl/server";

type PropsRootPage = {
  params: { locale: string };
};

function HeroPost({
  title,
  slug,
  excerpt,
  coverImage,
  date,
  author,
  locale
}: Pick<
  Exclude<HeroQueryResult, null>,
  "title" | "coverImage" | "date" | "excerpt" | "author" | "slug"
> & {locale:string}) {

  const rubrique = "actualite"

  const truncatedTitle = title.length > 100 ? `${title.slice(0, 100)}...` : title;
  const truncatedExcerpt = excerpt && excerpt.length > 100 ? `${excerpt.slice(0, 100)}...` : excerpt;

return(
  <article className="relative flex flex-col items-center group/hero">
    <Link className="block mb-8 md:mb-16 w-full min-w-[75%] sm:max-w-[400px] lg:max-w-[1000px] group group/image" 
    href={`${locale}/posts/a-la-une/${slug}`}>
      <CoverImage image={coverImage} wrapperClassNames={"w-full"} imgClassNames={"w-full object-cover"} priority />
    </Link>
    <div className="lg:absolute lg:bottom-0 md:gap-x-5 border-2 md:grid bg-[rgba(255,255,255,0.9)] hover:bg-teal-100 opacity-100 mb-8 md:mb-10 p-6 border-black rounded-[15px] max-w-[500px] 
     overflow-hidden">
      <div className="max-w-[500px]">
        <h1 className="mb-4 font-bold text-2xl text-pretty leading-tight">
          <Link href={`${locale}/posts/a-la-une/${slug}`} className="hover:text-teal-900 hover:no-underline overflow-hidden">
            <span className="hidden lg:group-hover/hero:block animate-drop-in">Consulter l&apos;article</span>
            <span className="lg:group-hover/hero:hidden my-1 animate-drop-in">{truncatedTitle}</span>
          </Link>
        </h1>
        <div className="mb-4 md:mb-0 max-w-[500px] font-semibold text-gray-600 text-lg lg:group-hover/hero:hidden">
          <DateComponent dateString={date} />
        </div>
      </div>
      <div className="max-w-[500px] lg:group-hover/hero:hidden">
        {excerpt && (
          <p className="mb-4 text-lg text-pretty leading-relaxed overflow-hidden ease-in">
            {truncatedExcerpt}
          </p>
        )}
        {author && <Avatar name={author.name} picture={author.picture} />}
      </div>
    </div>
  </article>
  )
}

export default async function Page({params }: PropsRootPage) {
  const locale = params.locale
  unstable_setRequestLocale(locale);
  const [settings, heroPost] = await Promise.all([
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
    sanityFetch<HeroQueryResult>({ query: heroQuery }),
  ]);


  return (
    <div className="mx-auto px-5 container">
      {heroPost ? (
        <HeroPost
          title={heroPost.title}
          slug={heroPost.slug}
          coverImage={heroPost.coverImage}
          excerpt={heroPost.excerpt}
          date={heroPost.date}
          author={heroPost.author}
          locale={locale}
        />
      ) : (
        <Onboarding />
      )}
      {heroPost?._id && (
        <aside className="pt-4">
          <div className="flex flex-col justify-center items-center mb-5 w-full">
            <h2 className="bg-gray-50 mb-8 px-8 py-2 border border-t-4 border-t-black rounded-b-md font-bold text-3xl leading-tight tracking-tighter">
              Nos autres articles
            </h2>
          </div>
       
          <Suspense>
            <MoreStories skip={heroPost._id} limit={10} locale={locale}/>
          </Suspense>
        </aside>
      )}
    </div>
  );
}

