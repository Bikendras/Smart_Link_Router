import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: '$0',
    desc: 'Perfect for demos and personal projects',
    features: ['Unlimited smart links', 'OS-based redirects', 'Basic analytics', 'Blog CMS'],
  },
  {
    name: 'Professional',
    price: '$10',
    desc: 'For indie developers and marketers',
    features: ['Everything in Free', 'Longer retention', 'Priority support', 'Custom branding notes'],
    highlight: true,
  },
  {
    name: 'Team',
    price: '$25',
    desc: 'For growing product teams',
    features: ['Everything in Pro', 'Team seats (demo)', 'Shared link library', 'Export-ready stats'],
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="bg-brand-700 px-4 py-14 text-center text-white">
        <h1 className="font-display text-4xl font-bold">Pricing</h1>
        <p className="mt-3 text-brand-100">Simple plans for individuals and teams.</p>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card flex flex-col p-6 ${plan.highlight ? 'ring-2 ring-brand-500' : ''}`}
          >
            <h2 className="font-display text-xl font-bold text-brand-900">{plan.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
            <p className="mt-4 font-display text-3xl font-bold text-brand-700">
              {plan.price}
              <span className="text-sm font-normal text-gray-400">/mo</span>
            </p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-gray-600">
              {plan.features.map((f) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>
            <Link href="/dashboard/signup" className="btn-primary mt-6 w-full">
              Get started
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
