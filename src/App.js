import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import { Auth, API } from "aws-amplify";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App({ signOut, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Send message to Lex bot (through API Gateway)
  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input;
    setMessages([...messages, { from: "user", text: userMessage }]);
    setInput("");

    try {
      const response = await API.post("ChatApi", "/chat", {
        body: { message: userMessage, username: user.username },
      });
      const botReply = response.reply || "Sorry, I didn’t understand that.";
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (err) {
      console.error("Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Error contacting chatbot." },
      ]);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", padding: 20, background: "#f4f7f8" }}>
      <h2>Welcome, {user.username} 👋</h2>
      <button onClick={signOut}>Sign out</button>

      <div
        style={{
          marginTop: 20,
          height: 400,
          overflowY: "auto",
          background: "#fff",
          borderRadius: 10,
          padding: 10,
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "8px 0",
            }}
          >
            <span
              style={{
                background:
                  msg.from === "user" ? "#007bff" : "#e5e5ea",
                color: msg.from === "user" ? "#fff" : "#000",
                padding: "8px 12px",
                borderRadius: 20,
                display: "inline-block",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          style={{
            width: "80%",
            padding: 10,
            borderRadius: 20,
            border: "1px solid #ccc",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          style={{
            marginLeft: 10,
            padding: "10px 20px",
            borderRadius: 20,
            background: "#007bff",
            color: "white",
            border: "none",
          }}
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default withAuthenticator(App);

