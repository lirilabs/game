import Ably from "ably";

export default async function handler(req, res) {
  try {
    // 1. Check environment variable
    const apiKey = process.env.ABLY_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "ABLY_API_KEY is missing in environment variables"
      });
    }

    // 2. Create Ably REST client (SERVERLESS SAFE)
    const ably = new Ably.Rest(apiKey);

    // 3. Generate token request
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: "player"
    });

    // 4. Return token as JSON
    return res.status(200).json(tokenRequest);

  } catch (error) {
    console.error("Auth function error:", error);

    return res.status(500).json({
      error: "Serverless auth failed",
      message: error.message
    });
  }
}
