import { useState } from 'react';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { TravelPackage } from '@/lib/siteData';
import { toast } from 'sonner';

const imageOptions = [
  { value: 'maldives', label: 'Maldives' },
  { value: 'santorini', label: 'Santorini, Greece' },
  { value: 'swiss-alps', label: 'Swiss Alps' },
  { value: 'bali', label: 'Bali' },
  { value: 'dubai', label: 'Dubai' },
  { value: 'machu-picchu', label: 'Machu Picchu' },
];

export default function AdminPackages() {
  const { packages, addPackage, updatePackage, deletePackage } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TravelPackage | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    duration: '',
    price: 0,
    description: '',
    highlights: '',
    image: 'maldives',
    featured: false
  });

  const resetForm = () => {
    setFormData({
      name: '',
      destination: '',
      duration: '',
      price: 0,
      description: '',
      highlights: '',
      image: 'maldives',
      featured: false
    });
    setEditingPackage(null);
  };

  const openEditDialog = (pkg: TravelPackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      destination: pkg.destination,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description,
      highlights: pkg.highlights.join(', '),
      image: pkg.image,
      featured: pkg.featured
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const packageData = {
      name: formData.name,
      destination: formData.destination,
      duration: formData.duration,
      price: formData.price,
      description: formData.description,
      highlights: formData.highlights.split(',').map(h => h.trim()).filter(Boolean),
      image: formData.image,
      featured: formData.featured
    };

    if (editingPackage) {
      updatePackage({ ...packageData, id: editingPackage.id });
      toast.success('Package updated successfully!');
    } else {
      addPackage(packageData);
      toast.success('Package added successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this package?')) {
      deletePackage(id);
      toast.success('Package deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Packages</h1>
          <p className="text-muted-foreground">Manage your travel packages.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingPackage ? 'Edit Package' : 'Add New Package'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Maldives Paradise Escape"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    placeholder="Maldives"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="7 Days / 6 Nights"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: parseInt(e.target.value) }))}
                    placeholder="2999"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the package..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="highlights">Highlights (comma separated)</Label>
                <Input
                  id="highlights"
                  value={formData.highlights}
                  onChange={(e) => setFormData(prev => ({ ...prev, highlights: e.target.value }))}
                  placeholder="Overwater Villa, All-Inclusive Dining, Sunset Cruise"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Image</Label>
                  <Select
                    value={formData.image}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {imageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Featured</Label>
                  <div className="flex items-center gap-2 pt-2">
                    <Switch
                      checked={formData.featured}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                    />
                    <span className="text-sm text-muted-foreground">
                      Show on homepage
                    </span>
                  </div>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingPackage ? 'Update Package' : 'Add Package'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Packages List */}
      <div className="grid gap-4">
        {packages.map((pkg) => (
          <Card key={pkg.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {pkg.featured && (
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {pkg.destination} • {pkg.duration} • ${pkg.price.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(pkg)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(pkg.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
