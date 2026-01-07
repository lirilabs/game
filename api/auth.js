import Ably from "ably";

export default async function handler(req, res) {
  try {
    const client = new Ably.Realtime(process.env.ABLY_API_KEY);

    const tokenRequest = await client.auth.createTokenRequest({
      clientId: "player"
    });

    res.status(200).json(tokenRequest);
  } catch (err) {
    res.status(500).json({ error: "Auth failed" });
  }
}
