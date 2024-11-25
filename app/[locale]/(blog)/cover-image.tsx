import { Image } from "next-sanity/image";

import { urlForImage } from "@/sanity/lib/utils";

interface CoverImageProps {
  image: any;
  width: number;
  height: number;
  priority?: boolean;
  percentWidth?: string;
  imgClassNames?: string;
  wrapperClassNames?: string;
}

export default function CoverImage(props: Partial<CoverImageProps>) {
  const { wrapperClassNames, imgClassNames, image: source, priority, width, height,  percentWidth = "w-full"} = props;

  const image = source?.asset?._ref ? (
    <Image
      className={`w-full h-auto rounded ${imgClassNames || ""}`}
      width={width ? width : 2000}
      height={height ? height : 1000}
      alt={source?.alt || ""}
      src={urlForImage(source)?.height(height ? height : 1000).width(width ? width : 2000).url() as string}
      sizes="100vw"
      priority={priority}
    />
  ) : (
    <div className="bg-slate-50" style={{ paddingTop: "50%" }} />
  );

  return (
    <div className={`shadow-md group-hover:shadow-lg sm:mx-0 ${wrapperClassNames} transition-shadow duration-200`}>
      {image}
    </div>
  );
}





