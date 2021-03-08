var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
dotenv.config();
import { Airgram, Auth, prompt, } from "airgram";
console.log(process.env);
const airgram = new Airgram({
    apiId: 812238,
    apiHash: "18b5491f5ba6be342e248ec84eb820a4",
    command: process.env.TDLIB_COMMAND,
    logVerbosityLevel: 2,
});
airgram.use(new Auth({
    code: () => prompt(`Please enter the secret code:\n`),
    phoneNumber: () => prompt(`Please enter your phone number:\n`),
}));
const isTextMessage = (message) => message.content._ === "messageText";
// Getting new messages
airgram.on("updateNewMessage", ({ update }) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = update;
    console.log("[new message]", message);
    if (isTextMessage(message)) {
        const textMessage = message.content;
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
}));
//# sourceMappingURL=index.js.map