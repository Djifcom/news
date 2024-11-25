import type { Metadata, ResolvingMetadata } from "next";
import { groq, type PortableTextBlock } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { urlForImage } from "@/sanity/lib/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

import Avatar from "../../../avatar";
import CoverImage from "../../../cover-image";
import DateComponent from "../../../date";
import MoreStories from "../../../more-stories";
import {PortableText} from '@portabletext/react'

import { Carousel } from "flowbite-react";

import Image from 'next/image'

import type {
  PostQueryResult,
  PostSlugsResult,
  SettingsQueryResult,
} from "@/sanity.types";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import { postQuery, settingsQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

// Import the unstable_setRequestLocale function
import { unstable_setRequestLocale } from 'next-intl/server';

type Props = {
  params: { slug: string, locale: string };
};

const postSlugs = groq`*[_type == "post"]{slug}`;

export async function generateStaticParams() {
  const params = await sanityFetch<PostSlugsResult>({
    query: postSlugs,
    perspective: "published",
    stega: false,
  });
  return params.map(({ slug }) => ({ slug: slug?.current }));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const post = await sanityFetch<PostQueryResult>({
    query: postQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params }: Props) {
  
  const locale = params.locale || 'fr'; 
  unstable_setRequestLocale(locale);  

  const [post, settings] = await Promise.all([
    sanityFetch<PostQueryResult>({
      query: postQuery,
      params,
    }),
    sanityFetch<SettingsQueryResult>({
      query: settingsQuery,
    }),
  ]);
  
  if (!post?._id) {
    return notFound();
  }

  return (
    <div className="mx-auto px-5 container">
      <article className="flex flex-col items-center">
        <h1 className="mb-12 font-bold text-3xl text-balance text-center md:text-6xl leading-tight md:leading-none tracking-tighter">
          {post.title}
        </h1>
        <div className="md:block hidden md:mb-12">
          {post.author && (
            <Avatar name={post.author.name} picture={post.author.picture} />
          )}
        </div>
        {post.coverImage ?
        (<div className="flex flex-col items-center mx-auto 1sm:mx-0 mb-8 md:mb-16 max-w-2xl">
          <CoverImage image={post.coverImage} percentWidth="w-[65%]" priority />
          {post.coverImage.legend ?<p className="my-2 text-sm text-gray-500">{post.coverImage.legend} </p>:null}
        </div>):null}
        <div className="mx-auto max-w-2xl">
          <div className="block md:hidden mb-6">
            {post.author && (
              <Avatar name={post.author.name} picture={post.author.picture} />
            )}
          </div>
          <div className="mb-6 text-lg">
            <div className="mb-4 text-lg">
              <DateComponent dateString={post.date} />
            </div>
          </div>
        </div>
        <div className={`${post?.imageFirst || post?.imageSecond ? "flex flex-col items-center lg:grid lg:grid-cols-5 gap-x-10" : "mx-auto max-w-2xl flex flex-col items-center"}`}>
          <div className="col-span-3 row-start-1">
          {post.content?.length && (
            <PortableText
              value={post.content as PortableTextBlock[]}
            />
          )}
          </div>
          <div className="col-span-2 grid lg:grid-rows-[repeat(2,1fr)] gap-5 items-center">
            <div className="h-auto flex flex-col row-start-1">
              {post?.imageFirst ?
                <div className="w-[80%]">
                  <CoverImage image={post?.imageFirst} width={100} height={100} imgClassNames={"object-cover aspect-square"} priority />
                  {post.imageFirst.legend ?<p className="my-2 text-sm text-gray-500">{post.imageFirst.legend} </p>:null}
                </div>  
            : null}
            </div>
            <div className="h-auto flex flex-col row-start-2">
              {post?.imageSecond ?
                <div className="w-[80%]">
                  <CoverImage image={post?.imageSecond} width={100} height={100} imgClassNames={"object-cover aspect-square"} priority />
                  {post.imageSecond.legend ?<p className="my-2 text-sm text-gray-500">{post.imageSecond.legend} </p>:null}
                </div>  
            : null}
            </div>
          </div>
        </div>

      {post.images && post.images.length > 0 ?
      (<div className="px-5 w-full h-56 sm:h-64 xl:h-80 2xl:h-96">
        <div className="my-5">
          <h3 className="text-center text-xl text-gray-700 font-bold">En savoir plus en image&nbsp;: </h3>
        </div>
        <Carousel pauseOnHover>
          {post.images?.map(image => (
            <div key={image._key} className="">
                <div className="relative flex flex-col h-full items-center justify-center bg-gray-400 dark:bg-gray-700 dark:text-white">
                  {image.legend ?
                  <div className="absolute flex flex-col justify-center items-center -top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full h-full bg-transparent">
                    <div className="p-5 w-1/2 h-[400px] -translate-x-1/2 z-10">
                      <p className="my-2 text-sm text-gray-500 text-left bg-[rgba(255,255,255,0.9)] rounded px-8 py-4">{image.legend}</p>
                    </div>
                  </div>
                  :null}
                  <CoverImage image={image} width={100} height={100} imgClassNames={"object-cover aspect-square"} priority />
                </div>
            
            </div>
          ))}
        </Carousel>
      </div>):null}
    
      </article>

      <aside>
        <hr className="border-accent-2 mt-28 mb-24" />
        <h2 className="mb-8 font-bold text-3xl md:text-4xl leading-tight tracking-tighter">
          Articles récents
        </h2>
        <Suspense>
          <MoreStories skip={post._id} limit={2} locale={locale} />
        </Suspense>
      </aside>
    </div>
  );
}
