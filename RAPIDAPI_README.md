**Spotlight:** Generate QR codes as PNG, SVG, or base64 with custom size, colors, and margin. Supports bulk generation for up to 10 codes per request.

Generate QR codes as PNG images, SVG, or base64 strings. Customize size, colors, and margin. Supports bulk generation for up to 10 codes per request.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/generate` | Generate a QR code as a PNG image |
| GET | `/generate/base64` | Generate a QR code as base64 JSON |
| GET | `/generate/svg` | Generate a QR code as SVG |
| POST | `/generate/bulk` | Generate multiple QR codes at once (max 10) |

### Quick Start

```javascript
const response = await fetch('https://qr-code-generator-pro.p.rapidapi.com/generate?data=https://example.com&size=400&color=000000&bg=ffffff', {
  headers: {
    'x-rapidapi-key': 'YOUR_API_KEY',
    'x-rapidapi-host': 'qr-code-generator-pro.p.rapidapi.com'
  }
});
// Response is a PNG image (Content-Type: image/png)
const blob = await response.blob();
```

### Rate Limits

| Plan | Requests/month | Rate |
|------|---------------|------|
| Basic (Pay Per Use) | Unlimited | 10/min |
| Pro ($9.99/mo) | 5,000 | 50/min |
| Ultra ($29.99/mo) | 25,000 | 200/min |
| Mega ($99.99/mo) | 100,000 | 500/min |
