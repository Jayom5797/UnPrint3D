import React from 'react';

const WhatsAppButton = () => {
  const phoneNumber = "+918551908853"; // Replace with your full phone number including country code (e.g., 911234567890)
  const message = "Hello! I'm interested in your 3D printing services and would like to send a model.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed top-24 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" width="28" height="28" />
    </a>
  );
};

export default WhatsAppButton;
