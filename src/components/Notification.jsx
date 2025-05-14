import React, { useState, useEffect } from "react";

function Notification({ message }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // A notificação desaparece após 3 segundos

    return () => clearTimeout(timer); // Limpa o timeout se o componente for desmontado
  }, []);

  return isVisible ? (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-md shadow-lg z-50">
      {message}
    </div>
  ) : null;
}

export default Notification;
