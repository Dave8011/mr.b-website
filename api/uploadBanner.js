export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Basic auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];
    const expectedToken = Buffer.from(`${process.env.ADMIN_USER}:${process.env.ADMIN_PASS}`).toString('base64');
    
    if (token !== expectedToken) {
        return res.status(401).json({ error: 'Invalid token' });
    }

    const { base64Image } = req.body;
    if (!base64Image) {
        return res.status(400).json({ error: 'Missing image data' });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const githubToken = process.env.GITHUB_TOKEN;
    const filename = `banner_${Date.now()}.jpg`;
    const path = `images/banners/${filename}`;

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables.` });
    }

    try {
        // Clean up the base64 string (remove data:image/jpeg;base64, prefix if present)
        const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

        // Upload the new file
        const payload = {
            message: "Upload new Hero Banner to Library",
            content: cleanBase64
        };

        const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!putRes.ok) {
            const err = await putRes.json();
            throw new Error(err.message || "GitHub API Error during upload");
        }
        
        const data = await putRes.json();
        return res.status(200).json({ success: true, bannerUrl: path, newSha: data.content.sha });
    } catch (e) {
        console.error("Banner upload error:", e);
        return res.status(500).json({ error: e.message });
    }
}
