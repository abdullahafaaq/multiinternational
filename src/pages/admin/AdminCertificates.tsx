import { useEffect, useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Star, Upload, Link, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSite } from '@/contexts/SiteContext';
import { Certificate } from '@/lib/siteData';
import { toast } from 'sonner';

const isCustomUrl = (image: string) => image.startsWith('http') || image.startsWith('data:');

export default function AdminCertificates() {
  const { certificates, addCertificate, updateCertificate, deleteCertificate } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    description: '',
    image: 'https://images.unsplash.com/photo-1634129522528-74ff31e2b27c?w=400',
    featured: false
  });
  const [imageMode, setImageMode] = useState<'url' | 'upload'>('url');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      issuer: '',
      description: '',
      certificateUrl: '',
      image: 'https://images.unsplash.com/photo-1634129522528-74ff31e2b27c?w=400',
      featured: false
    });
    setEditingCert(null);
    setImageMode('url');
    setCustomImageUrl('');
  };

  const [previewImage, setPreviewImage] = useState<null | { image: string; name: string }>(null);

  const openEditDialog = (cert: Certificate) => {
    setEditingCert(cert);
    const isCustom = isCustomUrl(cert.image);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      description: cert.description,
      certificateUrl: cert.certificateUrl,
      image: cert.image,
      featured: cert.featured
    });
    if (isCustom) {
      setImageMode('url');
      setCustomImageUrl(cert.image);
    } else {
      setImageMode('url');
      setCustomImageUrl('');
    }
    setIsDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCustomImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.issuer.trim() || !formData.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const imageUrl = imageMode === 'url' ? customImageUrl || formData.image : customImageUrl;

    if (editingCert) {
      updateCertificate({
        ...formData,
        id: editingCert.id,
        image: imageUrl
      });
      toast.success('Certificate updated successfully');
    } else {
      addCertificate({
        ...formData,
        image: imageUrl
      });
      toast.success('Certificate added successfully');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this certificate?')) {
      deleteCertificate(id);
      toast.success('Certificate deleted successfully');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Certificates</h1>
          <p className="text-muted-foreground">Manage your certifications and qualifications</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="gold-gradient text-accent-foreground font-semibold gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Certificate
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Certificate Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., ISO 9001:2015"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Issuer */}
              <div className="space-y-2">
                <Label htmlFor="issuer" className="text-sm font-medium">
                  Issuing Authority *
                </Label>
                <Input
                  id="issuer"
                  placeholder="e.g., International Organization for Standardization"
                  value={formData.issuer}
                  onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this certificate represents and why it's important..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Certificate URL */}

              {/* Image Tabs */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Certificate Image</Label>
                <Tabs value={imageMode} onValueChange={(val) => setImageMode(val as 'url' | 'upload')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="url" className="gap-2">
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      Upload
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="url" className="space-y-3 mt-4">
                    <Input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={customImageUrl || formData.image}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                    />
                    {(customImageUrl || formData.image) && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={customImageUrl || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="upload" className="space-y-3 mt-4">
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-medium text-muted-foreground">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleFileUpload(e as React.ChangeEvent<HTMLInputElement>);
                        setImageMode('upload');
                      }}
                    />
                    {customImageUrl && (
                      <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={customImageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Featured</Label>
                  <p className="text-xs text-muted-foreground">
                    Display prominently on the certificates page
                  </p>
                </div>
                <Switch
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, featured: checked }))
                  }
                />
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gold-gradient text-accent-foreground font-semibold"
                >
                  {editingCert ? 'Update Certificate' : 'Add Certificate'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.length === 0 ? (
          <Card className="md:col-span-2 lg:col-span-3">
            <CardContent className="pt-12 pb-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Image className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif text-lg font-bold text-foreground mb-2">
                No Certificates Yet
              </h3>
              <p className="text-muted-foreground">
                Add your first certificate to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              {/* Certificate Image */}
                  <button onClick={() => setPreviewImage({ image: cert.image, name: cert.name })} className="relative h-40 overflow-hidden bg-muted w-full text-left">
                    <img
                      src={cert.image}
                      alt={cert.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {cert.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-2">
                        <Star className="w-4 h-4 fill-current" />
                      </div>
                    )}
                  </button>

              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-foreground line-clamp-1">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-primary font-medium">
                    {cert.issuer}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {cert.description}
                </p>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1"
                    onClick={() => openEditDialog(cert)}
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-1 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(cert.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(v) => { if (!v) setPreviewImage(null); }}>
        <DialogContent className="max-w-4xl p-0">
          <DialogHeader>
            <DialogTitle>{previewImage?.name}</DialogTitle>
          </DialogHeader>
          {previewImage && (
            <div className="w-full">
              <img src={previewImage.image} alt={previewImage.name} className="w-full h-[70vh] object-contain bg-black" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
