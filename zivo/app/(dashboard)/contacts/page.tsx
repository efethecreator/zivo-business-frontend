"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Mail, Phone, MessageSquare } from "lucide-react";

// Mock veri
const mockMessages = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "+90 555 123 4567",
    subject: "Randevu Talebi",
    message:
      "Önümüzdeki hafta için saç kesimi randevusu almak istiyorum. Müsait zamanlarınızı öğrenebilir miyim?",
    date: "2023-04-22T14:30:00",
    status: "unread",
  },
  {
    id: "2",
    name: "Ayşe Demir",
    email: "ayse.demir@example.com",
    phone: "+90 555 234 5678",
    subject: "Fiyat Bilgisi",
    message:
      "Saç boyama ve kesim için fiyat bilgisi alabilir miyim? Teşekkürler.",
    date: "2023-04-21T10:15:00",
    status: "read",
  },
  {
    id: "3",
    name: "Mehmet Kaya",
    email: "mehmet.kaya@example.com",
    phone: "+90 555 345 6789",
    subject: "Teşekkür Mesajı",
    message:
      "Dün aldığım hizmet için çok teşekkür ederim. Çok memnun kaldım, emeğinize sağlık.",
    date: "2023-04-20T16:45:00",
    status: "read",
  },
  {
    id: "4",
    name: "Zeynep Şahin",
    email: "zeynep.sahin@example.com",
    phone: "+90 555 456 7890",
    subject: "İptal Talebi",
    message:
      "Yarın saat 14:00'teki randevumu iptal etmek istiyorum. Başka bir güne erteleyebilir miyiz?",
    date: "2023-04-20T09:30:00",
    status: "unread",
  },
  {
    id: "5",
    name: "Ali Öztürk",
    email: "ali.ozturk@example.com",
    phone: "+90 555 567 8901",
    subject: "Ürün Bilgisi",
    message:
      "Kullandığınız saç bakım ürünleri hakkında bilgi alabilir miyim? Hangi markaları önerirsiniz?",
    date: "2023-04-19T11:20:00",
    status: "read",
  },
];

export default function ContactsPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState(mockMessages);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<
    (typeof mockMessages)[0] | null
  >(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredMessages = messages
    .filter((message) => {
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        (filter === "unread" && message.status === "unread") ||
        (filter === "read" && message.status === "read");

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleMessageClick = (message: (typeof mockMessages)[0]) => {
    setSelectedMessage(message);

    // Mesajı okundu olarak işaretle
    if (message.status === "unread") {
      const updatedMessages = messages.map((m) =>
        m.id === message.id ? { ...m, status: "read" } : m
      );
      setMessages(updatedMessages);
    }
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      toast({
        title: "Boş mesaj",
        description: "Lütfen bir yanıt yazın.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Yanıt gönderildi",
      description: "Mesajınız başarıyla gönderildi.",
    });

    setReplyText("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Contacts
      </h1>

      <Tabs defaultValue="messages" className="w-full">
        <TabsList className="bg-muted/50 p-1 rounded-lg">
          <TabsTrigger
            value="messages"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="transition-all duration-200 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Contact Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="space-y-4 mt-4">
          <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-background to-muted/30">
              <CardTitle>Incoming Messages</CardTitle>
              <CardDescription>
                View and respond to messages from your customers here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1 group">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8 transition-all duration-200 border-muted focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all duration-200 hover:border-primary focus:border-primary"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 border-b">
                    <h3 className="font-medium">Message List</h3>
                  </div>
                  <div className="h-[500px] overflow-y-auto">
                    {filteredMessages.length > 0 ? (
                      <div className="divide-y">
                        {filteredMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`p-3 cursor-pointer hover:bg-primary/5 transition-all duration-200 ${
                              selectedMessage?.id === message.id
                                ? "bg-primary/10"
                                : ""
                            } ${
                              message.status === "unread" ? "font-medium" : ""
                            }`}
                            onClick={() => handleMessageClick(message)}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-sm font-medium truncate">
                                {message.name}
                              </span>
                              {message.status === "unread" && (
                                <Badge
                                  variant="default"
                                  className="bg-emerald-600"
                                >
                                  New
                                </Badge>
                              )}
                            </div>
                            <div className="text-sm font-medium truncate">
                              {message.subject}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {message.message.substring(0, 50)}...
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDate(message.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">
                          No messages found.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 border rounded-md overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                  {selectedMessage ? (
                    <div className="flex flex-col h-[500px]">
                      <div className="bg-gradient-to-r from-muted/50 to-muted/30 p-3 border-b">
                        <h3 className="font-medium">
                          {selectedMessage.subject}
                        </h3>
                      </div>
                      <div className="p-4 flex-1 overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <div className="font-medium">
                              {selectedMessage.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedMessage.email}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedMessage.phone}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(selectedMessage.date)}
                          </div>
                        </div>
                        <div className="border-t pt-4 mt-2">
                          <p className="whitespace-pre-wrap">
                            {selectedMessage.message}
                          </p>
                        </div>
                      </div>
                      <div className="border-t p-3">
                        <div className="flex flex-col space-y-2">
                          <Textarea
                            placeholder="Write your reply here..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="min-h-[100px]"
                          />
                          <div className="flex justify-end">
                            <Button
                              onClick={handleSendReply}
                              className="transition-all duration-200 hover:shadow-sm"
                            >
                              <Mail className="mr-2 h-4 w-4" />
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px]">
                      <div className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                          Select a message to view.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 mt-4">
          <Card className="transition-all duration-300 hover:shadow-md overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-background to-muted/30">
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Edit the contact information your customers can use to reach
                you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <Label
                    htmlFor="contactPhone"
                    className="group-hover:text-primary transition-colors duration-200"
                  >
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border rounded-l-md group-hover:border-primary/50 transition-all duration-200">
                      <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <Input
                      id="contactPhone"
                      placeholder="+90 555 123 4567"
                      className="rounded-l-none transition-all duration-200 focus:border-primary hover:border-primary/50"
                      defaultValue="+90 555 987 6543"
                    />
                  </div>
                </div>

                <div className="space-y-2 group">
                  <Label
                    htmlFor="contactEmail"
                    className="group-hover:text-primary transition-colors duration-200"
                  >
                    Email Address
                  </Label>
                  <div className="flex">
                    <div className="flex items-center px-3 bg-muted border rounded-l-md group-hover:border-primary/50 transition-all duration-200">
                      <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    </div>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="info@isletmeniz.com"
                      className="rounded-l-none transition-all duration-200 focus:border-primary hover:border-primary/50"
                      defaultValue="info@demoişletme.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactForm">Contact Form</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="contactForm"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    defaultChecked
                  />
                  <Label htmlFor="contactForm" className="text-sm font-normal">
                    Enable contact form on your website
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  When this option is enabled, your customers can send you
                  messages through your website.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="autoReply">Auto Reply</Label>
                <Textarea
                  id="autoReply"
                  placeholder="Write your auto-reply message here..."
                  defaultValue="Mesajınız için teşekkür ederiz. En kısa sürede size dönüş yapacağız."
                  rows={4}
                />
                <p className="text-sm text-muted-foreground">
                  This message will be sent automatically when your customers
                  send you a message.
                </p>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={() => {
                    toast({
                      title: "Settings saved",
                      description:
                        "Your contact settings have been successfully updated.",
                    });
                  }}
                  className="transition-all duration-200 hover:shadow-sm"
                >
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
