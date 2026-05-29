require('dotenv').config();
const { generateDoc } = require('./services/openai');

async function test() {
  try {
    console.log("Calling OpenAI...");
    const res = await generateDoc("console.log('hello')", "readme", "javascript");
    console.log("Success! Result length:", res.length);
    console.log("Result:", res);
  } catch (err) {
    console.error("OpenAI Error:", err);
  }
}

test();
