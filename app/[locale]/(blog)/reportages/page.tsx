import { unstable_setRequestLocale } from "next-intl/server";
import React from "react";

type PropsReportagesPage = {
    params: { locale: string };
  };

export default async function Page({params }: PropsReportagesPage) {
    const locale = params.locale
    unstable_setRequestLocale(locale);
  
    return (
      <div className="mx-auto px-5 container">
              <div className="flex flex-col justify-center items-center mb-5 w-full">
                <h2 className="border-3 bg-gray-50 mb-8 px-8 py-2 border border-t-4 border-t-black border-teal-900 rounded-b-md font-bold text-3xl md:text-5xl leading-tight tracking-tighter">
                    Nos reportages
                </h2>
                <p className="font-bold text-lg md:text-xl leading-tight tracking-tighter">Nos reportages sont une section à venir. Nous y travaillons.</p>
            </div>
      </div>
    );
  }
  