import { useRef, useState } from 'react';
import { AlertTriangle, Download, HardDrive, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminBackupRestorePage() {
  const backupFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDownloadingBackup, setIsDownloadingBackup] = useState(false);
  const [isRestoringBackup, setIsRestoringBackup] = useState(false);

  const handleDownloadBackup = async () => {
    setIsDownloadingBackup(true);

    try {
      const response = await fetch('/api/admin/database-backup');

      if (!response.ok) {
        throw new Error(`Failed to download backup: ${response.status}`);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
      const filename = filenameMatch?.[1] || `multiinternational-backup-${new Date().toISOString().slice(0, 10)}.sqlite`;
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);

      toast.success('Backup downloaded successfully.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to download backup.');
    } finally {
      setIsDownloadingBackup(false);
    }
  };

  const handleRestoreBackupClick = () => {
    backupFileInputRef.current?.click();
  };

  const handleRestoreBackupFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) return;

    if (!window.confirm('Restoring a backup will replace the current site data. Continue?')) {
      return;
    }

    setIsRestoringBackup(true);

    try {
      const response = await fetch('/api/admin/database-backup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-sqlite3',
        },
        body: await file.arrayBuffer(),
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null);
        throw new Error(errorPayload?.error || `Failed to restore backup: ${response.status}`);
      }

      toast.success('Backup restored. Reloading data...');
      window.setTimeout(() => window.location.reload(), 900);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to restore backup.');
    } finally {
      setIsRestoringBackup(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Backup & Restore</h1>
        <p className="text-muted-foreground">
          Download a full database backup or restore one when you need to recover site data.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <HardDrive className="w-5 h-5" />
            Database Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="mb-2 flex items-center gap-2 font-medium">
              <AlertTriangle className="w-4 h-4" />
              Keep an offsite copy
            </div>
            Download the backup file and store it outside the VPS so a deploy, reset, or server failure cannot remove it.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="secondary" onClick={handleDownloadBackup} disabled={isDownloadingBackup}>
              <Download className="w-4 h-4 mr-2" />
              {isDownloadingBackup ? 'Downloading...' : 'Download Backup'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Restore Backup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a previously downloaded SQLite backup to replace the current site data.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" onClick={handleRestoreBackupClick} disabled={isRestoringBackup}>
              <Upload className="w-4 h-4 mr-2" />
              {isRestoringBackup ? 'Restoring...' : 'Restore Backup'}
            </Button>
            <Input
              ref={backupFileInputRef}
              type="file"
              accept=".sqlite,.db,application/x-sqlite3"
              onChange={handleRestoreBackupFileChange}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}