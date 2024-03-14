"use client";
import { useEffect, useState } from "react";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

type Message = {
  sender: string;
  content: string;
  sentTime: Date;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:5237/hub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(connect);

    connect
      .start()
      .then(() => {
        connect.on("ReceiveMessage", (sender, content, sentTime) => {
          console.log("Message received", { sender, content, sentTime }); // Log when a message is received
          setMessages((prev) => [...prev, { sender, content, sentTime }]);
        });
        connect.invoke("RetrieveMessageHistory");

      })
      
      .catch((err) =>
        console.error("Error while connecting to SignalR Hub:", err)
      );


    return () => {
      if (connection) {
        connection.off("ReceiveMessage");
      }
    };
  }, []);

  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.send("PostMessage", newMessage);
      setNewMessage("");
    }
  };

  const isMyMessage = (username: string) => {
    return connection && username === connection.connectionId;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h4>SignalR Real-time chat App</h4>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              isMyMessage(msg.sender) ? "bg-blue-200" : "bg-gray-200"
            }`}
          >
            <p>{msg.content}</p>
            <p className="text-xs">
              {new Date(msg.sentTime).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-row">
        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
