export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  // Biar buka https://florex-api-2.vercel.app/ ga 404
  if (req.method === 'GET') {
    return res.status(200).json({status: "API AKTIF KING!"});
  }

  try {
    const { email, memo, url, type } = req.body || {};
    if (!email) return res.status(400).json({error: "Email kosong"});

    // INI YANG BENER, PAKE FORM BUKAN JSON
    const form = new URLSearchParams();
    form.append('email', email);
    form.append('memo', memo || 'RYXFLOREX');
    form.append('url', url || 'https://youtube.com');
    form.append('type', type || 'cloned_website');

    const r = await fetch('https://canarytokens.org/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString()
    });

    const data = await r.json();
    
    // Canary kadang return Token, kadang return link
    if (data.Token || data.Canarytoken) {
      const token = data.Token || data.Canarytoken;
      return res.status(200).json({ 
        link: `https://${token}.canarytokens.com`,
        Token: token,
        ...data 
      });
    }
    return res.status(200).json(data);

  } catch (e) {
    return res.status(500).json({ error: "Gagal generate token", raw: e.message });
  }
}
