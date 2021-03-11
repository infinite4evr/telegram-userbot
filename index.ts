import dotenv from "dotenv";
dotenv.config();
import fs from "fs";
import { Airgram, Auth, Message, MessageText, prompt } from "airgram";
import tags from "./tags.json";

const tagsRegex = new RegExp(tags.tags.join("|"), "i");

const airgram = new Airgram({
  apiId: (process.env.API_ID as unknown) as number,
  apiHash: process.env.API_HASH,
  command: process.env.TDLIB_COMMAND,
  logVerbosityLevel: 2,
});

const percentRegex = /[3-9]\d%/;
const myChatId = -1001481850800;

const myPersonalId = 330959283;

const channels = [-1001450712440, -1001156896568, -1001259793382, -504416139];

const forwardMessage = (message: Message) => {
  airgram.api.getChat({
    chatId: myChatId,
  });

  airgram.api
    .forwardMessages({
      chatId: myChatId,
      fromChatId: message.chatId,
      messageIds: [message.id],
      sendCopy: true,
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

  if (isTextMessage(message)) {
    const textMessage = message.content as MessageText;
    const text = textMessage.text.text;

    if (
      "userId" in message.sender &&
      message.chatId === myPersonalId &&
      message.sender.userId === myPersonalId
    ) {
      const tag = text.split(" ");
      const index = tags.tags.indexOf(tag[1]);
      if (text.includes("remove")) {
        if (index > -1) {
          console.log("here");
          tags.tags.splice(index, 1);
        }
      }

      if (text.includes("add")) {
        if (index === -1) {
          tags.tags.push(tag[1]);
        }
      }

      airgram.api.sendMessage({
        chatId: myPersonalId,
        inputMessageContent: {
          _: "inputMessageText",
          text: {
            _: "formattedText",
            text: tags.tags.join("\n"),
          },
        },
      });

      fs.writeFileSync("dist/tags.json", JSON.stringify(tags));
    }

    if (
      channels.includes(message.chatId) &&
      (percentRegex.test(text) || tagsRegex.test(text))
    ) {
      forwardMessage(message);
    }
  }
});
