import { Map, Plane, Building, FileText, Shield, Users, LucideIcon, Star } from 'lucide-react';
import { Service } from '@/lib/siteData';

const iconMap: Record<string, LucideIcon> = {
  'map': Map,
  'plane': Plane,
  'building': Building,
  'file-text': FileText,
  'shield': Shield,
  'users': Users,
};

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Map;

  return (
    <div className="group rounded-2xl bg-card card-elevated overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Image Section */}
      {service.image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={service.image}
            alt={service.name}
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {service.featured && (
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow-md">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div className="p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
          <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
        </div>
        <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
          {service.name}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {service.description}
        </p>
      </div>
    </div>
  );
}
