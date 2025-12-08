import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  MessageCircle, Loader2, Search, Flag, Eye, MoreVertical, 
  AlertTriangle, CheckCircle, XCircle, User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { ChatMessage } from "@shared/schema";

export default function AdminChatMonitoring() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ChatMessage | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  const { data: allMessages = [], isLoading: loadingAll } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat-messages"],
    queryFn: async () => {
      const res = await fetch("/api/chat-messages");
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
  });

  const { data: flaggedMessages = [], isLoading: loadingFlagged } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat-messages/flagged"],
    queryFn: async () => {
      const res = await fetch("/api/chat-messages/flagged");
      if (!res.ok) throw new Error("Failed to fetch flagged messages");
      return res.json();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ChatMessage> }) => {
      const res = await fetch(`/api/chat-messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages/flagged"] });
      toast({ title: "Success", description: "Message updated!" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/chat-messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chat-messages/flagged"] });
      toast({ title: "Success", description: "Message deleted!" });
    },
  });

  const isLoading = loadingAll || loadingFlagged;

  const messages = activeTab === "flagged" ? flaggedMessages : allMessages;
  
  const filteredMessages = messages.filter((msg) => 
    msg.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.receiverName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalMessages = allMessages.length;
  const flaggedCount = flaggedMessages.length;
  const todayMessages = allMessages.filter(m => 
    new Date(m.createdAt).toDateString() === new Date().toDateString()
  ).length;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Chat Monitoring</h1>
          <p className="text-slate-500 mt-1">Monitor user conversations and flagged messages.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Messages</p>
              <p className="text-xl font-bold text-slate-900">{totalMessages}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Flagged</p>
              <p className="text-xl font-bold text-slate-900">{flaggedCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Today</p>
              <p className="text-xl font-bold text-slate-900">{todayMessages}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-100 shadow-sm">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Messages</TabsTrigger>
              <TabsTrigger value="flagged" className="relative">
                Flagged
                {flaggedCount > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                    {flaggedCount}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search messages..."
              className="pl-9 bg-slate-50 border-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search-chat"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500">No messages found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "p-4 rounded-lg border transition-colors",
                    msg.isFlagged 
                      ? "bg-red-50 border-red-100" 
                      : "bg-slate-50 border-slate-100"
                  )}
                  data-testid={`row-chat-message-${msg.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3 flex-1">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        msg.senderRole === "CUSTOMER" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                      )}>
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">{msg.senderName}</span>
                          <span className="text-slate-400">→</span>
                          <span className="text-slate-600">{msg.receiverName}</span>
                          {msg.isFlagged && (
                            <Badge className="bg-red-100 text-red-700">
                              <Flag className="w-3 h-3 mr-1" /> Flagged
                            </Badge>
                          )}
                        </div>
                        <p className="text-slate-700 mb-2">{msg.message}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <Badge variant="outline" className="text-xs">
                            {msg.senderRole}
                          </Badge>
                          {msg.bookingId && (
                            <span>Booking #{msg.bookingId}</span>
                          )}
                          <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                        {msg.isFlagged && msg.flagReason && (
                          <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                            <AlertTriangle className="w-3 h-3 inline mr-1" />
                            {msg.flagReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedMessage(msg)}>
                          <Eye className="w-4 h-4 mr-2" /> View Context
                        </DropdownMenuItem>
                        {msg.isFlagged ? (
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: msg.id, data: { isFlagged: false, flagReason: null } })}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Unflag
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateMutation.mutate({ id: msg.id, data: { isFlagged: true, flaggedAt: new Date() } })}>
                            <Flag className="w-4 h-4 mr-2" /> Flag
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => deleteMutation.mutate(msg.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Message Details</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  selectedMessage.senderRole === "CUSTOMER" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"
                )}>
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">{selectedMessage.senderName}</p>
                  <p className="text-sm text-slate-500">{selectedMessage.senderRole}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-slate-700">{selectedMessage.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Sent To</p>
                  <p className="font-medium">{selectedMessage.receiverName}</p>
                </div>
                <div>
                  <p className="text-slate-500">Time</p>
                  <p className="font-medium">{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                </div>
                {selectedMessage.bookingId && (
                  <div>
                    <p className="text-slate-500">Booking</p>
                    <p className="font-medium">#{selectedMessage.bookingId}</p>
                  </div>
                )}
                <div>
                  <p className="text-slate-500">Status</p>
                  {selectedMessage.isFlagged ? (
                    <Badge className="bg-red-100 text-red-700">Flagged</Badge>
                  ) : (
                    <Badge className="bg-emerald-100 text-emerald-700">Normal</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
