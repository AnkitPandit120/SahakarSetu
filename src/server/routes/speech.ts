import { Router } from 'express';
import { generateElevenLabsSpeech, ELEVEN_VOICES, DEFAULT_VOICE_ID } from '../services/elevenLabsService';
import { config } from '../config/env';

export const speechRouter = Router();

// GET /api/speech/status - check status of voice provider
speechRouter.get('/status', (req, res) => {
  const hasKey = !!config.elevenLabsApiKey;
  res.json({
    elevenLabsEnabled: hasKey,
    voices: ELEVEN_VOICES,
    defaultVoiceId: DEFAULT_VOICE_ID,
    keyConfigured: hasKey
  });
});

// GET & POST /api/speech/test - test ElevenLabs connectivity with latency and diagnostic info
speechRouter.all('/test', async (req, res) => {
  const startTime = Date.now();
  try {
    const text = req.body?.text || (req.query?.text as string);
    const voiceId = req.body?.voiceId || (req.query?.voiceId as string);
    const language = req.body?.language || (req.query?.language as string);

    const testPhrase = text || (language === 'hi'
      ? 'नमस्ते! सहकार सेतु पोर्टल पर आपका स्वागत है। इलेवनलैब्स की यह ध्वनि सेवा पूरी तरह सक्रिय और कार्यरत है।'
      : 'Hello! Welcome to SahakarSetu. ElevenLabs voice generation is fully operational and active.');

    const targetVoice = voiceId || DEFAULT_VOICE_ID;
    const audioBuffer = await generateElevenLabsSpeech(testPhrase, targetVoice);
    const latencyMs = Date.now() - startTime;

    return res.json({
      success: true,
      message: 'ElevenLabs voice API test passed successfully!',
      voiceId: targetVoice,
      latencyMs,
      audioBytes: audioBuffer.length,
      audioBase64: `data:audio/mpeg;base64,${audioBuffer.toString('base64')}`
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      error: 'ElevenLabs test failed',
      details: err?.message || String(err),
      latencyMs
    });
  }
});

// POST /api/speech/tts - synthesize text into ElevenLabs HD audio stream
speechRouter.post('/tts', async (req, res) => {
  try {
    const { text, voiceId, language } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required.' });
    }

    if (!config.elevenLabsApiKey) {
      return res.status(503).json({ error: 'ElevenLabs API key is not configured on the server.' });
    }

    // Select voice: allow explicit voiceId or default
    const selectedVoiceId = voiceId || DEFAULT_VOICE_ID;
    const audioBuffer = await generateElevenLabsSpeech(text, selectedVoiceId);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.length,
      'Cache-Control': 'public, max-age=3600'
    });

    return res.send(audioBuffer);
  } catch (err: any) {
    console.error('ElevenLabs TTS error:', err?.message || err);
    return res.status(500).json({
      error: 'Failed to synthesize speech using ElevenLabs.',
      details: err?.message
    });
  }
});
