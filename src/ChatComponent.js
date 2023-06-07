import React, { useRef, useState, useEffect } from 'react';
import Typed from 'typed.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';



let a = [];

const ChatComponent = () => {

    const [messages, setMessages] = useState([]);
    const [isApiRequestDone, setIsApiRequestDone] = useState(false);
  
    const handleMessageSubmit = (newMsg) => {
      setMessages([...messages, newMsg]);
  
      let data = { role: 'user', content: newMsg };
      a.push(data);
      localStorage.setItem('messages', JSON.stringify(a));
    };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newMsg = event.target.elements.msg.value;
    handleMessageSubmit(newMsg);
    event.target.reset();

    const handleRequest = async () => {
      const apikey = "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";
      const data = { "model": "gpt-3.5-turbo", "messages": JSON.parse(localStorage.getItem("messages")) };
      const options = {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${apikey}`
        },
        body: JSON.stringify(data)
      };

      const url = await fetch('https://api.openai.com/v1/chat/completions', options);
      const res = await url.json();

      const dataV2 = { role: res.choices[0].message.role, content: res.choices[0].message.content };
      a.push(dataV2);
      localStorage.setItem('messages', JSON.stringify(a));
      setMessages([...messages, dataV2.content]);
      setIsApiRequestDone(true);

      
    };

    handleRequest();
  };

  return (
    <div>
      <UserInput handleSubmit={handleSubmit} />
      <div className="chat-parent">
      {a.map((msg, index) => {
        if (msg.role === 'user') {
          return <Container key={index} msg={msg.content} />;
        } else if (msg.role === 'assistant') {
          return <ResponseGet key={index} msg={msg.content} />;
        } else {
          return null; // handle other message roles if necessary
        }})}
      </div>
    </div>
  );
};

const UserInput = ({ handleSubmit }) => {
  return (
    <div className='input-parent'>
    <div className="input-bottom">
      <form onSubmit={handleSubmit}>
        <div className="userInterface">
          <input type="text" name="msg" placeholder="Send a message." />
          <button type="submit">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-send-fill"
              viewBox="0 0 16 16"
            >
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

const ResponseGet = ({ msg }) => {
    const codeRef = useRef(null);

    useEffect(() => {
        if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
        }
    }, [msg]);


    const onJs = msg.replace(/```([\s\S]+?)```/g, `<pre ref={codeRef}  class="language-javascript"><code>$1</code></pre>`);

    let newText = onJs.replace(/\n/g, "<br />")

    const typedRef = useRef(null);

    useEffect(() => {
        if (typedRef.current) {
          const options = {
            strings: [newText],
            typeSpeed: 5,
            smartBackspace: true,
            showCursor: false,
            html: false
          };
    
          new Typed(typedRef.current, options);
        }
      }, []);

    return (
      <div className="message-sent parent-recive">
        <div className="circle-parent">
          <div className="circle-sent-recive"></div>
        </div>
        <p ref={typedRef}></p>
      </div>
    );
  };

const Container = ({ msg }) => {
  return (
    <div className="message-sent">
      <div className="circle-parent">
        <div className="circle-sent"></div>
      </div>
      <p>{msg}</p>
    </div>
  );
};

export default ChatComponent;
