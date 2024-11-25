import { unstable_setRequestLocale } from "next-intl/server";
import { allPostsQuery, moreStoriesQuery, moreStoriesQueryByCategory } from "@/sanity/lib/queries";
import type { AllPostsQueryResult, MoreStoriesQueryResult } from "@/sanity.types";
import React from "react";
import { sanityFetch } from "@/sanity/lib/fetch";
import Link from "next/link";
import CoverImage from "../../cover-image";
import DateComponent from "../../date";
import Avatar from "../../avatar";

type PropsCategoryPage = {
    params: { locale: string, category: string};
  };


export default async function Page({params }: PropsCategoryPage) {

    const locale = params.locale
    const categoryParams = params.category
    
    const posts: AllPostsQueryResult[] = await sanityFetch<AllPostsQueryResult[]>({
      query: allPostsQuery
    });
 
    unstable_setRequestLocale(locale);
  
    const data = await sanityFetch<MoreStoriesQueryResult>({
      query: moreStoriesQueryByCategory,
      params,
    });
  
    return (
      <>
        <div className="gap-y-20 md:gap-x-16 md:gap-y-32 lg:gap-x-32 grid grid-cols-1 md:grid-cols-2 mb-32 container">
          {data?.filter(post => post.theme !== null && post.theme.slug === categoryParams).map((post:any) => {
            const { _id, title, slug, coverImage, excerpt, author, theme } = post;

            console.log("category on the rubrique page", categoryParams)

            if (!title ||!slug ||!coverImage) {
              return null;
            }
  
            const rubrique = theme.slug.name ? theme.slug.name : "actualite"
      
            return (
              <article key={_id}>
                <Link href={`/${locale ? locale : "fr"}/posts/${rubrique}/${slug}`} className="block mb-5 group">
                  <CoverImage image={coverImage} priority={false} percentWidth={'w-[80%]'}/>
                </Link>
                <h3 className="mb-3 text-3xl text-balance leading-snug">
                  <Link href={`/${locale}/posts/${rubrique}/${slug}`} className="hover:text-green-800">
                    {title}
                  </Link>
                </h3>
                <div className="mb-4 text-lg">
                  <DateComponent dateString={post.date} />
                </div>
                {excerpt && (
                  <p className="mb-4 text-lg text-pretty leading-relaxed">
                    {excerpt}
                  </p>
                )}
                {author && <Avatar name={author.name} picture={author.picture} />}
              </article>
            );
          })}
        </div>
      </>
    );
  }


