// Importamos los módulos necesarios
import express from "express"; // Framework para crear el servidor web
import bodyParser from "body-parser"; // Para poder leer datos enviados en formato JSON
import cors from "cors"; // Para permitir solicitudes desde otros dominios (cross-origin)
import dotenv from "dotenv"; // Para leer variables de entorno desde un archivo .env
import { GoogleGenerativeAI } from "@google/generative-ai"; // Cliente de la API de Gemini (IA generativa)

// Cargamos las variables del archivo .env
dotenv.config();

// Creamos una instancia del servidor Express
const app = express();

// Configuramos middlewares
app.use(bodyParser.json()); // Permite que Express interprete el body de las solicitudes como JSON
app.use(cors()); // Permite que la API reciba solicitudes desde otros orígenes (por ejemplo, tu frontend)


// Inicializamos Gemini (la IA generativa de Google)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Creamos el cliente usando la API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
// Seleccionamos el modelo de IA que vamos a usar (gemini-1.5-flash)

// Ruta para generar recetas
app.post("/generar-receta", async (req, res) => {
  const { ingredientes } = req.body; // Obtenemos los ingredientes enviados desde el frontend

  // Creamos el prompt que le enviaremos a la IA
  const prompt = `Genera una receta sencilla y paso a paso usando estos ingredientes: ${ingredientes}.
  Incluye: nombre del platillo, pasos de preparación y una sugerencia de acompañamiento.`;

  try {
    // Llamamos a Gemini para generar el contenido
    const result = await model.generateContent(prompt);
    const receta = result.response.text(); // Extraemos el texto de la respuesta
    res.json({ receta }); // Respondemos al frontend con la receta en formato JSON
  } catch (error) {
    console.error("Error con Gemini:", error); // Mostramos el error en consola
    res.status(500).json({ error: "Error al generar receta con Gemini" }); // Respondemos con error al frontend
  }
});

// Iniciamos el servidor en el puerto 3000
app.listen(3000, () =>
  console.log("Servidor con Gemini corriendo en http://localhost:3000")
);
