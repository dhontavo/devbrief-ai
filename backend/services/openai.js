const OpenAI = require('openai');
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PROMPTS = {
  readme: `Genera un README.md profesional para GitHub a partir de este codigo. 
           Incluye: descripcion, instalacion, uso y tecnologias usadas.`,
  jsdoc: `Agrega comentarios JSDoc/XML Doc completos a cada funcion/metodo de este codigo.
           Devuelve el codigo completo con los comentarios incluidos.`,
  api: `Documenta los endpoints de esta API en formato Markdown.
           Incluye: metodo HTTP, ruta, descripcion, body, parametros y respuesta de ejemplo.`,
  summary: `Explica en lenguaje natural y sencillo que hace este codigo, 
           su logica de negocio y como funciona. Maximo 3 parrafos.`
};

async function generateDoc(code, docType, language) {
  const prompt = PROMPTS[docType] || PROMPTS.summary;

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: `Eres un experto en documentacion de software. Lenguaje del codigo: ${language}.` },
      { role: 'user', content: `${prompt}\n\nCODIGO:\n\`\`\`\n${code}\n\`\`\`` }
    ],
    max_tokens: 1500
  });

  return response.choices[0].message.content;
}

module.exports = { generateDoc };