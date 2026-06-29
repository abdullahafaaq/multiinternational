import { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { Product } from '@/lib/siteData';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const { settings, products, addProduct, updateProduct, deleteProduct, updateSettings } = useSite();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    origin: '',
    unit: '',
    minOrderQuantity: '',
    pricePerUnit: 0,
    description: '',
    specifications: '',
    image: '',
    featured: false
  });
  const [newCategory, setNewCategory] = useState('');

  const resetForm = () => {
    setFormData({
      name: '', category: '', origin: '', unit: '', minOrderQuantity: '',
      pricePerUnit: 0, description: '', specifications: '', image: '', featured: false
    });
    setEditingProduct(null);
  };


  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category, origin: product.origin,
      unit: product.unit, minOrderQuantity: product.minOrderQuantity,
      pricePerUnit: product.pricePerUnit, description: product.description,
      specifications: product.specifications.join(', '),
      image: product.image, featured: product.featured
    });
    setIsDialogOpen(true);
  };

  const handleImageUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.'); return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB.'); return;
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
    const productData = {
      ...formData,
      specifications: formData.specifications.split(',').map(s => s.trim()).filter(Boolean)
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
    if (confirm('Delete this product?')) {
      deleteProduct(id);
      toast.success('Product deleted!');
    }
  };


  const handleAddCategory = () => {
    const category = newCategory.trim();
    if (!category) return;
    if (settings.productCategories.some(c => c.toLowerCase() === category.toLowerCase())) {
      toast.error('Category exists.'); return;
    }
    updateSettings({ ...settings, productCategories: [...settings.productCategories, category] });
    setNewCategory('');
    toast.success('Category added!');
  };


  const handleDeleteCategory = (category: string) => {
    if (settings.productCategories.length <= 1) {
      toast.error('At least one category required.'); return;
    }
    updateSettings({ ...settings, productCategories: settings.productCategories.filter(c => c !== category) });
    toast.success('Category deleted!');
  };


  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Products Page</h1>
        <p className="text-muted-foreground">Manage products and categories for the Products page and homepage.</p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" />Add Product</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-serif text-2xl">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label>Product Name *</Label>
                    <Input value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g., Premium Basmati Rice" required />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {settings.productCategories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Origin *</Label>
                      <Input value={formData.origin} onChange={(e) => setFormData(p => ({ ...p, origin: e.target.value }))} placeholder="e.g., India" required />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Unit *</Label>
                      <Input value={formData.unit} onChange={(e) => setFormData(p => ({ ...p, unit: e.target.value }))} placeholder="e.g., Metric Ton" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Min Order Qty *</Label>
                      <Input value={formData.minOrderQuantity} onChange={(e) => setFormData(p => ({ ...p, minOrderQuantity: e.target.value }))} placeholder="e.g., 20 MT" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Price Per Unit *</Label>
                      <Input type="number" value={formData.pricePerUnit} onChange={(e) => setFormData(p => ({ ...p, pricePerUnit: Number(e.target.value) }))} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description *</Label>
                    <Textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." rows={3} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Specifications (comma separated)</Label>
                    <Input value={formData.specifications} onChange={(e) => setFormData(p => ({ ...p, specifications: e.target.value }))} placeholder="e.g., Extra Long Grain, 2 Year Aged" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Product Image</Label>
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent w-fit">
                        <Upload className="h-4 w-4" />Upload Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e.target.files?.[0])} />
                      </label>
                      {formData.image && <img src={formData.image} alt="" className="h-32 w-full object-cover rounded-md mt-2" />}
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} className="rounded" />
                        <span className="text-sm font-medium">Show on Homepage</span>
                      </label>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">{editingProduct ? 'Update Product' : 'Add Product'}</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {products.map((product) => (
              <Card key={product.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        {product.featured && <span className="rounded-full bg-primary/20 px-2 py-1 text-xs font-medium text-primary flex items-center gap-1"><Star className="w-3 h-3" />Homepage</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEditDialog(product)}><Edit2 className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span><strong>Category:</strong> {product.category}</span>
                    <span><strong>Origin:</strong> {product.origin}</span>
                    <span><strong>Price:</strong> ${product.pricePerUnit}/{product.unit}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-serif">Product Categories</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" />
                <Button onClick={handleAddCategory}><Plus className="w-4 h-4" /></Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {settings.productCategories.map((cat) => (
                  <div key={cat} className="flex items-center gap-2 bg-muted px-3 py-2 rounded-lg">
                    <span className="text-sm">{cat}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteCategory(cat)}><Trash2 className="w-3 h-3 text-destructive" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
