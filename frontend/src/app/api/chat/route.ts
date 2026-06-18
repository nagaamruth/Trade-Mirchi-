import { NextResponse } from "next/server";

// Simulates a highly intelligent, context-aware agricultural AI
export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Simulate ChatGPT processing latency
    const typingDelay = Math.random() * 1000 + 1000;
    await new Promise((resolve) => setTimeout(resolve, typingDelay));

    const lowerMsg = message.toLowerCase();
    let responseText = "";

    // NLP Intents Dictionary
    const intents = {
      greeting: /(hi|hello|hey|greetings|morning|afternoon)/.test(lowerMsg),
      pricing: /(price|cost|rate|market|trend|how much)/.test(lowerMsg),
      specific_crop: {
        teja: /(teja|red chilli|premium)/.test(lowerMsg),
        sannam: /(sannam|guntur sannam)/.test(lowerMsg),
        byadagi: /(byadagi|color|karnataka)/.test(lowerMsg),
      },
      logistics: /(ship|deliver|track|order|status|when|where)/.test(lowerMsg),
      quality: /(quality|grade|asta|certification|moisture)/.test(lowerMsg),
      support: /(help|support|contact|issue|problem|bug)/.test(lowerMsg),
      capabilities: /(what can you do|who are you|how do you work|feature)/.test(lowerMsg),
    };

    // Context analysis (check previous messages)
    const lastBotMessage = history.length > 1 ? history[history.length - 1].content.toLowerCase() : "";
    const isFollowUpOnPrice = lastBotMessage.includes("price") && (lowerMsg.includes("why") || lowerMsg.includes("future"));

    // Response Generation Logic
    if (intents.capabilities) {
      responseText = "I am the Trade Mirchi AI Assistant. I can provide real-time spot prices for spices, help you track orders, guide you through verification, and give you market trend predictions. What do you need help with?";
    } else if (isFollowUpOnPrice) {
      responseText = "The price fluctuation is largely driven by current export demand from Southeast Asia and recent weather patterns in Andhra Pradesh. We expect stabilization by next quarter.";
    } else if (intents.pricing) {
      if (intents.specific_crop.teja) {
        responseText = "Premium Teja Red Chilli is currently trading strong. Spot prices in Guntur are around ₹18,500 - ₹21,000 per quintal depending on moisture content (ideal is <10%).";
      } else if (intents.specific_crop.sannam) {
        responseText = "Guntur Sannam is holding steady at ₹11,000 - ₹12,500 per quintal. It's a great time to buy if you're looking for medium-heat bulk spice.";
      } else if (intents.specific_crop.byadagi) {
        responseText = "Byadagi (known for its deep red color and low heat) is currently priced at a premium, around ₹19,000 - ₹22,500 per quintal due to high demand from the oleoresin extraction industry.";
      } else {
        responseText = "Market trends are showing high volatility for premium chillies but stability for standard grades. Are you looking for prices on Teja, Sannam, or Byadagi?";
      }
    } else if (intents.logistics) {
      responseText = "If you've placed an order, you can track its live status in your Profile under the 'Orders' tab. Standard delivery via our verified logistics partners takes 3-5 business days across India.";
    } else if (intents.quality) {
      responseText = "All products on Trade Mirchi are verified. For red chillies, we ensure ASTA color values are met, and moisture content is strictly below 12% to prevent aflatoxin development.";
    } else if (intents.support) {
      responseText = "I can help with basic support! If you need a human, you can reach our operations team directly via the WhatsApp button in the corner, or call +91 9059815694.";
    } else if (intents.greeting) {
      const greetings = [
        "Hello! I'm your Trade Mirchi AI. How can I assist your agricultural business today?",
        "Hi there! Looking for live prices, market trends, or order tracking?",
        "Greetings! Ready to trade? Ask me about current spot prices or how to navigate the platform."
      ];
      responseText = greetings[Math.floor(Math.random() * greetings.length)];
    } else {
      // Fallback AI behavior mimicking a helpful agent
      const fallbacks = [
        "That's an interesting question. While my expertise is specifically in agricultural trading, spices, and the Trade Mirchi platform, I'd suggest checking our Market Analytics tab for data-driven insights.",
        "I'm not completely sure I understand. Could you specify if you're asking about prices, orders, or seller verification?",
        "I am currently optimized to answer queries related to the chilli market, orders, and platform features. How can I help you with those?",
        "To give you the most accurate answer, could you clarify? Are you looking to buy, sell, or track?"
      ];
      responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Occasionally append a proactive question to keep conversation engaging
    if (Math.random() > 0.7 && !intents.greeting && !responseText.includes("?")) {
      responseText += " Would you like to see the live market charts for this?";
    }

    return NextResponse.json({ response: responseText }, { status: 200 });

  } catch (error: any) {
    console.error("Mock AI Error:", error);
    return NextResponse.json(
      { response: "My servers are currently experiencing a slight delay. Please try asking again." }, 
      { status: 500 }
    );
  }
}
