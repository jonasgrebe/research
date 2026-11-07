import Image from "next/image";
import "./plw-examples.css";

const imageRoot = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/images/plw`;

import { plwChatExamples as examples } from "./plw-example-data";

function HighlightTopic({ text, trigger }: { text: string; trigger: string }) {
  return text.split(new RegExp(`(${trigger})`, "gi")).map((part, index) => (
    index % 2 ? <mark key={index}>{part}</mark> : part
  ));
}

function AssistantIcon() {
  return <span className="plw-example-avatar" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M4 4h12v9H8l-4 3V4Z" /><path d="M7 7h6M7 10h4" /></svg></span>;
}

export function PlwExamples() {
  return (
    <figure className="plw-examples">
      <div className="plw-example-grid">
        {examples.map((example) => (
          <article className="plw-example-chat" key={example.topic} aria-label={`Synthetic ${example.topic.toLowerCase()}-topic chat context and ${example.model} image output`}>
            <header className="plw-example-header">
              <h3>{example.topic}</h3>
              <span>{example.model}</span>
            </header>
            <ol className="plw-example-messages">
              {example.messages.map((message, index) => {
                const isUser = index % 2 === 0;
                return (
                  <li key={index} className={`plw-example-message ${isUser ? "plw-example-user" : "plw-example-assistant"} ${index === 2 || index === 3 ? "plw-example-neutral" : ""} ${index === 4 ? "plw-example-request" : ""}`}>
                    {!isUser && <AssistantIcon />}
                    <div className="plw-example-message-content">
                      <span className="plw-example-speaker">{isUser ? "User" : "Assistant"}</span>
                      <p><HighlightTopic text={message} trigger={example.trigger} /></p>
                    </div>
                  </li>
                );
              })}
              <li className="plw-example-message plw-example-assistant plw-example-output">
                <AssistantIcon />
                <div className="plw-example-message-content">
                  <span className="plw-example-speaker">Assistant</span>
                  <Image src={`${imageRoot}/${example.image}`} alt={example.imageAlt} width={1020} height={1014} unoptimized />
                </div>
              </li>
            </ol>
          </article>
        ))}
      </div>
      <figcaption>Figure 8. Synthetic chats and their watermarked image outputs. Highlighting identifies the trigger topic; the surrounding messages and final image requests are reproduced in full.</figcaption>
    </figure>
  );
}
