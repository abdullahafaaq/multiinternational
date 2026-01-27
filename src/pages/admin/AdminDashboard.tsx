import { Package, Briefcase, MessageSquare, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSite } from '@/contexts/SiteContext';

export default function AdminDashboard() {
  const { products, services, inquiries } = useSite();
  
  const newInquiries = inquiries.filter(i => i.status === 'new').length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: Package,
      color: 'bg-primary/10 text-primary'
    },
    {
      title: 'Services',
      value: services.length,
      icon: Briefcase,
      color: 'bg-accent/20 text-accent-foreground'
    },
    {
      title: 'New Inquiries',
      value: newInquiries,
      icon: MessageSquare,
      color: 'bg-destructive/10 text-destructive'
    },
    {
      title: 'Total Inquiries',
      value: inquiries.length,
      icon: TrendingUp,
      color: 'bg-primary/10 text-primary'
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the Multi International admin panel.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No inquiries yet. They will appear here when customers contact you.
            </p>
          ) : (
            <div className="space-y-4">
              {inquiries.slice(0, 5).map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium text-foreground">{inquiry.name}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${inquiry.status === 'new' ? 'bg-destructive/10 text-destructive' : ''}
                      ${inquiry.status === 'contacted' ? 'bg-accent/20 text-accent-foreground' : ''}
                      ${inquiry.status === 'resolved' ? 'bg-primary/10 text-primary' : ''}
                    `}>
                      {inquiry.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
