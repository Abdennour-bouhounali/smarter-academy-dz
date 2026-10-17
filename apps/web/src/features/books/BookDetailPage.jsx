import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useDocumentMeta } from '../../hooks/useDocumentMeta';
import { fetchBook } from './bookService';
import OrderForm from './OrderForm';
import ContactForm from './ContactForm';
import { S, formatDa } from './strings';

const H2 = ({ children }) => <h2 className="mb-8 text-center font-space text-3xl font-bold text-slate-900">{children}</h2>;

/**
 * `/books/:slug` — UNE page : présentation, commande, contact. Tout le contenu
 * (statistiques, étapes, points forts, FAQ, galerie) vient de la fiche du
 * livre : un nouveau livre n'exige aucun code.
 */
export default function BookDetailPage() {
  const { slug } = useParams();
  const [book, setBook] = useState(undefined); // undefined = chargement, null = introuvable
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    setBook(undefined);
    fetchBook(slug).then((d) => setBook(d.book)).catch(() => setBook(null));
  }, [slug]);

  useDocumentMeta(book?.title ?? S.list.metaTitle, book?.summary ?? undefined);

  if (book === undefined) return <div aria-busy="true" className="min-h-[60vh] pt-16" />;
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
    <div className="pt-16">
      {/* Présentation */}
      <section className="bg-gradient-to-b from-blue-50/60 to-transparent px-4 pb-16 pt-10">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <div>
            <Link to="/books" className="font-inter text-sm font-semibold text-blue-700 hover:underline">{S.detail.back}</Link>
            {c.badge && <p className="mt-4 inline-block rounded-full border border-blue-200 bg-white px-4 py-1.5 text-xs font-semibold text-blue-700">{c.badge}</p>}
            <h1 className="mt-3 font-space text-4xl font-bold leading-tight text-slate-900 lg:text-5xl">{book.title}</h1>
            {book.subtitle && <p className="mt-3 font-inter text-xl text-slate-600">{book.subtitle}</p>}
            {book.summary && <p className="mt-5 font-inter text-lg leading-loose text-slate-600">{book.summary}</p>}
            {book.author && <p className="mt-4 font-inter text-sm text-slate-500">{book.author}</p>}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span dir="ltr" className="font-space text-4xl font-bold text-blue-700">{formatDa(book.price)}</span>
              <a href="#order" className="rounded-2xl bg-blue-600 px-8 py-4 font-space text-lg font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700">{S.detail.orderCta}</a>
              <a href="#contact" className="rounded-2xl border border-slate-300 bg-white px-6 py-4 font-space text-base font-semibold text-slate-700 hover:bg-slate-50">{S.detail.contactCta}</a>
            </div>
          </div>
          <div className="flex justify-center">
            {/* `content.heroImage` (maquette 3D) prime sur la couverture à plat. */}
            {c.heroImage
              ? <img src={c.heroImage} alt={book.title} className="max-h-[560px] w-auto drop-shadow-2xl" />
              : book.coverImage && <img src={book.coverImage} alt={book.title} className="max-h-[520px] w-auto rounded-md shadow-2xl" />}
          </div>
        </div>
      </section>

      {/* Chiffres */}
      {c.stats?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {c.stats.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
                <p dir="ltr" className="font-space text-4xl font-bold text-blue-700">{s.number}</p>
                <p className="mt-1 font-space text-base font-bold text-slate-900">{s.title}</p>
                <p className="mt-1 font-inter text-sm text-slate-500">{s.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Points forts */}
      {c.highlights?.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14">
          <H2>{S.detail.highlightsTitle}</H2>
          <div className="grid gap-6 md:grid-cols-3">
            {c.highlights.map((h) => (
              <div key={h.title} className="rounded-3xl border border-slate-200 bg-white p-7">
                <h3 className="font-space text-xl font-bold text-slate-900">{h.title}</h3>
                <p className="mt-3 font-inter leading-loose text-slate-600">{h.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Étapes SMART */}
      {c.steps?.length > 0 && (
        <section className="bg-slate-900 px-4 py-16 text-white">
          <div className="mx-auto max-w-5xl">
            {/* Couleur EXPLICITE : index.css colore h1–h6, l'héritage du blanc ne suffit pas sur fond sombre. */}
            <h2 className="mb-10 text-center font-space text-3xl font-bold text-white">{S.detail.stepsTitle}</h2>
            <ol className="grid gap-4 md:grid-cols-5">
              {c.steps.map((st) => (
                <li key={st.letter} className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
                  <span dir="ltr" className="font-space text-4xl font-bold text-blue-400">{st.letter}</span>
                  <h3 className="mt-2 font-space text-base font-bold text-white">{st.title}</h3>
                  <p className="mt-2 font-inter text-sm leading-relaxed text-slate-300">{st.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Galerie */}
      {book.gallery?.length > 1 && (
        <section className="mx-auto max-w-6xl px-4 py-16">
          <H2>{S.detail.galleryTitle}</H2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {book.gallery.map((src) => (
              <img key={src} src={src} alt="" loading="lazy" className="aspect-[3/4] w-full rounded-2xl border border-slate-200 bg-white object-cover shadow-sm" />
            ))}
          </div>
        </section>
      )}

      {/* Commande */}
      <section id="order" className="scroll-mt-24 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <H2>{S.detail.orderTitle}</H2>
          <ol className="mb-8 grid gap-3 md:grid-cols-3">
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
        <section className="mx-auto max-w-3xl px-4 py-16">
          <H2>{S.detail.faqTitle}</H2>
          <div className="space-y-3">
            {c.faq.map((item, i) => (
              <div key={item.question} className="rounded-2xl border border-slate-200 bg-white">
                <button type="button" aria-expanded={openFaq === i} onClick={() => setOpenFaq(openFaq === i ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-5 text-start font-space text-lg font-bold text-slate-900">
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
      <section id="contact" className="scroll-mt-24 bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <H2>{S.detail.contactTitle}</H2>
          <p className="-mt-4 mb-8 text-center font-inter text-slate-600">{S.detail.contactSubtitle}</p>
          <ContactForm bookSlug={book.slug} />
        </div>
      </section>
    </div>
  );
}
