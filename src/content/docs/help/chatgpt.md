---
title: ChatGPT Conversations
description: Navigate questions, answers, and answer headings in ChatGPT, load older messages, and manage optional question times.
---

Crumbs provides a conversation outline on **chatgpt.com**. It helps you return to a question, answer, or heading inside an answer without scrolling through the whole chat.

Conversation outlines currently support **ChatGPT**. Support for Claude, Gemini, and Perplexity is planned.

## Open the conversation outline

1. Open a ChatGPT conversation and expand the Crumbs rail.
2. Select a question, answer, or answer heading to jump to it.
3. Pin the outline if you want it to stay open. Use search to find text in the conversation entries available to Crumbs.

Use the three content filters in the outline to show or hide **Question**, **Answer**, and **Heading in Answers**. These select content types rather than the heading-depth levels used on ordinary pages. At least one content type stays visible. Collapse a parent entry to fold its descendants.

The outline updates as answers stream and as ChatGPT loads more messages. It follows the current conversation branch, so editing a question or choosing another answer may change the entries shown.

## Load older messages

ChatGPT may load only part of a long conversation. Messages that have never loaded cannot appear in the outline or its search results.

- Select **Jump to Top** to move to the top of the loaded messages. This may prompt ChatGPT to load earlier messages.
- When the outline says **Some older messages aren’t loaded**, its **Go to top** link uses the same action.
- Wait for ChatGPT to finish loading, then repeat if earlier messages are still missing. Loading the entire history is not guaranteed in one step.

ChatGPT may also unload messages you have already visited. Crumbs can retain their outline entries while the conversation remains open. A **Not loaded** hint means the entry’s content is currently unavailable on the page. Select it to move toward the nearest loaded entry, wait for more content, and select it again if needed.

**Jump to Bottom** returns you toward the latest loaded part of the conversation.

## Question times

Under **AI Chat → ChatGPT**, choose whether to **Show question times**. Where available, Crumbs uses times supplied by ChatGPT.

Under **Question times & local data**, **Remember approximate times** lets Crumbs remember when you send a new question on this device when ChatGPT does not provide a time. These are approximate local times, not a reconstruction of older conversation history.

Only message identifiers and times are saved for this feature, not message text. **Clear times** removes locally saved question times. See the [privacy policy](../../privacy/) for retention and storage details.

## Appearance and controls

Conversation outlines share the General tab’s accent, Glazed/Plain appearance, keyboard shortcuts, and quick-button preferences. The default shortcuts are **Option/Alt + Shift + C** for pin/unpin and **Option/Alt + Shift + V** for search. Shortcuts do not run while you are typing in the chat editor.

Turn **Conversation outline** off under **AI Chat → ChatGPT** to stop showing conversation entries. Jump to Top and Bottom can still remain available; use the current-page **Hide** control to hide floating navigation altogether.

## If something is missing

Check the content filters and search query, allow time for streaming or loading, and try [loading older messages](#load-older-messages). An answer may simply contain no headings. For more help, see [Troubleshooting](../troubleshooting/).
