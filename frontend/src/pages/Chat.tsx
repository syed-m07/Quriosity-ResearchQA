import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { askQuestion, getHistory } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { QaHistoryResponse, Source } from '@/types/chat';
import { toast } from 'sonner';

// Define a more robust message structure for the chat UI
interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: string;
  sources?: Source[];
}

const Chat = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const docIdNum = documentId ? parseInt(documentId) : undefined;

  // Effect to fetch chat history when the component mounts or documentId changes
  useEffect(() => {
    if (docIdNum) {
      const fetchAndSetHistory = async (id: number) => {
        setIsLoading(true);
        try {
          const response = await getHistory(id);
          // Transform the API response into the new ChatMessage structure
          const formattedMessages: ChatMessage[] = response.data.flatMap((item: QaHistoryResponse) => [
            { id: `${item.timestamp}-q`, type: 'user', text: item.question, timestamp: item.timestamp },
            { id: `${item.timestamp}-a`, type: 'ai', text: item.answer, timestamp: item.timestamp }
          ]);
          setMessages(formattedMessages);
        } catch (error) {
          console.error('Failed to fetch chat history:', error);
          toast.error('Failed to load chat history.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAndSetHistory(docIdNum);
    }
  }, [docIdNum]);

  // Effect to scroll to the bottom of the chat on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !docIdNum) return;

    const questionText = input;
    const userMessage: ChatMessage = {
      id: `${new Date().toISOString()}-user`,
      type: 'user',
      text: questionText,
      timestamp: new Date().toISOString(),
    };

    // Add user's message to the UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion({ documentId: docIdNum, question: questionText });
      const aiMessage: ChatMessage = {
        id: `${new Date().toISOString()}-ai`,
        type: 'ai',
        text: response.data.answer,
        sources: response.data.sources,
        timestamp: new Date().toISOString(),
      };
      // Add AI's message to the UI
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to get response from document.');
      // If the API call fails, remove the user's message from the chat
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with Document {documentId}</h1>
      <ScrollArea className="flex-1 p-4 border rounded-lg bg-background mb-4">
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Start a conversation with your document!
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id}>
                {msg.type === 'user' ? (
                  <div className="flex items-center justify-end space-x-2">
                    <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[70%]">
                      {msg.text}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[70%]">
                      {msg.text}
                      {/* You can optionally render sources here */}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>
      <div className="flex gap-2">
        <Input
          placeholder="Ask a question about the document..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !isLoading) {
              handleSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default Chat;
