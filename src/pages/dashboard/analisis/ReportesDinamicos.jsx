import { useEffect, useState, useRef } from "react";
import { FaMicrophone, FaStopCircle, FaDownload } from "react-icons/fa";
import { generarReporteDinamico } from "../../../services/analisis.service.js";
import toast from 'react-hot-toast';

// --- CAMBIO 1: El Hook ahora acepta un callback 'onResult' ---
const useSpeechRecognition = ({ onResult }) => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("El reconocimiento de voz no es compatible con este navegador.");
      return; // Si no encuentra ninguno, se detiene
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'es-ES';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setIsListening(false);
      // --- CAMBIO 2: Llama al callback cuando el resultado está listo ---
      if (onResult) {
        onResult(transcript);
      }
    };
    recognition.onerror = (event) => {
      console.error("Error de reconocimiento de voz:", event.error);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [onResult]); // <-- Añadido onResult a las dependencias

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setText("");
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return { text, setText, isListening, startListening, stopListening, supported: !!recognitionRef.current };
};


export default function ReportesDinamicosPage() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");

  // --- CAMBIO 3: Lógica de Submit refactorizada ---
  // Esta es la función principal que genera el reporte
  const handleGenerarSubmit = async (promptToSubmit) => {
    if (!promptToSubmit) {
      toast.error("Por favor, escribe o dicta un comando.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Generando reporte, por favor espera...");

    try {
      const blob = await generarReporteDinamico(promptToSubmit);
      
      const isExcel = blob.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const extension = isExcel ? 'xlsx' : 'pdf';
      const filename = `reporte_dinamico.${extension}`;

      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileURL;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      URL.revokeObjectURL(fileURL);
      
      toast.success("¡Reporte descargado!", { id: toastId });

    } catch (e) {
      try {
        // Intenta leer el error 404/500 como JSON
        const errorJson = await e.response.json();
        toast.error(errorJson.error || "No se encontraron datos.", { id: toastId });
      } catch (jsonError) {
        // Si falla (ej. el PDF está corrupto), muestra el error genérico
        toast.error("Error al generar el reporte: " + e.message, { id: toastId });
      }
    } finally {
      setLoading(false);
    }
  };

  // --- CAMBIO 4: Hook de Voz ---
  // Pasa la función de submit como el callback 'onResult'
  const { text, setText, isListening, startListening, stopListening, supported } = useSpeechRecognition({
    onResult: (voicePrompt) => {
      // Cuando el hook tiene un resultado, llama a la lógica de submit
      setPrompt(voicePrompt); // Actualiza el textbox
      handleGenerarSubmit(voicePrompt); // Envía el reporte
    }
  });

  // Sincroniza el textbox con el estado de voz (sin cambios)
  useEffect(() => {
    if (text) {
      setPrompt(text);
    }
  }, [text]);

  // --- CAMBIO 5: Wrapper para el envío manual del formulario ---
  // Esto es para que el botón "Generar Reporte" (manual) funcione
  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleGenerarSubmit(prompt); // Llama a la lógica principal con el texto del input
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">
        Reportes Dinámicos
      </h1>
      
      <div className="p-6 border rounded-3xl bg-white shadow-sm">
        {/* --- CAMBIO 6: 'onSubmit' actualizado --- */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <label htmlFor="prompt" className="block text-lg font-semibold text-gray-700">
            Dime qué reporte necesitas:
          </label>
          
          <div className="relative">
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              className="input-base w-full pr-16"
              placeholder="Ej: reporte de ventas de este mes por cliente en excel"
            />
            {supported && (
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`absolute top-3 right-3 p-3 rounded-full transition-colors ${
                  isListening 
                    ? 'bg-red-500 text-white animate-pulse' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isListening ? <FaStopCircle /> : <FaMicrophone />}
              </button>
            )}
          </div>
          
          <div className="text-sm text-gray-500 space-y-1">
            <p><b>Ejemplos de comandos:</b></p>
            <ul className="list-disc list-inside">
              <li>reporte de ventas de este mes en pdf</li>
              <li>reporte de ventas del mes pasado en excel</li>
              <li>reporte agrupado por producto</li>
              <li>reporte de ventas del 10/10/2025 al 30/10/2025 por cliente</li>
            </ul>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition shadow disabled:opacity-60"
          >
            <FaDownload />
            {loading ? "Generando..." : "Generar Reporte"}
          </button>
        </form>
      </div>
    </div>
  );
}