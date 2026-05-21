export default function About() {
  const features = [
    {
      icon: "🔥",
      title: "Made Fresh Daily",
      desc: "Every takoyaki is cooked to order in authentic Osaka-style iron pans at 400°F.",
    },
    {
      icon: "🐙",
      title: "Premium Octopus",
      desc: "We source wild-caught octopus from sustainable fisheries off the coast of Japan.",
    },
    {
      icon: "👨‍🍳",
      title: "Master Chefs",
      desc: "Our chefs trained in Osaka bring decades of combined takoyaki expertise.",
    },
    {
      icon: "⚡",
      title: "Fast Delivery",
      desc: "Hot, crispy takoyaki delivered to your door in 25-35 minutes, guaranteed.",
    },
  ];

  return (
    <section id="about" className="relative overflow-hidden bg-slate-900 py-20 text-white sm:py-28">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 top-10 h-96 w-96 rounded-full bg-red-500 blur-3xl"></div>
        <div className="absolute -right-20 bottom-10 h-96 w-96 rounded-full bg-orange-500 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <div className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-400">Our Story</div>
          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            A taste of Osaka,
            <br />
            <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              delivered to you.
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Founded in 2019 by Chef Takeshi Yamamoto, Takoyaki Mini Store brings the soul of
            Osaka's street food culture to your neighborhood. Every ball is a tribute to the
            Dotonbori vendors who perfected this dish over generations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl bg-white/5 p-6 ring-1 ring-white/10 backdrop-blur transition hover:bg-white/10"
            >
              <div className="mb-4 text-5xl">{f.icon}</div>
              <h3 className="mb-2 text-lg font-black">{f.title}</h3>
              <p className="text-sm text-slate-300">{f.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-8 rounded-3xl bg-gradient-to-br from-red-600 to-orange-500 p-8 text-white sm:grid-cols-3 sm:p-12">
          <div className="text-center">
            <div className="text-4xl font-black sm:text-5xl">25-35</div>
            <div className="text-sm opacity-90">Minutes Delivery</div>
          </div>
          <div className="text-center border-y border-white/20 py-4 sm:border-y-0 sm:border-x sm:py-0">
            <div className="text-4xl font-black sm:text-5xl">2019</div>
            <div className="text-sm opacity-90">Established</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-black sm:text-5xl">Fresh</div>
            <div className="text-sm opacity-90">Made to Order</div>
          </div>
        </div>
      </div>
    </section>
  );
}
