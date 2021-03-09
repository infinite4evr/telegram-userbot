import dotenv from "dotenv";
dotenv.config();
import tags from "./tags.json";

const tagsRegex = new RegExp(tags.tags.join("|"), "i");

import { Airgram, Auth, Message, MessageText, prompt } from "airgram";

const airgram = new Airgram({
  apiId: (process.env.API_ID as unknown) as number,
  apiHash: process.env.API_HASH,
  command: process.env.TDLIB_COMMAND,
  logVerbosityLevel: 2,
});

const percentRegex = /[3-9]\d%/;
const myChatId = -1001481850800;

const channels = [-1001450712440, -1001156896568, -1001259793382, -504416139];

const forwardMessage = (message: Message) => {
  airgram.api
    .forwardMessages({
      chatId: myChatId,
      fromChatId: message.chatId,
      messageIds: [message.id],
    })
    .then((s) => console.log(s))
    .catch((err) => console.log(err));
};

airgram.use(
  new Auth({
    code: () => prompt(`Please enter the secret code:\n`),
    phoneNumber: () => prompt(`Please enter your phone number:\n`),
  })
);

const isTextMessage = (message: Message) => message.content._ === "messageText";

airgram.on("updateNewMessage", async ({ update }) => {
  const { message } = update;
  console.log(message);

  if (channels.includes(message.chatId) && isTextMessage(message)) {
    const textMessage = message.content as MessageText;
    const text = textMessage.text.text;

    if (percentRegex.test(text) || tagsRegex.test(text)) {
      forwardMessage(message);
    }
  }
});
