import { useChatStore } from '../../store/chatStore';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { ActionType, TaskProps, ChatResponse } from '../../types/types';
import { detectActionType } from '../../store/chatStore';
import { useTaskStore } from '../../store/taskStore';
import { useRef, useEffect } from 'react';

export const Chat = () => {
  const { toast } = useToast();
  const {
    messages,
    inputValue,
    isLoading,
    sendMessage,
    handleInputChange
  } = useChatStore();
  const { tasks } = useTaskStore();


  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };


  const extractAction = async (message: string): Promise<{ action: ActionType }> => {
    try {
      const response = await fetch('/api/analyze-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      return await response.json();
    } catch (error) {
      console.error('Error extracting action:', error);
      return { action: ActionType.None };
    }
  };

  const extractUpdate = async (tasks: TaskProps[], actionType: ActionType): Promise<{ taskId: string, updates: Partial<TaskProps> }> => {
    try {
      const response = await fetch('/api/analyze-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, actionType })
      });
      return await response.json();
    } catch (error) {
      console.error('Error extracting updates:', error);
      return { taskId: '', updates: {} };
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting chat message');

      // look at the message and determine if any action is needed
      const { action: actionType } = await extractAction(inputValue); // an AI call

      // look at the tasks and message and determine which task to update, and what updates to make
      // create - what do I create
      // delete - which task to delete
      // update - which task to update, and what updates to make
      const { taskId, updates } = await extractUpdate(tasks, actionType); // an AI call

      console.log('Task ID:', taskId);
      console.log('Updates:', updates);



      // Detect action type from message
      const action = detectActionType(inputValue);
      console.log('Detected action:', action);

      // Use appropriate HTTP method based on action
      const method = action === ActionType.Update ? 'PUT'
        : action === ActionType.Delete ? 'DELETE'
          : 'POST';

      // Send message and get response using the chat store's sendMessage
      const response: ChatResponse = await sendMessage(e, method);
      console.log('Chat response received:', response);

      // Handle different response types
      if (response.action === ActionType.Update) {
        console.log('Update action detected:', response);
        toast({
          title: "Task updated successfully",
          description: response.message,
        });
      } else if (response.action === ActionType.Delete) {
        console.log('Delete action detected:', response);
        toast({
          title: "Task deleted successfully",
          description: response.message,
        });
      } else if (response.tasks && response.tasks.length > 0) {
        console.log('New tasks created:', response.tasks);
        toast({
          title: "Task created successfully",
          description: `Created ${response.tasks.length} task(s) from your message.`,
        });
      }

      return response;
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <div className="fixed right-4 top-24 flex flex-col h-[calc(100vh-8rem)] w-[350px] border rounded-lg shadow-lg bg-background">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">AI Copilot</h2>
      </div>

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4 h-[calc(100vh-16rem)]"
      >
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