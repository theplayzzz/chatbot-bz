"use client";

import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { SystemPromptModal } from "@/components/system-prompt-modal";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilEditIcon, PlusIcon } from "./icons";
import { useSidebar } from "./ui/sidebar";
import { VisibilitySelector, type VisibilityType } from "./visibility-selector";

function PureChatHeader({
  chatId,
  selectedVisibilityType,
  selectedSystemPrompt,
  isReadonly,
}: {
  chatId: string;
  selectedVisibilityType: VisibilityType;
  selectedSystemPrompt: string | null;
  isReadonly: boolean;
}) {
  const router = useRouter();
  const { open } = useSidebar();
  const { width: windowWidth } = useWindowSize();
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState(false);

  return (
    <header className="sticky top-0 flex items-center gap-2 bg-background px-2 py-1.5 md:px-2">
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Button
          className="order-2 ml-auto h-8 px-2 md:order-1 md:ml-0 md:h-fit md:px-2"
          onClick={() => {
            router.push("/");
            router.refresh();
          }}
          variant="outline"
        >
          <PlusIcon />
          <span className="md:sr-only">New Chat</span>
        </Button>
      )}

      {!isReadonly && (
        <>
          <VisibilitySelector
            chatId={chatId}
            className="order-1 md:order-2"
            selectedVisibilityType={selectedVisibilityType}
          />

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="order-1 h-8 px-2 md:order-3 md:h-fit md:px-2"
                variant="outline"
                onClick={() => setIsSystemPromptModalOpen(true)}
              >
                <PencilEditIcon size={16} />
                <span className="sr-only">System Prompt</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>System Prompt</TooltipContent>
          </Tooltip>

          <SystemPromptModal
            chatId={chatId}
            initialPrompt={selectedSystemPrompt}
            visibility={selectedVisibilityType}
            open={isSystemPromptModalOpen}
            onOpenChange={setIsSystemPromptModalOpen}
          />
        </>
      )}
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader, (prevProps, nextProps) => {
  return (
    prevProps.chatId === nextProps.chatId &&
    prevProps.selectedVisibilityType === nextProps.selectedVisibilityType &&
    prevProps.selectedSystemPrompt === nextProps.selectedSystemPrompt &&
    prevProps.isReadonly === nextProps.isReadonly
  );
});
