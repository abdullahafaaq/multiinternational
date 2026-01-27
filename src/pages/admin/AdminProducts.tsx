import { useState, useRef } from 'react';
import { Plus, Edit2, Trash2, Star, Upload, Link, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSite } from '@/contexts/SiteContext';
import { Product } from '@/lib/siteData';
import { toast } from 'sonner';

const categoryOptions = [
  'Agricultural Products',
  'Industrial Machinery',
  'Textiles & Garments',
  'Chemicals',
  'Electronics',
  'Raw Materials',
  'Consumer Goods',
  'Other'
];

const presetImageOptions = [
  { value: 'rice', label: 'Rice/Grains' },
  { value: 'coffee', label: 'Coffee/Beverages' },
  { value: 'machinery', label: 'Machinery' },
  { value: 'textiles', label: 'Textiles' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'electronics', label: 'Electronics' },
];

const isCustomUrl = (image: string) => image.startsWith('http') || image.startsWith('data:');

export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Agricultural Products',
    origin: '',
    unit: 'Metric Ton',
    minOrderQuantity: '',
    pricePerUnit: 0,
    description: '',
    specifications: '',
    image: 'rice',
    featured: false
  });
  const [imageMode, setImageMode] = useState<'preset' | 'url' | 'upload'>('preset');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFormData({
      name: '',
      category: 'Agricultural Products',
      origin: '',
      unit: 'Metric Ton',
      minOrderQuantity: '',
      pricePerUnit: 0,
      description: '',
      specifications: '',
      image: 'rice',
      featured: false
    });
    setEditingProduct(null);
    setImageMode('preset');
    setCustomImageUrl('');
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    const isCustom = isCustomUrl(product.image);
    setFormData({
      name: product.name,
      category: product.category,
      origin: product.origin,
      unit: product.unit,
      minOrderQuantity: product.minOrderQuantity,
      pricePerUnit: product.pricePerUnit,
      description: product.description,
      specifications: product.specifications.join(', '),
      image: product.image,
      featured: product.featured
    });
    if (isCustom) {
      setImageMode('url');
      setCustomImageUrl(product.image);
    } else {
      setImageMode('preset');
      setCustomImageUrl('');
    }
    setIsDialogOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setFormData(prev => ({ ...prev, image: base64 }));
      toast.success('Image uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine the final image value based on mode
    let finalImage = formData.image;
    if (imageMode === 'url' && customImageUrl) {
      finalImage = customImageUrl;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      origin: formData.origin,
      unit: formData.unit,
      minOrderQuantity: formData.minOrderQuantity,
      pricePerUnit: formData.pricePerUnit,
      description: formData.description,
      specifications: formData.specifications.split(',').map(s => s.trim()).filter(Boolean),
      image: finalImage,
      featured: formData.featured
    };

    if (editingProduct) {
      updateProduct({ ...productData, id: editingProduct.id });
      toast.success('Product updated successfully!');
    } else {
      addProduct(productData);
      toast.success('Product added successfully!');
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted successfully!');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Premium Basmati Rice"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origin Country</Label>
                  <Input
                    id="origin"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    placeholder="India"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={formData.unit}
                    onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="Metric Ton"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moq">Min. Order Quantity</Label>
                  <Input
                    id="moq"
                    value={formData.minOrderQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, minOrderQuantity: e.target.value }))}
                    placeholder="20 MT"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price per Unit (USD)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData(prev => ({ ...prev, pricePerUnit: parseInt(e.target.value) }))}
                    placeholder="1200"
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
                  placeholder="Describe the product..."
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications (comma separated)</Label>
                <Input
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, specifications: e.target.value }))}
                  placeholder="Extra Long Grain, 2 Year Aged, 1% Broken Max"
                />
              </div>
              <div className="space-y-4">
                <Label>Product Image</Label>
                <Tabs value={imageMode} onValueChange={(v) => setImageMode(v as 'preset' | 'url' | 'upload')}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preset" className="gap-2">
                      <Image className="w-4 h-4" />
                      Preset
                    </TabsTrigger>
                    <TabsTrigger value="url" className="gap-2">
                      <Link className="w-4 h-4" />
                      URL
                    </TabsTrigger>
                    <TabsTrigger value="upload" className="gap-2">
                      <Upload className="w-4 h-4" />
                      Upload
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preset" className="mt-4">
                    <Select
                      value={isCustomUrl(formData.image) ? 'rice' : formData.image}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, image: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {presetImageOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                  
                  <TabsContent value="url" className="mt-4 space-y-3">
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={customImageUrl}
                      onChange={(e) => setCustomImageUrl(e.target.value)}
                    />
                    {customImageUrl && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img 
                          src={customImageUrl} 
                          alt="Preview" 
                          className="w-full h-32 object-cover"
                          onError={(e) => (e.currentTarget.src = '/placeholder.svg')}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="upload" className="mt-4 space-y-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image File
                    </Button>
                    {formData.image.startsWith('data:') && (
                      <div className="rounded-lg overflow-hidden border border-border">
                        <img 
                          src={formData.image} 
                          alt="Uploaded preview" 
                          className="w-full h-32 object-cover"
                        />
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Max 5MB. Stored locally in browser.
                    </p>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Featured</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <span className="text-sm text-muted-foreground">
                    Show on homepage
                  </span>
                </div>
              </div>
              <Button type="submit" className="w-full">
                {editingProduct ? 'Update Product' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Products List */}
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {product.featured && (
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Star className="w-5 h-5 text-accent" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • {product.origin} • ${product.pricePerUnit.toLocaleString()}/{product.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
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
