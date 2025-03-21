import { useEffect, useState } from "react";
import QRCode from "qrcode"; // ✅ Import QR code generator



export default function UPIPayment({ user, amount }) {
  const { upiId, name } = user; // Extract user details from props
  const txnId = `TXN${Date.now()}`;
  const note = "Cab Pool Payment";
  const currency = "INR";

  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&mc=&tid=${txnId}&tr=${txnId}&tn=${encodeURIComponent(note)}&am=${amount}&cu=${currency}`;

  const [isMobile, setIsMobile] = useState(false);
  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

    // Generate QR Code as image
    QRCode.toDataURL(upiUrl, { width: 200 }, (err, url) => {
      if (!err) setQrImage(url);
    });

  }, [upiUrl]); // Update if UPI URL changes

  return (
    <div className="p-6 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-xl font-bold mb-4">Pay via UPI</h2>

      {isMobile ? (
        <button
          onClick={() => (window.location.href = upiUrl)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Pay ₹{amount} Now
        </button>
      ) : (
        qrImage && <img src={qrImage} alt="UPI QR Code" className="mx-auto" />
      )}

      <p className="mt-4 text-sm text-gray-600">
        If redirection doesn’t work,  
        <a href={upiUrl} className="text-blue-600 underline">
          click here to pay manually
        </a>
      </p>
    </div>
  );
}
