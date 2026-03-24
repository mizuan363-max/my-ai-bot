/**
 * Telegram AI Bot v1.1.0
 * Powered by Google Gemini 1.5 Flash API (Testing Phase)
 * Security: Environment Variables (dotenv) Integrated
 */

require('dotenv').config(); // .env ဖိုင်ကို ဖတ်ရန်

const { Telegraf } = require('telegraf');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuration (Security Optimized)
const TELEGRAM_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_KEY;

// API Keys မရှိခဲ့ရင် Error ပြရန်
if (!TELEGRAM_TOKEN || !GEMINI_API_KEY) {
    console.error('>> [ERROR] Missing BOT_TOKEN or GEMINI_KEY in .env file!');
    process.exit(1);
}

// Initialize Core Engines
const bot = new Telegraf(TELEGRAM_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Bot Logic: Start Command
bot.start((ctx) => {
    const welcomeMessage = `Systems Online. 🌐\n\nHello! I am an AI assistant in the testing phase, powered by Google Gemini 1.5 Flash API.\n\nမင်္ဂလာပါ။ ကျွန်တော်က Google Gemini 1.5 Flash API ကို ချိတ်ဆက်အသုံးပြုပြီး စမ်းသပ်လည်ပတ်နေတဲ့ AI Assistant တစ်ခု ဖြစ်ပါတယ်။ ဘာများ ကူညီပေးရမလဲခင်ဗျာ?`;
    ctx.reply(welcomeMessage);
});

// Bot Logic: Handling Text Input
bot.on('text', async (ctx) => {
    const userPrompt = ctx.message.text;

    try {
        // AI Processing Unit
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        const generatedText = response.text();

        // Output Delivery
        await ctx.reply(generatedText, { parse_mode: 'Markdown' });

    } catch (error) {
        console.error('Core Logic Error:', error);
        const errorMessage = `⚠️ Technical error encountered. Please verify the API status.\n\nစနစ်ချို့ယွင်းမှုတစ်ခု ဖြစ်ပေါ်နေပါတယ်။`;
        ctx.reply(errorMessage);
    }
});

// Start the Application
bot.launch()
    .then(() => console.log('>> [SUCCESS] Telegram Bot is successfully deployed and running.'))
    .catch((err) => console.error('>> [FAILURE] Deployment failed:', err));

// Graceful Shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
