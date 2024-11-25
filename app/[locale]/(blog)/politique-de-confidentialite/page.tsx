import { unstable_setRequestLocale } from "next-intl/server";

type PropsLegalPage = {
  params: { locale: string };
};

export default async function Page({params }: PropsLegalPage) {
    const locale = params.locale
    unstable_setRequestLocale(locale);
   
    return (
      <div className="mx-auto px-5 container">
            
      </div>
    );
  }