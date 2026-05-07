import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Plus, Trash2, Upload } from 'lucide-react';
import { updateAdminPassword } from '@/lib/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { defaultProductCategories, type HeroSlide } from '@/lib/siteData';

const CTA_ROUTE_OPTIONS = [
  { value: 'none', label: 'No button' },
  { value: '/products', label: 'Products page' },
  { value: '/services', label: 'Services page' },
  { value: '/about', label: 'About page' },
  { value: '/contact', label: 'Contact page' },
];

export default function AdminSettings() {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState(settings);
  const [newCategory, setNewCategory] = useState('');
  const [newFooterRegion, setNewFooterRegion] = useState('');
  
  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleSlideChange = <K extends keyof HeroSlide>(slideId: string, key: K, value: HeroSlide[K]) => {
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
      toast.error('Hero image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleSlideChange(slideId, 'backgroundImage', event.target?.result as string);
      toast.success('Hero image uploaded successfully.');
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
    toast.success('Settings saved successfully!');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    
    // Validate confirmation
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      await updateAdminPassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to update password.');
    }
  };

  const handleAddCategory = () => {
    const category = newCategory.trim();
    if (!category) return;

    if (formData.productCategories.some((item) => item.toLowerCase() === category.toLowerCase())) {
      toast.error('That category already exists.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      productCategories: [...prev.productCategories, category],
    }));
    setNewCategory('');
  };

  const handleDeleteCategory = (category: string) => {
    if (formData.productCategories.length <= 1) {
      toast.error('At least one product category is required.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      productCategories: prev.productCategories.filter(item => item !== category),
    }));
  };

  const handleAddFooterRegion = () => {
    const region = newFooterRegion.trim();
    if (!region) return;

    setFormData(prev => ({
      ...prev,
      footerRegions: [...prev.footerRegions, region],
    }));
    setNewFooterRegion('');
  };

  const handleDeleteFooterRegion = (regionIndex: number) => {
    setFormData(prev => ({
      ...prev,
      footerRegions: prev.footerRegions.filter((_, index) => index !== regionIndex),
    }));
  };

  const handleTeamMemberChange = (memberId: string, key: 'name' | 'title' | 'image', value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member) => (
        member.id === memberId ? { ...member, [key]: value } : member
      )),
    }));
  };

  const handleTeamMemberImageUpload = (memberId: string, file: File | undefined) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Founder image must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      handleTeamMemberChange(memberId, 'image', event.target?.result as string);
      toast.success('Founder image uploaded successfully.');
    };
    reader.readAsDataURL(file);
  };

  const handleAddTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          id: `team-${Date.now()}`,
          name: 'New Team Member',
          title: 'Job Title',
          image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=700&q=80',
        },
      ],
    }));
  };

  const handleDeleteTeamMember = (memberId: string) => {
    if (formData.teamMembers.length <= 1) {
      toast.error('At least one team member is required.');
      return;
    }

    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((member) => member.id !== memberId),
    }));
  };

  const handleTestimonialChange = (testimonialId: string, key: 'name' | 'role' | 'content', value: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).map((testimonial) =>
        testimonial.id === testimonialId ? { ...testimonial, [key]: value } : testimonial
      ),
    }));
  };

  const handleAddTestimonial = () => {
    setFormData(prev => ({
      ...prev,
      testimonials: [
        ...(prev.testimonials || []),
        {
          id: `testimonial-${Date.now()}`,
          name: 'New Client',
          role: 'Client Role',
          content: 'Share your experience with our service here...',
        },
      ],
    }));
  };

  const handleDeleteTestimonial = (testimonialId: string) => {
    setFormData(prev => ({
      ...prev,
      testimonials: (prev.testimonials || []).filter((t) => t.id !== testimonialId),
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your website settings.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Branding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              id="tagline"
              label="Tagline"
              value={formData.tagline}
              placeholder="Enter tagline"
              onChange={(value) => setFormData(prev => ({ ...prev, tagline: value }))}
            />
          </CardContent>
        </Card>

        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Hero Slider</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.heroSlides.map((slide, index) => (
              <div key={slide.id} className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Slide {index + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSlide(slide.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`background-${slide.id}`}>Background Image URL</Label>
                  <Input
                    id={`background-${slide.id}`}
                    value={slide.backgroundImage}
                    onChange={(e) => handleSlideChange(slide.id, 'backgroundImage', e.target.value)}
                    placeholder="https://..."
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Label
                      htmlFor={`background-upload-${slide.id}`}
                      className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Image
                    </Label>
                    <Input
                      id={`background-upload-${slide.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleSlideImageUpload(slide.id, e.target.files?.[0])}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use JPG, PNG, or WebP up to 5MB.
                    </p>
                  </div>
                  {slide.backgroundImage && (
                    <div className="overflow-hidden rounded-md border border-border">
                      <img
                        src={slide.backgroundImage}
                        alt={`Slide ${index + 1} preview`}
                        className="h-40 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  )}
                </div>

                <RichTextEditor
                  id={`badge-${slide.id}`}
                  label="Badge"
                  value={slide.badge}
                  placeholder="Enter top badge text"
                  onChange={(value) => handleSlideChange(slide.id, 'badge', value)}
                />

                <RichTextEditor
                  id={`title-${slide.id}`}
                  label="Title"
                  value={slide.title}
                  placeholder="Enter hero title"
                  onChange={(value) => handleSlideChange(slide.id, 'title', value)}
                />

                <RichTextEditor
                  id={`subtitle-${slide.id}`}
                  label="Subtitle"
                  value={slide.subtitle}
                  placeholder="Enter hero subtitle"
                  onChange={(value) => handleSlideChange(slide.id, 'subtitle', value)}
                />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary CTA Destination</Label>
                    <Select
                      value={slide.primaryCtaPath || 'none'}
                      onValueChange={(value) => handleSlideChange(slide.id, 'primaryCtaPath', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {CTA_ROUTE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <RichTextEditor
                    id={`primary-label-${slide.id}`}
                    label="Primary CTA Label"
                    value={slide.primaryCtaLabel}
                    placeholder="e.g. View Products"
                    onChange={(value) => handleSlideChange(slide.id, 'primaryCtaLabel', value)}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Secondary CTA Destination</Label>
                    <Select
                      value={slide.secondaryCtaPath || 'none'}
                      onValueChange={(value) => handleSlideChange(slide.id, 'secondaryCtaPath', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {CTA_ROUTE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <RichTextEditor
                    id={`secondary-label-${slide.id}`}
                    label="Secondary CTA Label"
                    value={slide.secondaryCtaLabel}
                    placeholder="e.g. Contact Us"
                    onChange={(value) => handleSlideChange(slide.id, 'secondaryCtaLabel', value)}
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={handleAddSlide}>
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <RichTextEditor
                id="email"
                label="Email"
                value={formData.email}
                placeholder="Enter email"
                onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
              />
              <RichTextEditor
                id="phone"
                label="Phone"
                value={formData.phone}
                placeholder="Enter phone"
                onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
              />
            </div>
            <RichTextEditor
              id="address"
              label="Address"
              value={formData.address}
              placeholder="Enter address"
              onChange={(value) => setFormData(prev => ({ ...prev, address: value }))}
            />
            <RichTextEditor
              id="address2"
              label="Address 2"
              value={formData.address2}
              placeholder="Enter second address"
              onChange={(value) => setFormData(prev => ({ ...prev, address2: value }))}
            />
          </CardContent>
        </Card>

        {/* Product Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Product Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add a new category"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={handleAddCategory}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(formData.productCategories?.length ? formData.productCategories : defaultProductCategories).map((category) => (
                <div
                  key={category}
                  className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <span>{category}</span>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    onClick={() => handleDeleteCategory(category)}
                    aria-label={`Remove ${category}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Footer Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              id="footerDescription"
              label="Footer Description"
              value={formData.footerDescription}
              placeholder="Enter footer description"
              onChange={(value) => setFormData(prev => ({ ...prev, footerDescription: value }))}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <RichTextEditor
                id="footerQuickLinksTitle"
                label="Quick Links Title"
                value={formData.footerQuickLinksTitle}
                placeholder="Quick Links"
                onChange={(value) => setFormData(prev => ({ ...prev, footerQuickLinksTitle: value }))}
              />
              <RichTextEditor
                id="footerRegionsTitle"
                label="Regions Column Title"
                value={formData.footerRegionsTitle}
                placeholder="Trade Regions"
                onChange={(value) => setFormData(prev => ({ ...prev, footerRegionsTitle: value }))}
              />
            </div>

            <div className="space-y-3">
              <Label>Footer Regions</Label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  value={newFooterRegion}
                  onChange={(e) => setNewFooterRegion(e.target.value)}
                  placeholder="Add a footer region"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFooterRegion();
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={handleAddFooterRegion}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Region
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.footerRegions.map((region, index) => (
                  <div
                    key={`${region}-${index}`}
                    className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    <span>{region}</span>
                    <button
                      type="button"
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      onClick={() => handleDeleteFooterRegion(index)}
                      aria-label={`Remove ${region}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <RichTextEditor
                id="footerCopyright"
                label="Copyright Text"
                value={formData.footerCopyright}
                placeholder="Company copyright text"
                onChange={(value) => setFormData(prev => ({ ...prev, footerCopyright: value }))}
              />
              <RichTextEditor
                id="footerWebsite"
                label="Website Text"
                value={formData.footerWebsite}
                placeholder="www.example.com"
                onChange={(value) => setFormData(prev => ({ ...prev, footerWebsite: value }))}
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  value={formData.facebookUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                  placeholder="https://linkedin.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, twitterUrl: e.target.value }))}
                  placeholder="https://x.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Founders */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Founders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Manage the founders displayed on the homepage and About page.
            </p>

            <div className="space-y-4">
              {formData.teamMembers.map((member, index) => (
                <div key={member.id} className="rounded-lg border border-border p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">Member {index + 1}</h3>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteTeamMember(member.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`team-name-${member.id}`}>Name</Label>
                      <Input
                        id={`team-name-${member.id}`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                        placeholder="Enter member name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`team-title-${member.id}`}>Title</Label>
                      <Input
                        id={`team-title-${member.id}`}
                        value={member.title}
                        onChange={(e) => handleTeamMemberChange(member.id, 'title', e.target.value)}
                        placeholder="Enter member title"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor={`team-image-${member.id}`}>Founder Image URL</Label>
                        <Input
                          id={`team-image-${member.id}`}
                          value={member.image}
                          onChange={(e) => handleTeamMemberChange(member.id, 'image', e.target.value)}
                          placeholder="https://..."
                        />
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Label
                          htmlFor={`team-image-upload-${member.id}`}
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Founder Image
                        </Label>
                        <Input
                          id={`team-image-upload-${member.id}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleTeamMemberImageUpload(member.id, e.target.files?.[0])}
                        />
                        <p className="text-xs text-muted-foreground">JPG, PNG, or WebP up to 5MB.</p>
                      </div>
                    </div>
                    <div className="overflow-hidden rounded-md border border-border bg-muted">
                      <img
                        src={member.image}
                        alt={`${member.name} preview`}
                        className="h-40 w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button type="button" variant="secondary" onClick={handleAddTeamMember}>
              <Plus className="w-4 h-4 mr-2" />
              Add Founder
            </Button>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">About Section</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              id="aboutText"
              label="About Text"
              value={formData.aboutText}
              placeholder="Enter about section text"
              onChange={(value) => setFormData(prev => ({ ...prev, aboutText: value }))}
            />
          </CardContent>
        </Card>

        {/* Testimonials */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Client Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(formData.testimonials || []).map((testimonial, index) => (
              <div key={testimonial.id} className="rounded-lg border border-border p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Testimonial {index + 1}</h3>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteTestimonial(testimonial.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-name-${testimonial.id}`}>Client Name</Label>
                    <Input
                      id={`testimonial-name-${testimonial.id}`}
                      value={testimonial.name}
                      onChange={(e) => handleTestimonialChange(testimonial.id, 'name', e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`testimonial-role-${testimonial.id}`}>Client Role/Position</Label>
                    <Input
                      id={`testimonial-role-${testimonial.id}`}
                      value={testimonial.role}
                      onChange={(e) => handleTestimonialChange(testimonial.id, 'role', e.target.value)}
                      placeholder="Engineering Manager"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`testimonial-content-${testimonial.id}`}>Testimonial Content</Label>
                  <textarea
                    id={`testimonial-content-${testimonial.id}`}
                    value={testimonial.content}
                    onChange={(e) => handleTestimonialChange(testimonial.id, 'content', e.target.value)}
                    placeholder="Share your experience..."
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            ))}

            <Button type="button" variant="secondary" onClick={handleAddTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full md:w-auto">
          Save Changes
        </Button>
      </form>

      {/* Password Change Section */}
      <form onSubmit={handlePasswordChange} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Admin Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Password must be at least 6 characters long.
            </p>
            
            <Button 
              type="submit" 
              variant="secondary"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              Update Password
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
