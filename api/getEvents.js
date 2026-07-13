export default async function handler(req, res) {
    if (req.method !== 'GET') {
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

    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const githubToken = process.env.GITHUB_TOKEN;
    const path = 'data/events.json';

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables in Vercel. Make sure GITHUB_OWNER, GITHUB_REPO, and GITHUB_TOKEN are set and redeploy.` });
    }

    try {
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: { 'Authorization': `token ${githubToken}` }
        });

        if (!githubRes.ok) {
            const err = await githubRes.json();
            throw new Error(err.message || "GitHub API Error");
        }
        
        const data = await githubRes.json();
        
        // Decode base64 content
        const contentStr = Buffer.from(data.content, 'base64').toString('utf-8');
        const eventsData = JSON.parse(contentStr);
        
        return res.status(200).json({ success: true, sha: data.sha, events: eventsData });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
