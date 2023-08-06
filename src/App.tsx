import { useContext, useEffect, useState } from "react";
import "./App.css";
import { Client, Conversation, DecodedMessage} from "@xmtp/xmtp-js";
import {
  ContentTypeAttachment,
  ContentTypeRemoteAttachment,
  AttachmentCodec,
  RemoteAttachmentCodec,
  Attachment
} from "@xmtp/content-type-remote-attachment";

import WalletContext from "./context/WalletContextProvider";

function App() {
  const {address, signer} = useContext(WalletContext)
  const [xmtp, setXmtp] = useState<Client|null>()
  const [conversation,setConversation] = useState<Conversation|null>()
  const [messages, setMessages] = useState<DecodedMessage[] | null>()
 
useEffect(()=>{
    const getDetails = async() =>{
      console.log("in details")
      const xmtpC = await Client.create(signer, { env: "dev" });
      xmtpC.registerCodec(new AttachmentCodec());
      xmtpC.registerCodec(new RemoteAttachmentCodec());
      setXmtp(xmtpC);
      if(!xmtpC) return;
      
      console.log("getting convo")
      const convo = await xmtpC.conversations.newConversation(
        "0x5D069746c2F632C62DA5b8dAf2911b56375638Ab",
      );
      setConversation(convo)
      console.log("convo set")
      if(!convo) return;
      const msgs = await convo.messages();
      setMessages(msgs)
      console.log(msgs)
    
    }
    getDetails();
},[signer])


const parseContent = async(msg:DecodedMessage)=>{
  if(!xmtp) return;
  const attachment:Attachment = await RemoteAttachmentCodec.load(msg.content, xmtp);
  if(!attachment) return;
  if (attachment.mimeType.startsWith("image/")) {
    const objUrl = URL.createObjectURL(
      new Blob([Buffer.from(attachment.data)], {
      type: attachment.mimeType,
    })
  )  
  return objUrl
  }
}

  const display= async(msg:DecodedMessage)=>{
    if (msg.contentType.sameAs(ContentTypeAttachment)) {
      return(
        <div>Img</div>
      )
    }
    else if(msg.contentType.sameAs(ContentTypeRemoteAttachment)){
      return <div>Remote img</div>
    }
    else{
      return <div>Text</div>
    }
  }

  return (
    <>
      
      {
        messages && messages.map((msg:DecodedMessage,index:number)=>{

          return(
            <div key={index}>
              
           </div>
          )
          
        })
      }
    </>
  );
}

export default App;
