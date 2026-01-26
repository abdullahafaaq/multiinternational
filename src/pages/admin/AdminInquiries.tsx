import { Trash2, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { Inquiry } from '@/lib/siteData';
import { toast } from 'sonner';

export default function AdminInquiries() {
  const { inquiries, packages, updateInquiryStatus, deleteInquiry } = useSite();

  const getPackageName = (packageId?: string) => {
    if (!packageId) return 'General Inquiry';
    const pkg = packages.find(p => p.id === packageId);
    return pkg?.name || 'Unknown Package';
  };

  const handleStatusChange = (id: string, status: Inquiry['status']) => {
    updateInquiryStatus(id, status);
    toast.success('Status updated!');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this inquiry?')) {
      deleteInquiry(id);
      toast.success('Inquiry deleted!');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Inquiries</h1>
        <p className="text-muted-foreground">Manage customer inquiries.</p>
      </div>

      {inquiries.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">
              No inquiries yet. They will appear here when customers contact you.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {inquiries.map((inquiry) => (
            <Card key={inquiry.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground text-lg">{inquiry.name}</h3>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${inquiry.status === 'new' ? 'bg-destructive/10 text-destructive' : ''}
                        ${inquiry.status === 'contacted' ? 'bg-accent/20 text-accent-foreground' : ''}
                        ${inquiry.status === 'resolved' ? 'bg-primary/10 text-primary' : ''}
                      `}>
                        {inquiry.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <a href={`mailto:${inquiry.email}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                        <Mail className="w-4 h-4" />
                        {inquiry.email}
                      </a>
                      {inquiry.phone && (
                        <a href={`tel:${inquiry.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Phone className="w-4 h-4" />
                          {inquiry.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Package:</span> {getPackageName(inquiry.packageId)}
                    </p>
                    <p className="text-foreground bg-muted/50 rounded-xl p-4">
                      {inquiry.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Received: {new Date(inquiry.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={inquiry.status}
                      onValueChange={(value: Inquiry['status']) => handleStatusChange(inquiry.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(inquiry.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
