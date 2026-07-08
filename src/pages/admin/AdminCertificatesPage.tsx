import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSite } from '@/contexts/SiteContext';
import { Certificate } from '@/lib/siteData';
import { toast } from 'sonner';
import ImageCropUploadField from '@/components/admin/ImageCropUploadField';

export default function AdminCertificatesPage() {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    name: '', issuer: '', description: '', image: '', featured: false
  });


  const resetForm = () => {
    setFormData({ name: '', issuer: '', description: '', image: '', featured: false });
    setEditingCert(null);
  };

  const openEditDialog = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name, issuer: cert.issuer, description: cert.description,
      image: cert.image, featured: cert.featured
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) { toast.error('Please upload a certificate image.'); return; }
    if (editingCert) {
      updateCertificate({ ...formData, id: editingCert.id });
      toast.success('Certificate updated!');
    } else {
      addCertificate(formData);
      toast.success('Certificate added!');
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this certificate?')) {
      deleteCertificate(id);
      toast.success('Certificate deleted!');
    }
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Certificates Page</h1>
        <p className="text-muted-foreground">Manage certificates displayed on the Certificates page.</p>
      </div>


      <Tabs defaultValue="certificates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
        </TabsList>

        <TabsContent value="certificates" className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Featured certificates will appear at the top of the page.</p>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" />Add Certificate</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Certificate Name *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="ISO 9001" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Issuing Organization *</Label>
                    <Input value={formData.issuer} onChange={(e) => setFormData(p => ({ ...p, issuer: e.target.value }))} placeholder="ISO International" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Certificate description..." rows={3} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ImageCropUploadField
                      value={formData.image}
                      onChange={(value) => setFormData((prev) => ({ ...prev, image: value }))}
                      label="Certificate Image *"
                      cropTitle={editingCert ? `Crop ${editingCert.name} Image` : 'Crop Certificate Image'}
                      cropDescription="Use a portrait crop that keeps certificates readable in the grid and preview modal."
                      aspect={3 / 4}
                      outputWidth={1200}
                      outputHeight={1600}
                      previewAspectRatio={3 / 4}
                      previewContainerClassName="w-full max-w-[120px]"
                      helperText="The image will be resized for the certificate grid and preview."
                      previewClassName="border border-border rounded-md"
                      imageFit="contain"
                    />
                    <div className="flex items-end">
                      <div className="hidden" />

                    </div>
                  </div>
                  <Button type="submit" className="w-full">{editingCert ? 'Update Certificate' : 'Add Certificate'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {certificates.map((cert) => (
              <Card key={cert.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {cert.image && (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={cert.image} alt={cert.name} className="h-full w-full object-contain" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{cert.name}</h3>
                            {cert.featured && <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">Featured</span>}
                          </div>
                          <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{cert.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditDialog(cert)}><Edit2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(cert.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {certificates.length === 0 && (
              <Card><CardContent className="p-12 text-center"><p className="text-muted-foreground">No certificates added yet.</p></CardContent></Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-serif">Certificates Page Hero</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">The hero section uses a default design.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
