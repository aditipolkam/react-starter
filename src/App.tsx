import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Client, Conversation, DecodedMessage } from "@xmtp/xmtp-js";
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
  AttachmentCodec,
  RemoteAttachmentCodec,
  Attachment
} from "@xmtp/content-type-remote-attachment";

import WalletContext from "./context/WalletContextProvider";

function App() {
  const { address, signer } = useContext(WalletContext);
  const [xmtp, setXmtp] = useState<Client | null>();
  const [conversation, setConversation] = useState<Conversation | null>();
  const [messages, setMessages] = useState<DecodedMessage[] | null>();

  useEffect(() => {
    const getDetails = async () => {
      console.log("in details");
      const xmtpC = await Client.create(signer, { env: "dev" });
      xmtpC.registerCodec(new AttachmentCodec());
      xmtpC.registerCodec(new RemoteAttachmentCodec());
      setXmtp(xmtpC);
      if (!xmtpC) return;

      console.log("getting convo");
      const convo = await xmtpC.conversations.newConversation(
        "0x5D069746c2F632C62DA5b8dAf2911b56375638Ab"
      );
      setConversation(convo);
      console.log("convo set");
      if (!convo) return;
      const msgs = await convo.messages();
      setMessages(msgs);
      console.log(msgs);
    };
    getDetails();
  }, [signer]);

  const parseContent = async (msg: DecodedMessage) => {
    if (!xmtp) return;
    const attachment: Attachment = await RemoteAttachmentCodec.load(
      msg.content,
      xmtp
    );
    if (!attachment) return;
    if (attachment.mimeType.startsWith("image/")) {
      const objUrl = URL.createObjectURL(
        new Blob([Buffer.from(attachment.data)], {
          type: attachment.mimeType
        })
      );
      return objUrl;
    }
    return null;
  };

  const TextView = ({ content }: { content: string }) => {
    return (
      <div className="msg-header flex justify-start">
        <div className="identicon" />
        <div className="convo-info align-start flex-dir-col flex justify-start">
          <div>{content}</div>
        </div>
      </div>
    );
  };

  const ImageView = ({ content }: { content: string }) => {
    return (
      <div>
        <img
          onLoad={() => {
            window.scroll({ top: 10000, behavior: "smooth" });
          }}
          src={content}
          // title={attachment.filename}
          alt="Attachment"
        />
      </div>
    );
  };

  useEffect(() => {
    if (messages && xmtp) {
      messages.forEach(async (msg, index) => {
        if (msg.contentType.sameAs(ContentTypeRemoteAttachment)) {
          const imageUrl = await parseContent(msg);
          if (imageUrl) {
            messages[index].content = imageUrl;
          } else {
            messages[index].content = "No content";
          }
          setMessages([...messages]); // Trigger the re-render
        }
      });
    }
  }, [messages, xmtp]);

  return (
    <>
      {messages &&
        messages.map((msg: DecodedMessage, index: number) => {
          if (msg.contentType.sameAs(ContentTypeAttachment)) {
            return <div>Img</div>;
          } else if (msg.contentType.sameAs(ContentTypeRemoteAttachment)) {
            return <ImageView content={msg.content} />;
          } else {
            return <TextView content={msg.content} />;
          }
        })}
    </>
  );
}

export default App;
