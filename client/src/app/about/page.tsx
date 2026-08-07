export default function AboutPage() {
  return (
    <div className="bg-white">
      <section className="bg-brand-700 px-4 py-14 text-center text-white">
        <h1 className="font-display text-4xl font-bold">About SKINAA Link</h1>
        <p className="mx-auto mt-3 max-w-xl text-brand-100">
          One short link that opens the right app store — or your website — for every visitor.
        </p>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            ['Fast', '302 redirects'],
            ['Smart', 'OS detection'],
            ['Tracked', 'Click analytics'],
            ['CMS', 'Blog included'],
          ].map(([k, v]) => (
            <div key={k} className="card p-4 text-center">
              <p className="font-display text-2xl font-bold text-brand-700">{k}</p>
              <p className="text-xs text-gray-500">{v}</p>
            </div>
          ))}
        </div>
        <div className="prose-blog mt-10">
          <p>
            SKINAA Link turns a single short URL into device-aware routing. Visitors on iPhone land
            in the App Store, Android users hit Google Play, and everyone else gets your desktop
            fallback page.
          </p>
          <p>
            Every click is recorded for analytics so you can see which platforms drive traffic —
            without slowing down the redirect.
          </p>
        </div>
      </div>
    </div>
  );
}
