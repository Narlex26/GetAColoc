interface Stat {
  value: string;
  label: string;
}

const stats: Stat[] = [
  { value: '2.4k', label: 'Profils inscrits' },
  { value: '340', label: 'Groupes actifs' },
  { value: '87%', label: 'Taux de match' },
];

export default function StatsSection() {
  return (
    <section className="bg-dark-blue py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto lg:max-w-2xl">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg border border-white border-opacity-10 bg-gray-500 bg-opacity-10 p-6 text-center"
            >
              <div className="text-2xl sm:text-3xl font-syne font-black text-orange-400">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white text-opacity-80 font-syne font-medium mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
