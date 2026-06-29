import { useState } from 'react';
import { Plus, Edit2, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useSite } from '@/contexts/SiteContext';
import { TeamMember } from '@/lib/siteData';
import { toast } from 'sonner';
import { RichTextEditor } from '@/components/ui/rich-text-editor';

export default function AdminAboutPage() {
  const { settings, updateSettings } = useSite();
  const [formData, setFormData] = useState(settings);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [memberForm, setMemberForm] = useState({ name: '', title: '', image: '' });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    toast.success('About page settings saved!');
  };

  const openEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setMemberForm({ name: member.name, title: member.title, image: member.image });
    setIsMemberDialogOpen(true);
  };

  const handleMemberImageUpload = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be less than 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = (event) => {
      setMemberForm(prev => ({ ...prev, image: event.target?.result as string }));
      toast.success('Image uploaded!');
    };
    reader.readAsDataURL(file);
  };

  const handleMemberSubmit = () => {
    if (!memberForm.name || !memberForm.title) {
      toast.error('Name and title are required.'); return;
    }
    if (editingMember) {
      setFormData(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map(m => m.id === editingMember.id ? { ...m, ...memberForm } : m)
      }));
      toast.success('Member updated!');
    } else {
      const newMember: TeamMember = { ...memberForm, id: `member-${Date.now()}` };
      setFormData(prev => ({ ...prev, teamMembers: [...(prev.teamMembers || []), newMember] }));
      toast.success('Member added!');
    }
    setIsMemberDialogOpen(false);
    setMemberForm({ name: '', title: '', image: '' });
    setEditingMember(null);
  };


  const handleDeleteMember = (id: string) => {
    setFormData(prev => ({ ...prev, teamMembers: prev.teamMembers.filter(m => m.id !== id) }));
    toast.success('Member deleted!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">About Page</h1>
        <p className="text-muted-foreground">Manage all content sections displayed on the About page.</p>
      </div>

      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="about">About Text</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
        </TabsList>


        <TabsContent value="about" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-serif">About Section</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="aboutText">About Company Text</Label>
                <RichTextEditor
                  value={formData.aboutText || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, aboutText: value }))}
                  placeholder="Enter company description..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <div className="flex justify-end">
            <Dialog open={isMemberDialogOpen} onOpenChange={(open) => { setIsMemberDialogOpen(open); if (!open) { setEditingMember(null); setMemberForm({ name: '', title: '', image: '' }); } }}>
              <DialogTrigger asChild>
                <Button className="gap-2"><Plus className="w-4 h-4" />Add Team Member</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif">{editingMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input value={memberForm.name} onChange={(e) => setMemberForm(p => ({ ...p, name: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label>Title/Position *</Label>
                    <Input value={memberForm.title} onChange={(e) => setMemberForm(p => ({ ...p, title: e.target.value }))} placeholder="CEO" />
                  </div>
                  <div className="space-y-2">
                    <Label>Photo</Label>
                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm hover:bg-accent w-fit">
                      <Upload className="h-4 w-4" />Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleMemberImageUpload(e.target.files?.[0])} />
                    </label>
                    {memberForm.image && <img src={memberForm.image} alt="" className="h-32 w-full object-cover rounded-md" />}
                  </div>
                  <Button type="button" onClick={handleMemberSubmit} className="w-full">
                    {editingMember ? 'Update' : 'Add Member'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>


          <div className="grid gap-4">
            {(formData.teamMembers || []).map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex gap-6">
                    {member.image && (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
                        <img src={member.image} alt={member.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditMember(member)}><Edit2 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteMember(member.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-serif">Statistics</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Stats are configured in the global Settings page.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      <Button type="submit" size="lg">Save Changes</Button>
    </form>
  );
}
