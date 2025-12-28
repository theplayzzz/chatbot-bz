"use server";

import { generateText, type UIMessage } from "ai";
import { cookies } from "next/headers";
import { auth } from "@/app/(auth)/auth";
import type { VisibilityType } from "@/components/visibility-selector";
import { titlePrompt } from "@/lib/ai/prompts";
import { getTitleModel } from "@/lib/ai/providers";
import {
  deleteMessagesByChatIdAfterTimestamp,
  getChatById,
  getMessageById,
  saveChat,
  updateChatSystemPromptById,
  updateChatVisibilityById,
} from "@/lib/db/queries";
import { getTextFromMessage } from "@/lib/utils";

export async function saveChatModelAsCookie(model: string) {
  const cookieStore = await cookies();
  cookieStore.set("chat-model", model);
}

export async function generateTitleFromUserMessage({
  message,
}: {
  message: UIMessage;
}) {
  const { text: title } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  });

  return title;
}

export async function deleteTrailingMessages({ id }: { id: string }) {
  const [message] = await getMessageById({ id });

  await deleteMessagesByChatIdAfterTimestamp({
    chatId: message.chatId,
    timestamp: message.createdAt,
  });
}

export async function updateChatVisibility({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  await updateChatVisibilityById({ chatId, visibility });
}

export async function updateChatSystemPrompt({
  chatId,
  systemPrompt,
  visibility = "private",
}: {
  chatId: string;
  systemPrompt: string | null;
  visibility?: VisibilityType;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Check if chat exists
  const existingChat = await getChatById({ id: chatId });

  if (!existingChat) {
    // Create chat with title based on system prompt
    const title = systemPrompt
      ? systemPrompt.slice(0, 30) + (systemPrompt.length > 30 ? "..." : "")
      : "New chat";

    await saveChat({
      id: chatId,
      userId: session.user.id,
      title,
      visibility,
    });
  }

  // Now update the system prompt
  await updateChatSystemPromptById({ chatId, systemPrompt });
}
