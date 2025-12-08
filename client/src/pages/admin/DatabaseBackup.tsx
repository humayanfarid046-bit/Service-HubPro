import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Database, Download, Upload, Loader2, Clock, CheckCircle, AlertTriangle, 
  RefreshCw, Calendar, HardDrive, Trash2
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";

interface Backup {
  id: number;
  name: string;
  size: string;
  createdAt: string;
  type: string;
  status: string;
}

const initialBackups: Backup[] = [
  { id: 1, name: "backup_2024-12-08_auto.sql", size: "45.2 MB", createdAt: "2024-12-08 03:00:00", type: "automatic", status: "completed" },
  { id: 2, name: "backup_2024-12-07_auto.sql", size: "44.8 MB", createdAt: "2024-12-07 03:00:00", type: "automatic", status: "completed" },
  { id: 3, name: "backup_2024-12-06_manual.sql", size: "44.5 MB", createdAt: "2024-12-06 14:30:00", type: "manual", status: "completed" },
  { id: 4, name: "backup_2024-12-05_auto.sql", size: "44.1 MB", createdAt: "2024-12-05 03:00:00", type: "automatic", status: "completed" },
];

export default function AdminDatabaseBackup() {
  const { toast } = useToast();
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<Backup | null>(null);
  
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupTime: "03:00",
    retentionDays: "30",
    compressionEnabled: true,
  });

  const handleCreateBackup = async () => {
    setCreating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const newBackup: Backup = {
      id: Date.now(),
      name: `backup_${new Date().toISOString().split('T')[0]}_manual.sql`,
      size: "45.5 MB",
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      type: "manual",
      status: "completed",
    };
    setBackups([newBackup, ...backups]);
    setCreating(false);
    setProgress(0);
    toast({ title: "Success", description: "Backup created successfully!" });
  };

  const handleRestore = async () => {
    setShowRestoreDialog(false);
    setRestoring(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);

    await new Promise(resolve => setTimeout(resolve, 4000));
    
    setRestoring(false);
    setProgress(0);
    setSelectedBackup(null);
    toast({ title: "Success", description: "Database restored successfully!" });
  };

  const handleDelete = (id: number) => {
    setBackups(backups.filter(b => b.id !== id));
    toast({ title: "Success", description: "Backup deleted!" });
  };

  const handleDownload = (backup: Backup) => {
    toast({ title: "Download Started", description: `Downloading ${backup.name}...` });
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Database Backup</h1>
          <p className="text-slate-500 mt-1">Manage database backups and restoration.</p>
        </div>
        <Button onClick={handleCreateBackup} disabled={creating || restoring} className="gap-2">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          Create Backup Now
        </Button>
      </div>

      {(creating || restoring) && (
        <Card className="border-blue-200 bg-blue-50 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <p className="font-medium text-blue-900">
                {creating ? "Creating backup..." : "Restoring database..."}
              </p>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-blue-700 mt-2">{progress}% complete</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Backups</p>
              <p className="text-xl font-bold text-slate-900">{backups.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Last Backup</p>
              <p className="text-sm font-bold text-slate-900">{backups[0]?.createdAt.split(' ')[0]}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Size</p>
              <p className="text-xl font-bold text-slate-900">178 MB</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Auto Backup</p>
              <Badge className={settings.autoBackup ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}>
                {settings.autoBackup ? "Enabled" : "Disabled"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="border-slate-100 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              Backup History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div 
                  key={backup.id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                  data-testid={`row-backup-${backup.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                      <Database className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{backup.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{backup.createdAt}</span>
                        <span>{backup.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={backup.type === "automatic" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                      {backup.type}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDownload(backup)}>
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => { setSelectedBackup(backup); setShowRestoreDialog(true); }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => handleDelete(backup.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Backup Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium">Auto Backup</p>
                <p className="text-xs text-slate-500">Automatic scheduled backups</p>
              </div>
              <Switch 
                checked={settings.autoBackup} 
                onCheckedChange={(v) => setSettings({ ...settings, autoBackup: v })}
              />
            </div>
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={settings.backupFrequency} onValueChange={(v) => setSettings({ ...settings, backupFrequency: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Backup Time</Label>
              <Input 
                type="time"
                value={settings.backupTime} 
                onChange={(e) => setSettings({ ...settings, backupTime: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Retention (days)</Label>
              <Select value={settings.retentionDays} onValueChange={(v) => setSettings({ ...settings, retentionDays: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">Compression</p>
                <p className="text-xs text-slate-500">Compress backup files</p>
              </div>
              <Switch 
                checked={settings.compressionEnabled} 
                onCheckedChange={(v) => setSettings({ ...settings, compressionEnabled: v })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Restore Database?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will replace your current database with the backup "{selectedBackup?.name}". 
              All changes made after {selectedBackup?.createdAt} will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} className="bg-amber-600 hover:bg-amber-700">
              Restore Database
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
