import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { askQuestion, getHistory } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { QaHistoryResponse } from '@/types/chat';
import { toast } from 'sonner';

const Chat = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const [messages, setMessages] = useState<QaHistoryResponse[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const docIdNum = documentId ? parseInt(documentId) : undefined;

  useEffect(() => {
    if (docIdNum) {
      fetchHistory(docIdNum);
    }
  }, [docIdNum]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchHistory = async (id: number) => {
    setIsLoading(true);
    try {
      const response = await getHistory(id);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      toast.error('Failed to load chat history.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !docIdNum) return;

    const userMessage: QaHistoryResponse = {
      question: input,
      answer: '', // Temporarily empty, will be filled by AI
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askQuestion({ documentId: docIdNum, question: input });
      setMessages((prev) =>
        prev.map((msg) =>
          msg === userMessage ? { ...msg, answer: response.data.answer } : msg
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to get response from document.');
      setMessages((prev) => prev.filter((msg) => msg !== userMessage)); // Remove user message if AI fails
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
            {messages.map((msg, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex items-center justify-end space-x-2">
                  <div className="bg-primary text-primary-foreground p-3 rounded-lg max-w-[70%]">
                    {msg.question}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                {msg.answer && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="bg-muted p-3 rounded-lg max-w-[70%]">
                      {msg.answer}
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
