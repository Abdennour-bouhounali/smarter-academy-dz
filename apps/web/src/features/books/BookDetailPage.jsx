import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { loadBook, peekBook, removeStaticBookShell } from './bookCache';
import BookHero from './BookHero';
import StickyOrderBar from './StickyOrderBar';
import OrderForm from './OrderForm';
import ContactForm from './ContactForm';
import { S, formatDa } from './strings';

/** La forme de la présentation pendant le chargement (même hauteur, aucun saut). */
function BookDetailSkeleton() {
  return (
    <div aria-busy="true" className="min-h-screen pt-16">
      <section className="bg-gradient-to-b from-blue-50/60 to-transparent px-4 pb-10 pt-4 md:pb-16 md:pt-10">
        <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-2 md:gap-12">
          <div className="space-y-5">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200/70" />
            <div className="h-12 w-4/5 animate-pulse rounded-lg bg-slate-200/70" />
            <div className="h-6 w-3/5 animate-pulse rounded bg-slate-200/70" />
            <div className="h-24 animate-pulse rounded-lg bg-slate-200/50" />
            <div className="h-14 w-2/3 animate-pulse rounded-2xl bg-slate-200/70" />
          </div>
          <div className="order-first flex h-[200px] items-center justify-center sm:h-[320px] md:order-none md:h-[420px] lg:h-[540px]">
            <div className="h-full w-3/5 animate-pulse rounded-xl bg-slate-200/60" />
          </div>
        </div>
      </section>
    </div>
  );
}

const H2 = ({ children }) => <h2 className="mb-6 text-center font-space text-2xl font-bold text-slate-900 sm:mb-8 sm:text-3xl">{children}</h2>;

/**
 * `/books/:slug` — UNE page : présentation, commande, contact. Tout le contenu
 * (statistiques, étapes, points forts, FAQ, galerie) vient de la fiche du
 * livre : un nouveau livre n'exige aucun code.
 */
export default function BookDetailPage() {
  const { slug } = useParams();
  // undefined = chargement, null = introuvable. Une fiche déjà reçue (préchargée
  // au survol de sa carte, ou déjà vue) s'affiche tout de suite (bookCache.js).
  const [book, setBook] = useState(() => peekBook(slug)?.book);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    let alive = true;
    setBook(peekBook(slug)?.book);
    loadBook(slug).then((d) => alive && setBook(d.book)).catch(() => alive && setBook(null));
    return () => { alive = false; };
  }, [slug]);

  useDocumentMeta(book?.title ?? S.list.metaTitle, book?.summary ?? undefined);

  // La vraie fiche est à l'écran (ou le livre n'existe pas) : le premier écran
  // HTML posé par le build au-dessus de #root n'a plus de raison d'être.
  useEffect(() => { if (book !== undefined) removeStaticBookShell(); }, [book]);

  if (book === undefined) return <BookDetailSkeleton />;
  if (book === null) {
    return (
      <div className="px-4 pb-24 pt-32 text-center">
        <p className="font-inter text-lg text-slate-600">{S.detail.notFound}</p>
        <Link to="/books" className="mt-4 inline-block font-semibold text-blue-700 hover:underline">{S.detail.back}</Link>
      </div>
    );
  }

  const c = book.content ?? {};

  return (
    // pb-24 sous lg : la barre de commande collée ne cache jamais la fin de la page.
    <div className="pb-24 pt-16 lg:pb-0">
      <BookHero book={book} LinkComponent={Link} />

      {/* Chiffres */}
      {c.stats?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {c.stats.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-4 text-center sm:p-5">
                <p dir="ltr" className="font-space text-3xl font-bold text-blue-700 sm:text-4xl">{s.number}</p>
                <p className="mt-1 font-space text-base font-bold text-slate-900">{s.title}</p>
                <p className="mt-1 font-inter text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Points forts */}
      {c.highlights?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <H2>{S.detail.highlightsTitle}</H2>
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {c.highlights.map((h) => (
              <div key={h.title} className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7">
                <h3 className="font-space text-xl font-bold text-slate-900">{h.title}</h3>
                <p className="mt-3 font-inter leading-loose text-slate-600">{h.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Étapes SMART */}
      {c.steps?.length > 0 && (
        <section className="bg-slate-900 px-4 py-12 text-white sm:py-16">
          <div className="mx-auto max-w-5xl">
            {/* Couleur EXPLICITE : index.css colore h1–h6, l'héritage du blanc ne suffit pas sur fond sombre. */}
            <h2 className="mb-8 text-center font-space text-2xl font-bold text-white sm:mb-10 sm:text-3xl">{S.detail.stepsTitle}</h2>
            {/* Téléphone : la lettre À CÔTÉ du texte (cinq cartes compactes, pas cinq écrans). */}
            <ol className="grid gap-3 sm:gap-4 md:grid-cols-5">
              {c.steps.map((st) => (
                <li key={st.letter} className="flex gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10 sm:p-5 md:block">
                  <span dir="ltr" className="flex-none font-space text-3xl font-bold text-blue-400 sm:text-4xl">{st.letter}</span>
                  <div>
                    <h3 className="font-space text-base font-bold text-white md:mt-2">{st.title}</h3>
                    <p className="mt-1 font-inter text-sm leading-relaxed text-slate-300 md:mt-2">{st.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Galerie */}
      {book.gallery?.length > 1 && (
        <section className="mx-auto max-w-6xl py-10 sm:px-4 sm:py-16">
          <H2>{S.detail.galleryTitle}</H2>
          {/* Téléphone : un carrousel qu'on fait glisser du pouce (une page à la fois),
              au lieu de quatre rangées de grandes images à faire défiler. */}
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-4">
            {book.gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" decoding="async" className="aspect-[3/4] w-[72%] flex-none snap-center rounded-2xl border border-slate-200 bg-white object-cover shadow-sm sm:w-full" />
            ))}
          </div>
        </section>
      )}

      {/* Commande */}
      <section id="order" className="scroll-mt-20 bg-slate-50 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <H2>{S.detail.orderTitle}</H2>
          <ol className="mb-6 grid gap-3 sm:mb-8 md:grid-cols-3">
            {S.detail.steps.map((step, i) => (
              <li key={step} className="flex items-start gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-600 font-space text-sm font-bold text-white">{i + 1}</span>
                <span className="font-inter text-sm leading-relaxed text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <OrderForm book={book} />
        </div>
      </section>

      {/* FAQ */}
      {c.faq?.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
          <H2>{S.detail.faqTitle}</H2>
          <div className="space-y-3">
            {c.faq.map((item, i) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white">
                <button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-4 text-start font-space text-base font-bold text-slate-900 sm:p-5 sm:text-lg">
                  {item.question}
                  <ChevronDown size={18} className={`flex-none transition ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && <p className="px-5 pb-5 font-inter leading-loose text-slate-600">{item.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="scroll-mt-20 bg-slate-50 px-4 py-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <H2>{S.detail.contactTitle}</H2>
          <p className="-mt-4 mb-8 text-center font-inter text-slate-600">{S.detail.contactSubtitle}</p>
          <ContactForm bookSlug={book.slug} />
        </div>
      </section>

      <StickyOrderBar book={book} />
    </div>
  );
}
