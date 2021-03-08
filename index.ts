import dotenv from "dotenv";
dotenv.config();

import { Airgram, Auth, Message, MessageText, prompt } from "airgram";

console.log(process.env);

const airgram = new Airgram({
  apiId: (process.env.API_ID as unknown) as number,
  apiHash: process.env.API_HASH,
  command: process.env.TDLIB_COMMAND,
  logVerbosityLevel: 2,
});

airgram.use(
  new Auth({
    code: () => prompt(`Please enter the secret code:\n`),
    phoneNumber: () => prompt(`Please enter your phone number:\n`),
  })
);

const isTextMessage = (message: Message) => message.content._ === "messageText";

airgram.on("updateNewMessage", async ({ update }) => {
  const { message } = update;

  if (isTextMessage(message)) {
    const textMessage = message.content as MessageText;
    if (textMessage.text.text.includes("hi")) {
      airgram.api.sendMessage({
        chatId: message.chatId,
        messageThreadId: message.messageThreadId,
        inputMessageContent: {
          _: "inputMessageText",
          text: {
            _: "formattedText",
            text: "Hi, Good Morning, Can we talk later please?",
          },
        },
      });
    }
  }
});
