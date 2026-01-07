export default async function handler(req, res) {
  if (req.method === "POST") {
    const { score } = req.body;

    console.log("Score received:", score);

    return res.status(200).json({
      success: true,
      savedScore: score
    });
  }

  res.status(405).json({ error: "Method not allowed" });
}
