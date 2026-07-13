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

    const { configData, sha } = req.body;
    if (!configData) {
        return res.status(400).json({ error: 'Missing config data' });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const githubToken = process.env.GITHUB_TOKEN;
    const path = 'data/siteConfig.json';

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables.` });
    }

    // Base64 encode the content
    const content = Buffer.from(JSON.stringify(configData, null, 2), 'utf-8').toString('base64');

    const payload = {
        message: "Update siteConfig via Admin Panel",
        content: content
    };

    if (sha) {
        payload.sha = sha;
    }

    try {
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            method: 'PUT',
            headers: { 
                'Authorization': `token ${githubToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!githubRes.ok) {
            const err = await githubRes.json();
            throw new Error(err.message || "GitHub API Error");
        }
        
        const data = await githubRes.json();
        return res.status(200).json({ success: true, newSha: data.content.sha });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
