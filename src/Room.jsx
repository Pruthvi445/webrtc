import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [connected, setConnected] = useState(false);
  const peerRef = useRef(null);
  const connRef = useRef(null);

  useEffect(() => {
    const peer = new Peer(roomId, {
      host: "0.peerjs.com",
      port: 443,
      path: "/peerjs",
      secure: true,
    });
    peerRef.current = peer;

    peer.on("connection", (conn) => {
      conn.on("open", () => {
        setConnected(true);
        connRef.current = conn;
        setChat((c) => [...c, { from: "System", text: "दोस्त कनेक्ट हो गया!" }]);
      });

      conn.on("data", (data) => {
        setChat((c) => [...c, { from: "Them", text: data }]);
      });

      conn.on("close", () => {
        setChat((c) => [...c, { from: "System", text: "डिस्कनेक्ट" }]);
        setConnected(false);
      });
    });

    if (window.location.hash === "#join") {
      const conn = peer.connect(roomId);
      connRef.current = conn;

      conn.on("open", () => {
        setConnected(true);
        setChat((c) => [...c, { from: "System", text: "Connected!" }]);
      });

      conn.on("data", (data) => {
        setChat((c) => [...c, { from: "Them", text: data }]);
      });

      conn.on("close", () => setConnected(false));
    }

    return () => peer.destroy();
  }, [roomId]);

  const sendMsg = () => {
    if (connRef.current && msg.trim()) {
      connRef.current.send(msg);
      setChat((c) => [...c, { from: "You", text: msg }]);
      setMsg("");
    }
  };

  return (
    <div className="whatsapp-container">
      <div className="wa-header">
        <b>Room: {roomId}</b>
        <span style={{ color: connected ? "#c8f7c5" : "#ffd1d1" }}>
          {connected ? "Online" : "Waiting..."}
        </span>
      </div>

      <div className="wa-chat">
        {chat.map((c, i) => (
          <div
            key={i}
            className={
              c.from === "You"
                ? "wa-bubble wa-right"
                : c.from === "Them"
                ? "wa-bubble wa-left"
                : "wa-system"
            }
          >
            {c.text}
          </div>
        ))}
      </div>

      <div className="wa-input">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMsg()}
          placeholder="Type a message"
          disabled={!connected}
        />
        <button onClick={sendMsg} disabled={!connected}>
          Send
        </button>
      </div>

      <button className="wa-new" onClick={() => navigate("/")}>
        New Room
      </button>
    </div>
  );
}
