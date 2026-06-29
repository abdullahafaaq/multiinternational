import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';

export default function AdminContactPage() {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState(settings);
  const [offices, setOffices] = useState([
    { name: 'Canada', address: '60 Agnes Street Mississauga, ON' },
    { name: 'Pakistan', address: 'UG-21 Lucky Center, 7-8 Jail Road, Lahore' },
    { name: 'Australia', address: '3851 Hills Avenue, Kojonup' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Contact page settings saved!');
  };

  const addOffice = () => {
    setOffices([...offices, { name: 'New Office', address: '' }]);
  };

  const updateOffice = (index: number, key: 'name' | 'address', value: string) => {
    setOffices(offices.map((o, i) => i === index ? { ...o, [key]: value } : o));
  };

  const removeOffice = (index: number) => {
    setOffices(offices.filter((_, i) => i !== index));
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Contact Page</h1>
        <p className="text-muted-foreground">Manage contact information and office locations.</p>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="offices">Office Locations</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-serif">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} placeholder="info@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" value={formData.phone || ''} onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Primary Address</Label>
                <Textarea id="address" value={formData.address || ''} onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))} placeholder="Street address..." rows={2} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Secondary Address</Label>
                <Textarea id="address2" value={formData.address2 || ''} onChange={(e) => setFormData(p => ({ ...p, address2: e.target.value }))} placeholder="Additional address info..." rows={2} />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook URL</Label>
                  <Input id="facebook" value={formData.facebookUrl || ''} onChange={(e) => setFormData(p => ({ ...p, facebookUrl: e.target.value }))} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" value={formData.linkedinUrl || ''} onChange={(e) => setFormData(p => ({ ...p, linkedinUrl: e.target.value }))} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input id="twitter" value={formData.twitterUrl || ''} onChange={(e) => setFormData(p => ({ ...p, twitterUrl: e.target.value }))} placeholder="https://twitter.com/..." />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Office Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {offices.map((office, index) => (
                <div key={index} className="border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Office {index + 1}</h3>
                    {offices.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeOffice(index)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Office Name/Country</Label>
                      <Input value={office.name} onChange={(e) => updateOffice(index, 'name', e.target.value)} placeholder="e.g., Pakistan Office" />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input value={office.address} onChange={(e) => updateOffice(index, 'address', e.target.value)} placeholder="Full address..." />
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addOffice} className="w-full">
                <Plus className="w-4 h-4 mr-2" />Add Office
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" size="lg">Save Changes</Button>
    </form>
  );
}
