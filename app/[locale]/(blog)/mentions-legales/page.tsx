import { unstable_setRequestLocale } from "next-intl/server";

type PropsLegalPage = {
  params: { locale: string };
};

export default async function Page({params }: PropsLegalPage) {
    const locale = params.locale
    unstable_setRequestLocale(locale);
   
    return (
      <div className="mx-auto px-5 container">
      <div className="bg-white shadow-md mx-auto my-5 p-6 rounded-lg max-w-4xl">
        <h1 className="mb-4 font-bold text-3xl text-gray-800">Mentions Légales</h1>
        
        <section className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">Éditeur du site</h2>
          <p className="text-gray-600">
            <strong>DJIF Communication</strong>, société de [objet social si besoin est], est une société [forme sociale] au capital social de [nombre] [devise], dont le siège social est situé au 
            <span className="inline not-italic">[indiquer l'addresse] au Togo</span>.
            <br />Elle est immatriculée au Registre du Commerce et des Sociétés de [ville] sous le numéro [].
          </p>
          <p className="mt-2 text-gray-600">
            Téléphone : <a href="tel:+" className="text-blue-500 hover:underline">+[numéro de téléphone]</a>
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">Directeur de la publication</h2>
          <p className="text-gray-600">Monsieur Koffi Djifa AZANLI</p>
          <a href="mailto:">[transmettre un email professionnel ici]</a>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">Hébergement</h2>
          <p className="text-gray-600">
            Ce site est hébergé par la société <strong>Vercel Inc.</strong>, située 340 S Lemon Ave #4133 Walnut, CA 91789, et joignable au (559) 288-7060. 
            Accéder à la société d'hebergement ici : <a href="https://vercel.com/">https://vercel.com/</a>.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">Garantie et sécurité</h2>
          <p className="text-gray-600">
            Le contenu de ce site est édité sous réserve d&apos;erreurs techniques et/ou typographiques, avec des photos non contractuelles. 
            <br />La société <strong>Djif Communication</strong> ne saurait être tenue responsable quant à l&apos;exactitude des informations mises à disposition des utilisateurs accédant au site.
            <br />En outre,  Djif Communication ne peut garantir que son fonctionnement sera exempt d&apos;interruptions ou d&apos;erreurs.
            <br />Le concepteur du site ou la personne physique ou morale qui fait la maintenance technique n&apos;intervient pas dans la rédaction du contenu (articles, opinions...) via le backoffice et ne saurait être tenu responsable du contenu qu'il n'a pas édité. 
          </p>
        </section>

        <section className="mb-6">
          <h2 className="mb-2 font-semibold text-gray-700 text-xl">Droits de reproduction</h2>
          <p className="text-gray-600">
            Tous les droits de reproduction sont réservés, y compris pour les documents iconographiques et photographiques.
          </p>
        </section>
      </div>
    </div>
  );
  }