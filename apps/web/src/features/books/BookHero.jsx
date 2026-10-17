import { ShieldCheck, PhoneCall, Truck } from 'lucide-react';
import { S, formatDa } from './strings';

const TRUST_ICONS = [ShieldCheck, PhoneCall, Truck];

/**
 * LE PREMIER ÉCRAN de la fiche d'un livre — celui qui décide de l'achat.
 *
 * Rendu deux fois, À L'IDENTIQUE : par React (BookDetailPage) et, au build, en
 * HTML statique (vite-plugin-share-pages.js › renderToStaticMarkup) pour que la
 * page d'achat s'affiche avant même le JavaScript. Il doit donc rester PUR :
 * aucun hook, aucun contexte, aucun routeur (le lien « كل الكتب » est un
 * composant passé en prop — `Link` dans l'application, `<a>` au build).
 *
 * Pensé d'abord pour le TÉLÉPHONE (le lien arrive par WhatsApp) : sur petit
 * écran l'image vient en premier mais compacte, puis titre, prix, bouton pleine
 * largeur et trois garanties — tout l'essentiel tient au-dessus du pli.
 */
export default function BookHero({ book, LinkComponent = 'a' }) {
  const c = book.content ?? {};
  const image = c.heroImage || book.coverImage;
  const backProps = LinkComponent === 'a' ? { href: '/books' } : { to: '/books' };
  return (
    <section className="bg-gradient-to-b from-blue-50/60 to-transparent px-4 pb-10 pt-4 md:pb-16 md:pt-10">
      <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-12">
        {/* Colonne en `flex-col` : sur téléphone, le résumé et l'auteur passent APRÈS
            le prix, le bouton et les garanties (`order-last`) — l'achat d'abord, au-dessus
            du pli ; dès `md`, l'ordre classique revient. */}
        <div className="flex flex-col items-start">
          <LinkComponent {...backProps} className="font-inter text-sm font-semibold text-blue-700 hover:underline">{S.detail.back}</LinkComponent>
          {c.badge && <p className="mt-3 inline-block rounded-full border border-blue-200 bg-white px-3 py-1 text-xs font-semibold text-blue-700 sm:mt-4 sm:px-4 sm:py-1.5">{c.badge}</p>}
          <h1 className="mt-3 font-space text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">{book.title}</h1>
          {book.subtitle && <p className="mt-2 font-inter text-lg text-slate-600 sm:mt-3 sm:text-xl">{book.subtitle}</p>}
          {book.summary && <p className="order-last mt-5 font-inter text-base leading-loose text-slate-600 md:order-none sm:text-lg">{book.summary}</p>}
          {book.author && <p className="order-last mt-3 font-inter text-sm text-slate-500 md:order-none sm:mt-4">{book.author}</p>}

          <div className="mt-6 flex items-baseline gap-2 sm:mt-8">
            <span dir="ltr" className="font-space text-4xl font-bold text-blue-700">{formatDa(book.price)}</span>
            <span className="font-inter text-sm text-slate-500">{S.detail.perCopy}</span>
          </div>
          <div className="mt-4 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a id="book-hero-cta" href="#order" className="rounded-2xl bg-blue-600 px-8 py-4 text-center font-space text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700">{S.detail.orderCta}</a>
            <a href="#contact" className="rounded-2xl border border-slate-300 bg-white px-6 py-3.5 text-center font-space text-base font-semibold text-slate-700 hover:bg-slate-50">{S.detail.contactCta}</a>
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
            {S.detail.trust.map((label, i) => {
              const Icon = TRUST_ICONS[i] ?? ShieldCheck;
              return (
                <li key={label} className="inline-flex items-center gap-1.5 font-inter text-sm font-medium text-slate-600">
                  <Icon size={16} className="flex-none text-emerald-600" aria-hidden="true" />
                  {label}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Hauteur RÉSERVÉE avant l'arrivée de l'image (aucun saut de mise en page) ;
            compacte et EN PREMIER sur téléphone, à côté du texte dès `md`. */}
        <div className="order-first flex h-[200px] items-center justify-center sm:h-[320px] md:order-none md:h-[420px] lg:h-[540px]">
          {image && (
            <img
              src={image}
              alt={book.title}
              fetchpriority="high"
              decoding="async"
              className={`max-h-full max-w-full w-auto object-contain ${c.heroImage ? 'drop-shadow-2xl' : 'rounded-md shadow-2xl'}`}
            />
          )}
        </div>
      </div>
    </section>
  );
}
