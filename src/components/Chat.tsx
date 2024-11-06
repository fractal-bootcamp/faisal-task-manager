import { useChatStore } from '../../store/chatStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

export const Chat = () => {
  const { toast } = useToast();
  const {
    messages,
    inputValue,
    isLoading,
    sendMessage,
    handleInputChange
  } = useChatStore();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await sendMessage(e);
      console.log('Chat response:', response);

      if (response?.tasks && response.tasks.length > 0) {
        toast({
          title: "Task created successfully",
          description: `Created ${response.tasks.length} task(s) from your message.`,
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="fixed right-4 top-24 flex flex-col h-[calc(100vh-8rem)] w-[350px] border rounded-lg shadow-lg bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div
                className={cn(
                  "flex w-max max-w-[80%] rounded-lg px-3 py-2 text-sm",
                  message.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                {message.content}
              </div>
              {/* Display tasks if present */}
              {message.tasks && message.tasks.length > 0 && (
                <div className="mt-2 space-y-2">
                  {message.tasks.map((task, index) => (
                    <div key={index} className="text-sm bg-muted/50 rounded-md p-2">
                      <div className="font-medium">{task.title}</div>
                      <div className="text-xs text-muted-foreground">{task.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="p-4 border-t mt-auto">
        <div className="flex flex-col gap-2">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Create a task with Copilot..."
            disabled={isLoading}
            className="min-h-[80px] resize-none"
            rows={3}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
}; 