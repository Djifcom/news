import Link from "next/link";

import Avatar from "./avatar";
import CoverImage from "./cover-image";
import DateComponent from "./date";

import type { MoreStoriesQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { moreStoriesQuery } from "@/sanity/lib/queries";

export default async function MoreStories(params: {
  skip: string;
  limit: number;
  locale: string;  
}) {

  const data = await sanityFetch<MoreStoriesQueryResult>({
    query: moreStoriesQuery,
    params,
  });

  const locale = params.locale;

  return (
    <>
      <div className="gap-y-20 md:gap-x-16 md:gap-y-32 lg:gap-x-32 grid grid-cols-1 md:grid-cols-2 mb-32">
        {data?.map((post:any) => {
          const { _id, title, slug, coverImage, excerpt, author, theme } = post;

          console.log("m ", post.theme.slug)


          if (!title ||!slug ||!coverImage) {
            return null;
          }

          if(post.theme.slug === "credits" || post.theme.slug === "qui-sommes-nous") {
            return null;
          }

          const rubrique = theme.slug ? theme.slug : "actualite"
    
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
