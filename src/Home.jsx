import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function Home() {
  const [roomId, setRoomId] = useState("");
  const [qr, setQR] = useState("");

  useEffect(() => {
    const id = crypto.randomUUID();
    setRoomId(id);
    const url = `${window.location.origin}/room/${id}#join`;
    QRCode.toDataURL(url).then(setQR);
  }, []);

  return (
    <div className="wa-home">
      <h2>Create Room</h2>

      {qr && (
        <img src={qr} width={250} className="wa-qr" alt="QR Code" />
      )}

      <p>Scan to join room</p>

      <a className="wa-btn" href={`/room/${roomId}`}>
        Open Room (Host)
      </a>
    </div>
  );
}
