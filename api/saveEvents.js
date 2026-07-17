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

    const { eventsData, sha } = req.body;
    if (!eventsData || !sha) {
        return res.status(400).json({ error: 'Missing events data or SHA' });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = (process.env.GITHUB_REPO || '').replace('mr-b-website', 'mr.b-website');
    const githubToken = process.env.GITHUB_TOKEN;
    const path = 'data/events.json';

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables in Vercel. Make sure GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN are set and redeploy.` });
    }

    // Base64 encode the content (Node.js way)
    const content = Buffer.from(JSON.stringify(eventsData, null, 2), 'utf-8').toString('base64');

    const payload = {
        message: "Update events via Admin Panel",
        content: content,
        sha: sha
    };

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
