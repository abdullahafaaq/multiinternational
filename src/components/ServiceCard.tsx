import { Map, Plane, Building, FileText, Shield, Users, LucideIcon } from 'lucide-react';
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
    <div className="group p-8 rounded-2xl bg-card card-elevated text-center">
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
  );
}
