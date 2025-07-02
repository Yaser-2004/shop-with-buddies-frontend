
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Copy, Mail, Link2, UserPlus, QrCode, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InviteModalProps {
  children: React.ReactNode;
  roomCode?: string;
}

export const InviteModal = ({ children, roomCode = "ROOM-123" }: InviteModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [emailList, setEmailList] = useState('');
  const [customMessage, setCustomMessage] = useState('Hey! Join me for a shopping session. Let\'s find some great deals together!');
  const { toast } = useToast();

  const roomLink = `https://coshop.app/room/${roomCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(roomLink);
    toast({
      title: "Link Copied!",
      description: "Room link copied to clipboard",
    });
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode);
    toast({
      title: "Code Copied!",
      description: "Room code copied to clipboard",
    });
  };

  const handleEmailInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const emails = emailList.split(',').map(email => email.trim()).filter(email => email);
    console.log('Sending invites to:', emails);
    console.log('Message:', customMessage);
    
    toast({
      title: "Invites Sent!",
      description: `Sent invitations to ${emails.length} people`,
    });
    
    setEmailList('');
    setIsOpen(false);
  };

  const handleSocialShare = (platform: string) => {
    const message = encodeURIComponent(`Join my shopping session on CoShop! ${roomLink}`);
    const urls = {
      whatsapp: `https://wa.me/?text=${message}`,
      telegram: `https://t.me/share/url?url=${roomLink}&text=${encodeURIComponent('Join my shopping session on CoShop!')}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${roomLink}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Invite Friends to Shopping Room</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Room: {roomCode}</Badge>
              <Button variant="ghost" size="sm" onClick={handleCopyCode}>
                <Copy className="w-4 h-4 mr-1" />
                Copy Code
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="link" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="link">Share Link</TabsTrigger>
                <TabsTrigger value="email">Send Email</TabsTrigger>
                <TabsTrigger value="social">Social Media</TabsTrigger>
              </TabsList>

              <TabsContent value="link" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="roomLink">Room Link</Label>
                    <div className="flex space-x-2 mt-2">
                      <Input
                        id="roomLink"
                        value={roomLink}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={handleCopyLink}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Share this link with friends to invite them to your shopping session
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center justify-center space-x-4">
                      <QrCode className="w-24 h-24 text-gray-400" />
                      <div>
                        <p className="font-medium">QR Code</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scan to join the room
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Download QR
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailInvite} className="space-y-4">
                  <div>
                    <Label htmlFor="emails">Email Addresses</Label>
                    <Input
                      id="emails"
                      placeholder="Enter email addresses separated by commas"
                      value={emailList}
                      onChange={(e) => setEmailList(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Separate multiple emails with commas
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="message">Custom Message</Label>
                    <textarea
                      id="message"
                      rows={4}
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Add a personal message..."
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={!emailList.trim()}>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitations
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="social" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('whatsapp')}
                    className="h-16 flex flex-col space-y-2"
                  >
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">W</span>
                    </div>
                    <span className="text-sm">WhatsApp</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('telegram')}
                    className="h-16 flex flex-col space-y-2"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">T</span>
                    </div>
                    <span className="text-sm">Telegram</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('twitter')}
                    className="h-16 flex flex-col space-y-2"
                  >
                    <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">X</span>
                    </div>
                    <span className="text-sm">Twitter/X</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleSocialShare('facebook')}
                    className="h-16 flex flex-col space-y-2"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">f</span>
                    </div>
                    <span className="text-sm">Facebook</span>
                  </Button>
                </div>

                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium mb-2">Share Options</h4>
                  <div className="space-y-2">
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Share2 className="w-4 h-4 mr-2" />
                      More sharing options
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Link2 className="w-4 h-4 mr-2" />
                      Create shortened link
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};
