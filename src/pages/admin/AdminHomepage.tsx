import { useState } from 'react';
import { Plus, Edit2, Trash2, Upload, ArrowRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSite } from '@/contexts/SiteContext';
import { HeroSlide } from '@/lib/siteData';
import { toast } from 'sonner';

const CTA_ROUTE_OPTIONS = [
  { value: 'none', label: 'No button' },
  { value: '/products', label: 'Products page' },
  { value: '/services', label: 'Services page' },
  { value: '/about', label: 'About page' },
  { value: '/contact', label: 'Contact page' },
];

export default function AdminHomepage() {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState(settings);

  useState(() => {
    setFormData(settings);
  });


  const handleSlideChange = (slideId: string, key: keyof HeroSlide, value: string) => {
    setFormData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.map(slide =>
        slide.id === slideId ? { ...slide, [key]: value } : slide
      ),
    }));
  };


  const handleSlideImageUpload = (slideId: string, file: File | undefined) => {
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
      handleSlideChange(slideId, 'backgroundImage', event.target?.result as string);
      toast.success('Image uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddSlide = () => {
    const newSlide: HeroSlide = {
      id: `slide-${Date.now()}`,
      badge: 'New Slide',
      title: 'New Hero Title',
      subtitle: 'Add your slide description here.',
      backgroundImage: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920',
      primaryCtaLabel: 'View Products',
      primaryCtaPath: '/products',
      secondaryCtaLabel: 'Contact Us',
      secondaryCtaPath: '/contact',
    };
    setFormData(prev => ({
      ...prev,
      heroSlides: [...(prev.heroSlides || []), newSlide],
    }));
  };


  const handleDeleteSlide = (slideId: string) => {
    if (formData.heroSlides.length <= 1) {
      toast.error('At least one hero slide is required.');
      return;
    }
    setFormData(prev => ({
      ...prev,
      heroSlides: prev.heroSlides.filter(slide => slide.id !== slideId),
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('Homepage settings saved successfully!');
  };

  const handleTestimonialChange = (testimonialId: string, key: 'name' | 'role' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials?.map(t =>
        t.id === testimonialId ? { ...t, [key]: value } : t
      ),
    }));
  };

  const handleAddTestimonial = () => {
    const newTestimonial = {
      id: `testimonial-${Date.now()}`,
      name: 'New Client',
      role: 'Client',
      content: 'Share your experience...',
    };
    setFormData(prev => ({
      ...prev,
      testimonials: [...(prev.testimonials || []), newTestimonial],
    }));
  };


  const handleDeleteTestimonial = (testimonialId: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: prev.testimonials?.filter(t => t.id !== testimonialId),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Homepage Content</h1>
        <p className="text-muted-foreground">Manage all content sections displayed on the homepage.</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="products">Featured Products</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Hero Section Tab */}
        <TabsContent value="hero" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Hero Slides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.heroSlides?.map((slide, index) => (
                <div key={slide.id} className="border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Slide {index + 1}</h3>
                    {formData.heroSlides.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSlide(slide.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Badge Text</Label>
                      <Input
                        value={slide.badge}
                        onChange={(e) => handleSlideChange(slide.id, 'badge', e.target.value)}
                        placeholder="e.g., Your Global Trade Partner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={slide.title}
                        onChange={(e) => handleSlideChange(slide.id, 'title', e.target.value)}
                        placeholder="Hero slide title"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Subtitle / Description</Label>
                    <Textarea
                      value={slide.subtitle}
                      onChange={(e) => handleSlideChange(slide.id, 'subtitle', e.target.value)}
                      placeholder="Hero slide subtitle text"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Background Image</Label>
                    <div className="flex flex-col gap-3">
                      <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground w-fit">
                        <Upload className="h-4 w-4" />
                        Upload Image
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSlideImageUpload(slide.id, e.target.files?.[0])}
                        />
                      </label>
                      {slide.backgroundImage && (
                        <img src={slide.backgroundImage} alt="" className="h-40 w-full object-cover rounded-md" />
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Primary Button Label</Label>
                      <Input
                        value={slide.primaryCtaLabel}
                        onChange={(e) => handleSlideChange(slide.id, 'primaryCtaLabel', e.target.value)}
                        placeholder="View Products"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Primary Button Link</Label>
                      <Select
                        value={slide.primaryCtaPath}
                        onValueChange={(value) => handleSlideChange(slide.id, 'primaryCtaPath', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CTA_ROUTE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Secondary Button Label</Label>
                      <Input
                        value={slide.secondaryCtaLabel}
                        onChange={(e) => handleSlideChange(slide.id, 'secondaryCtaLabel', e.target.value)}
                        placeholder="Learn About Us"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Button Link</Label>
                      <Select
                        value={slide.secondaryCtaPath}
                        onValueChange={(value) => handleSlideChange(slide.id, 'secondaryCtaPath', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CTA_ROUTE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddSlide} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Slide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section Tab */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Services Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Services displayed on the homepage are managed in the <a href="/admin/services" className="text-primary underline">Services Page</a> section.
                Toggle which services appear on the homepage using the "Featured" option.
              </p>
              <Button type="button" variant="outline" onClick={() => window.open('/admin/services', '_blank')}>
                Go to Services Management
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Section Tab */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Statistics Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Stats displayed on the homepage. Configure global stats in Settings.
              </p>
              <Button type="button" variant="outline" onClick={() => window.open('/admin/settings', '_blank')}>
                Go to Global Settings
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Section Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Featured Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Products displayed on the homepage are managed in the <a href="/admin/products" className="text-primary underline">Products Page</a> section.
                Toggle which products appear on the homepage using the "Featured" option.
              </p>
              <Button type="button" variant="outline" onClick={() => window.open('/admin/products', '_blank')}>
                Go to Products Management
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-serif">Testimonials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {(formData.testimonials || []).map((testimonial) => (
                <div key={testimonial.id} className="border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTestimonial(testimonial.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input
                        value={testimonial.name}
                        onChange={(e) => handleTestimonialChange(testimonial.id, 'name', e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Role/Position</Label>
                      <Input
                        value={testimonial.role}
                        onChange={(e) => handleTestimonialChange(testimonial.id, 'role', e.target.value)}
                        placeholder="Engineering Manager"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Testimonial Content</Label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => handleTestimonialChange(testimonial.id, 'content', e.target.value)}
                      placeholder="Share your experience..."
                      className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={handleAddTestimonial} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Button type="submit" size="lg" className="w-full md:w-auto">
        Save Changes
      </Button>
    </form>
  );
}
