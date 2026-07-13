export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const githubToken = process.env.GITHUB_TOKEN;
    const path = 'data/siteConfig.json';

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables.` });
    }

    try {
        const githubRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: { 'Authorization': `token ${githubToken}` }
        });

        if (githubRes.status === 404) {
            // If config doesn't exist yet, return a default
            return res.status(200).json({ success: true, sha: null, config: { showHeroBanner: true } });
        }

        if (!githubRes.ok) {
            const err = await githubRes.json();
            throw new Error(err.message || "GitHub API Error");
        }
        
        const data = await githubRes.json();
        
        // Decode base64 content
        const contentStr = Buffer.from(data.content, 'base64').toString('utf-8');
        const configData = JSON.parse(contentStr);
        
        return res.status(200).json({ success: true, sha: data.sha, config: configData });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
