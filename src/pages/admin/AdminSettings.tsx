import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useSite } from '@/contexts/SiteContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Plus, Trash2 } from 'lucide-react';
import { getAdminPassword, setAdminPassword } from '@/lib/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { HeroSlide } from '@/lib/siteData';

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
      heroSlides: [...prev.heroSlides, newSlide],
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

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate current password
    if (currentPassword !== getAdminPassword()) {
      toast.error('Current password is incorrect.');
      return;
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    
    // Validate confirmation
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }
    
    // Update password
    setAdminPassword(newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    toast.success('Password updated successfully!');
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
