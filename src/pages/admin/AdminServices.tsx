import { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { Service } from '@/lib/siteData';
import { toast } from 'sonner';

const iconOptions = [
  { value: 'map', label: 'Map' },
  { value: 'plane', label: 'Plane' },
  { value: 'building', label: 'Building' },
  { value: 'file-text', label: 'Document' },
  { value: 'shield', label: 'Shield' },
  { value: 'users', label: 'Users' },
];

export default function AdminServices() {
  const { services, addService, updateService, deleteService } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'map',
    image: '',
    featured: false
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', icon: 'map', image: '', featured: false });
    setEditingService(null);
  };

  const openEditDialog = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      icon: service.icon,
      image: service.image,
      featured: service.featured
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target?.result as string }));
      toast.success('Image uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.image) {
      toast.error('Please upload a service image.');
      return;
    }

    if (editingService) {
      updateService({ ...formData, id: editingService.id });
      toast.success('Service updated successfully!');
    } else {
      addService(formData);
      toast.success('Service added successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      deleteService(id);
      toast.success('Service deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Services</h1>
          <p className="text-muted-foreground">Manage your services. Featured services will appear on the homepage.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Freight Forwarding"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this service includes..."
                  rows={3}
                  required
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={formData.icon}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium">Featured on Homepage</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image-upload">Service Image *</Label>
                <div className="flex flex-col gap-3">
                  <label
                    htmlFor="image-upload"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </label>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Use JPG, PNG, or WebP up to 5MB. Image will be displayed on homepage.
                  </p>
                </div>
                {formData.image && (
                  <div className="overflow-hidden rounded-md border border-border">
                    <img
                      src={formData.image}
                      alt="Service preview"
                      className="h-40 w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
              </div>
              <Button type="submit" className="w-full">
                {editingService ? 'Update Service' : 'Add Service'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex gap-6">
                {service.image && (
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{service.name}</h3>
                        {service.featured && (
                          <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(service)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
