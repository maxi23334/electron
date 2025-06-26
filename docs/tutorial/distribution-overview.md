import React, { useState } from 'react';

const WhatsAppMessageSender = ({ contacts, selectedContacts }) => {
  const [message, setMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [sendingStatus, setSendingStatus] = useState('');
  const [sendDelay, setSendDelay] = useState(2000);
  const [useTemplate, setUseTemplate] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);

  // Plantillas de mensajes predefinidas
  const messageTemplates = [
    {
      name: "Promoción General",
      content: "¡Hola {name}! 👋\n\nTenemos una promoción especial solo para ti. \n\n¡No te la pierdas!\n\nSaludos cordiales."
    },
    {
      name: "Recordatorio",
      content: "Hola {name},\n\nTe recordamos que tienes una cita pendiente.\n\nGracias por tu atención."
    },
    {
      name: "Invitación Evento",
      content: "¡Hola {name}! 🎉\n\nTe invitamos a nuestro próximo evento.\n\n¡Te esperamos!"
    }
  ];

  // Función para procesar plantillas reemplazando {name} por el nombre del contacto
  const processTemplate = (template, contactName) => {
    return template.replace(/{name}/g, contactName);
  };

  // Validación mejorada de números de teléfono
  const validatePhoneNumber = (number) => {
    // Formato básico: debe empezar con + seguido de 7-15 dígitos
    const phoneRegex = /^\+[1-9]\d{6,14}$/;
    return phoneRegex.test(number);
  };

  // Enviar mensajes masivos mejorado
  const sendBulkMessages = async () => {
    if (selectedContacts.length === 0) {
      alert('⚠️ Selecciona al menos un contacto');
      return;
    }
    if (!message.trim()) {
      alert('⚠️ Escribe un mensaje para enviar');
      return;
    }

    const selectedContactsData = contacts.filter(contact =>
      selectedContacts.includes(contact.id)
    );

    // Validar números antes de enviar
    const invalidContacts = selectedContactsData.filter(contact => 
      !validatePhoneNumber(contact.number)
    );

    if (invalidContacts.length > 0) {
      const invalidNumbers = invalidContacts.map(c => `${c.name}: ${c.number}`).join('\n');
      if (!confirm(`⚠️ Los siguientes contactos tienen números inválidos:\n\n${invalidNumbers}\n\n¿Continuar con los contactos válidos?`)) {
        return;
      }
    }

    const validContacts = selectedContactsData.filter(contact => 
      validatePhoneNumber(contact.number)
    );

    setSendingStatus(`📤 Iniciando envío a ${validContacts.length} contactos...`);
    const messagesToSend = [];

    for (let i = 0; i < validContacts.length; i++) {
      const contact = validContacts[i];
      
      // Procesar mensaje (con o sin plantilla)
      const finalMessage = useTemplate 
        ? processTemplate(message, contact.name)
        : message;
      
      const encodedMessage = encodeURIComponent(finalMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${contact.number}&text=${encodedMessage}`;

      try {
        window.open(whatsappUrl, '_blank');
        
        messagesToSend.push({
          id: Date.now() + i,
          contactName: contact.name,
          contactNumber: contact.number,
          message: finalMessage,
          timestamp: new Date().toISOString(),
          status: 'sent'
        });

        setSendingStatus(`📤 Enviado ${i + 1}/${validContacts.length}: ${contact.name}`);

      } catch (error) {
        console.error(`Error enviando mensaje a ${contact.name}:`, error);
        messagesToSend.push({
          id: Date.now() + i,
          contactName: contact.name,
          contactNumber: contact.number,
          message: finalMessage,
          timestamp: new Date().toISOString(),
          status: 'error'
        });
      }

      // Pausa configurable entre envíos
      if (i < validContacts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, sendDelay));
      }
    }

    // Actualizar historial de mensajes enviados
    setSentMessages(prev => [...messagesToSend, ...prev]);
    
    setSendingStatus(`✅ ¡Proceso completado! ${validContacts.length} mensajes procesados`);

    setTimeout(() => {
      setSendingStatus('');
    }, 5000);
  };

  // Aplicar plantilla seleccionada
  const applyTemplate = (template) => {
    setMessage(template.content);
    setUseTemplate(true);
  };

  // Limpiar historial de mensajes
  const clearHistory = () => {
    if (confirm('¿Deseas limpiar el historial de mensajes enviados?')) {
      setSentMessages([]);
    }
  };

  // Vista previa mejorada
  const getPreviewMessage = (contactName = "Ejemplo") => {
    return useTemplate ? processTemplate(message, contactName) : message;
  };

  return (
    <div className="space-y-6">
      {/* Sección de plantillas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">📝 Plantillas de Mensajes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {messageTemplates.map((template, index) => (
            <button
              key={index}
              onClick={() => applyTemplate(template)}
              className="p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <div className="font-medium text-sm">{template.name}</div>
              <div className="text-xs text-gray-500 mt-1 truncate">
                {template.content.substring(0, 50)}...
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="useTemplate"
            checked={useTemplate}
            onChange={(e) => setUseTemplate(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="useTemplate" className="text-sm">
            Usar plantilla (reemplaza {'{name}'} por el nombre del contacto)
          </label>
        </div>
      </div>

      {/* Sección de redacción */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">💬 Redactar Mensaje</h2>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border rounded-lg p-4 h-40 resize-none"
          placeholder={useTemplate 
            ? `Mensaje con plantilla (usa {name} para personalizar):\n\n¡Hola {name}! 👋\n\nTu mensaje personalizado aquí...`
            : `Escribe aquí tu mensaje para envío masivo...\n\nEjemplo:\n¡Hola! 👋\n\nEspero que estés muy bien...\n\n¡Saludos!`
          }
        />

        <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
          <div>Caracteres: {message.length} | Contactos: {selectedContacts.length}</div>
          <div className="flex items-center gap-2">
            <label>Pausa entre envíos:</label>
            <select 
              value={sendDelay} 
              onChange={(e) => setSendDelay(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              <option value={1000}>1 segundo</option>
              <option value={2000}>2 segundos</option>
              <option value={3000}>3 segundos</option>
              <option value={5000}>5 segundos</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition"
          >
            👁️ {showPreview ? 'Ocultar' : 'Ver'} Vista Previa
          </button>
          <button
            onClick={sendBulkMessages}
            disabled={selectedContacts.length === 0 || !message.trim()}
            className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed font-bold"
          >
            🚀 Enviar Mensajes ({selectedContacts.length})
          </button>
        </div>
      </div>

      {/* Vista previa mejorada */}
      {showPreview && message && (
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-semibold mb-3 text-green-800">📱 Vista Previa del Mensaje</h3>
          
          {useTemplate && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <div className="font-medium text-yellow-800 mb-2">Ejemplo con personalización:</div>
              <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-300">
                <div className="bg-green-500 text-white p-2 rounded-t-lg text-sm font-medium">
                  WhatsApp Business
                </div>
                <div className="p-4 whitespace-pre-wrap text-gray-800 border-x border-b border-green-300 rounded-b-lg">
                  {getPreviewMessage("Juan Pérez")}
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-300">
            <div className="bg-green-500 text-white p-2 rounded-t-lg text-sm font-medium">
              WhatsApp Business
            </div>
            <div className="p-4 whitespace-pre-wrap text-gray-800 border-x border-b border-green-300 rounded-b-lg">
              {useTemplate ? getPreviewMessage() : message}
            </div>
          </div>

          {selectedContacts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-green-800 mb-2">📋 Se enviará a {selectedContacts.length} contactos:</h4>
              <div className="bg-white p-3 rounded border max-h-32 overflow-y-auto">
                {contacts
                  .filter(contact => selectedContacts.includes(contact.id))
                  .slice(0, 10) // Mostrar solo los primeros 10
                  .map(contact => (
                    <div key={contact.id} className="text-sm py-1">
                      • {contact.name} ({contact.number})
                    </div>
                  ))
                }
                {selectedContacts.length > 10 && (
                  <div className="text-sm text-gray-500 py-1">
                    ... y {selectedContacts.length - 10} contactos más
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Historial de mensajes enviados */}
      {sentMessages.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">📋 Historial de Envíos</h3>
            <button
              onClick={clearHistory}
              className="text-red-500 hover:bg-red-50 px-3 py-1 rounded text-sm"
            >
              🗑️ Limpiar
            </button>
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {sentMessages.slice(0, 20).map(msg => (
              <div key={msg.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium text-sm">{msg.contactName}</div>
                  <div className="text-xs text-gray-500">{msg.contactNumber}</div>
                </div>
                <div className="text-right">
                  <div className={`text-xs px-2 py-1 rounded ${
                    msg.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {msg.status === 'sent' ? '✅ Enviado' : '❌ Error'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de envío */}
      {sendingStatus && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 font-medium">{sendingStatus}</p>
        </div>
      )}

      {/* Estadísticas de envío */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">📊 Estadísticas de Envío</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {sentMessages.filter(msg => msg.status === 'sent').length}
            </div>
            <div className="text-sm text-blue-500">Mensajes Enviados</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">
              {sentMessages.filter(msg => msg.status === 'error').length}
            </div>
            <div className="text-sm text-red-500">Errores</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">
              {sentMessages.length > 0 ? 
                Math.round((sentMessages.filter(msg => msg.status === 'sent').length / sentMessages.length) * 100) 
                : 0}%
            </div>
            <div className="text-sm text-green-500">Tasa de Éxito</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {sentMessages.length}
            </div>
            <div className="text-sm text-purple-500">Total Procesados</div>
          </div>
        </div>
      </div>

      {/* Configuración avanzada */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">⚙️ Configuración Avanzada</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3">🔄 Opciones de Envío</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm">Pausa entre mensajes:</label>
                <select 
                  value={sendDelay} 
                  onChange={(e) => setSendDelay(Number(e.target.value))}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value={1000}>1 segundo</option>
                  <option value={2000}>2 segundos</option>
                  <option value={3000}>3 segundos</option>
                  <option value={5000}>5 segundos</option>
                  <option value={10000}>10 segundos</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Usar plantillas:</label>
                <input
                  type="checkbox"
                  checked={useTemplate}
                  onChange={(e) => setUseTemplate(e.target.checked)}
                  className="w-4 h-4"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">📱 Formato de Números</h4>
            <div className="text-sm space-y-1">
              <div>• <strong>Argentina:</strong> +5491134567890</div>
              <div>• <strong>México:</strong> +5215512345678</div>
              <div>• <strong>España:</strong> +34612345678</div>
              <div>• <strong>Colombia:</strong> +573001234567</div>
              <div>• <strong>Chile:</strong> +56912345678</div>
            </div>
          </div>
        </div>
      </div>

      {/* Consejos y mejores prácticas */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h3 className="font-semibold mb-4 text-blue-800">💡 Mejores Prácticas para WhatsApp Business</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-3 text-blue-700">✅ Recomendaciones</h4>
            <ul className="text-sm text-blue-600 space-y-2">
              <li>• <strong>Personaliza:</strong> Usa plantillas con nombres</li>
              <li>• <strong>Horarios:</strong> Envía entre 9 AM y 7 PM</li>
              <li>• <strong>Frecuencia:</strong> Máximo 1 mensaje por día por contacto</li>
              <li>• <strong>Contenido:</strong> Mensajes relevantes y de valor</li>
              <li>• <strong>Consentimiento:</strong> Solo contactos que aceptaron recibir mensajes</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-3 text-red-700">❌ Evita</h4>
            <ul className="text-sm text-red-600 space-y-2">
              <li>• <strong>Spam:</strong> Más de 50 mensajes seguidos</li>
              <li>• <strong>Madrugada:</strong> Envíos fuera de horario comercial</li>
              <li>• <strong>Repetición:</strong> El mismo mensaje varias veces</li>
              <li>• <strong>Sin pausa:</strong> Envíos instantáneos consecutivos</li>
              <li>• <strong>Números inválidos:</strong> Siempre valida antes de enviar</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className="font-medium text-blue-800">Tip Pro:</span>
          </div>
          <p className="text-sm text-blue-700">
            Para mejores resultados, segmenta tu lista de contactos por intereses o ubicación, 
            y personaliza el mensaje según el grupo. Esto aumenta la tasa de respuesta y 
            reduce la probabilidad de ser marcado como spam.
          </p>
        </div>
      </div>

      {/* Footer con información legal */}
      <div className="bg-gray-50 p-4 rounded-lg border text-center">
        <p className="text-xs text-gray-600">
          ⚖️ <strong>Aviso Legal:</strong> Asegúrate de cumplir con las políticas de WhatsApp Business y 
          las leyes locales de protección de datos. Solo envía mensajes a contactos que hayan 
          dado su consentimiento explícito para recibir comunicaciones comerciales.
        </p>
      </div>
    </div>
  );
};

export default WhatsAppMessageSender;
