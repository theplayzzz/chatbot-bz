"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { updateChatSystemPrompt } from "@/app/(chat)/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getChatHistoryPaginationKey } from "./sidebar-history";
import type { VisibilityType } from "./visibility-selector";

export function SystemPromptModal({
  chatId,
  initialPrompt,
  visibility,
  open,
  onOpenChange,
}: {
  chatId: string;
  initialPrompt: string | null;
  visibility: VisibilityType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [prompt, setPrompt] = useState(initialPrompt || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await updateChatSystemPrompt({
      chatId,
      systemPrompt: prompt.trim() || null,
      visibility,
    });

    // Refresh sidebar history
    mutate(unstable_serialize(getChatHistoryPaginationKey));

    setIsSaving(false);
    onOpenChange(false);

    // Redirect to chat page if we're on the home page (new chat created)
    if (window.location.pathname === "/") {
      router.push(`/chat/${chatId}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>System Prompt</DialogTitle>
          <DialogDescription>
            Customize o comportamento do assistente para esta conversa.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="You are a friendly assistant..."
            maxLength={2000}
            rows={8}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {prompt.length}/2000
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
