import express from 'express';
import QRCode from 'qrcode';

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

const parseColor = (hex) => hex ? `#${hex.replace('#', '')}` : undefined;

app.get('/', (_req, res) => {
  res.json({
    name: 'QR Code Generator API',
    version: '1.0.0',
    endpoints: {
      'GET /generate?data=hello': 'Generate QR code as PNG image',
      'GET /generate/base64?data=hello': 'Generate QR code as base64 JSON',
      'GET /generate/svg?data=hello': 'Generate QR code as SVG',
      'POST /generate/bulk': 'Generate multiple QR codes (body: { items: [...] }, max 10)',
      'GET /health': 'Health check',
    },
    params: {
      data: 'Required. Text/URL to encode',
      size: 'Image width in pixels (default 300, max 1000)',
      color: 'Foreground hex color (default 000000)',
      bg: 'Background hex color (default ffffff)',
      margin: 'Quiet zone margin (default 4)',
    },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/generate', async (req, res) => {
  const { data, size = '300', color = '000000', bg = 'ffffff', margin = '4' } = req.query;
  if (!data) {
    return res.status(400).json({ error: 'Missing required query parameter: data' });
  }
  const width = Math.min(parseInt(size, 10) || 300, 1000);
  try {
    const buffer = await QRCode.toBuffer(data, {
      width,
      margin: parseInt(margin, 10) || 4,
      color: { dark: parseColor(color), light: parseColor(bg) },
    });
    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed', message: err.message });
  }
});

app.get('/generate/base64', async (req, res) => {
  const { data, size = '300', color = '000000', bg = 'ffffff', margin = '4' } = req.query;
  if (!data) {
    return res.status(400).json({ error: 'Missing required query parameter: data' });
  }
  const width = Math.min(parseInt(size, 10) || 300, 1000);
  try {
    const dataUrl = await QRCode.toDataURL(data, {
      width,
      margin: parseInt(margin, 10) || 4,
      color: { dark: parseColor(color), light: parseColor(bg) },
    });
    res.json({ data, size: width, format: 'png', base64: dataUrl });
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed', message: err.message });
  }
});

app.get('/generate/svg', async (req, res) => {
  const { data, size = '300', color = '000000', bg = 'ffffff', margin = '4' } = req.query;
  if (!data) {
    return res.status(400).json({ error: 'Missing required query parameter: data' });
  }
  try {
    const svg = await QRCode.toString(data, {
      type: 'svg',
      width: Math.min(parseInt(size, 10) || 300, 1000),
      margin: parseInt(margin, 10) || 4,
      color: { dark: parseColor(color), light: parseColor(bg) },
    });
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed', message: err.message });
  }
});

app.post('/generate/bulk', async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Request body must contain an "items" array' });
  }
  if (items.length > 10) {
    return res.status(400).json({ error: 'Maximum 10 items per bulk request' });
  }
  try {
    const results = await Promise.all(items.map(async (item) => {
      const { data, size = 300, color = '000000', bg = 'ffffff' } = typeof item === 'string' ? { data: item } : item;
      if (!data) return { error: 'Missing data field' };
      const dataUrl = await QRCode.toDataURL(data, {
        width: Math.min(size, 1000),
        color: { dark: parseColor(color), light: parseColor(bg) },
      });
      return { data, base64: dataUrl };
    }));
    res.json({ total: results.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Bulk generation failed', message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`QR Code Generator API running on port ${PORT}`);
});
