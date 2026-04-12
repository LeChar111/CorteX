import { ThreadPrimitive, MessagePrimitive, ComposerPrimitive } from '@assistant-ui/react';
import { Send, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils.ts';

export function Thread() {
  return (
    <ThreadPrimitive.Root className="flex h-full flex-col">
      <ThreadPrimitive.Viewport
        autoScroll
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
      >
        <ThreadPrimitive.Empty>
          <div className="flex h-full items-center justify-center text-sm text-muted">
            Posez une question sur votre codebase
          </div>
        </ThreadPrimitive.Empty>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.If running>
          <div className="flex justify-start">
            <div className="rounded-xl bg-bg px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-muted" />
            </div>
          </div>
        </ThreadPrimitive.If>
      </ThreadPrimitive.Viewport>

      <Composer />
    </ThreadPrimitive.Root>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <div className="max-w-[85%] rounded-xl bg-sidebar-active px-3 py-2 text-sm text-white">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-start">
      <div className="max-w-[85%] rounded-xl bg-bg px-3 py-2 text-sm text-text whitespace-pre-wrap break-words">
        <MessagePrimitive.Parts />
      </div>
    </MessagePrimitive.Root>
  );
}

function Composer() {
  return (
    <ComposerPrimitive.Root className="border-t border-border-light px-4 py-3">
      <div className="flex items-center gap-2">
        <ComposerPrimitive.Input
          placeholder="Posez votre question..."
          rows={1}
          autoFocus
          className="flex-1 resize-none rounded-lg border border-border-light bg-bg px-3 py-2 text-sm text-text placeholder-light outline-none focus:border-accent transition-colors"
        />
        <ThreadPrimitive.If running={false}>
          <ComposerPrimitive.Send
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-active text-white transition-all hover:scale-105',
              'disabled:bg-bg disabled:text-light disabled:cursor-not-allowed disabled:hover:scale-100',
            )}
          >
            <Send className="h-4 w-4" />
          </ComposerPrimitive.Send>
        </ThreadPrimitive.If>
        <ThreadPrimitive.If running>
          <ComposerPrimitive.Cancel className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg text-muted hover:bg-bg-warm">
            <Loader2 className="h-4 w-4 animate-spin" />
          </ComposerPrimitive.Cancel>
        </ThreadPrimitive.If>
      </div>
    </ComposerPrimitive.Root>
  );
}
