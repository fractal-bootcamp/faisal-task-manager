import { useChatStore } from '../../store/chatStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

export const Chat = () => {
  const {
    messages,
    inputValue,
    isLoading,
    sendMessage,
    handleInputChange
  } = useChatStore();

  return (
    <div className="fixed right-4 top-24 flex flex-col h-[calc(100vh-8rem)] w-[350px] border rounded-lg shadow-lg bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
      </div>

      <ScrollArea className="flex-1 p-4 h-[calc(100vh-16rem)]">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-max max-w-[80%] rounded-lg px-3 py-2 text-sm",
                message.role === "user"
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {message.content}
            </div>
          ))}
        </div>
      </ScrollArea>

      <form onSubmit={sendMessage} className="p-4 border-t mt-auto">
        <div className="flex flex-col gap-2">
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Create a task with Copilot..."
            disabled={isLoading}
            className="min-h-[80px] resize-none"
            rows={3}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}; 