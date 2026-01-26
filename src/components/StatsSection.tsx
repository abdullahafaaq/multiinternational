const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '50K+', label: 'Happy Travelers' },
  { value: '100+', label: 'Destinations' },
  { value: '4.9', label: 'Customer Rating' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-serif text-4xl md:text-5xl font-bold text-accent mb-2">
                {stat.value}
              </p>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
