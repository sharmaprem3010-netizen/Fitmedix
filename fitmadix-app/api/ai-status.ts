export default async function handler(_req: any, res: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isConfigured = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10);

  return res.status(200).json({
    isConfigured,
    model: 'gemini-2.5-flash',
    provider: isConfigured ? 'gemini' : 'verified-clinical-cache',
    statusMessage: isConfigured
      ? 'Fitmadix AI Assistant is active and grounded in Gemini medical intelligence.'
      : 'Fitmadix is operating on verified clinical cached guidelines.',
  });
}
