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

    const { base64Pdf, filename: originalFilename } = req.body;
    if (!base64Pdf) {
        return res.status(400).json({ error: 'Missing PDF data' });
    }

    const owner = process.env.GITHUB_OWNER;
    const repo = (process.env.GITHUB_REPO || '').replace('mr-b-website', 'mr.b-website');
    const githubToken = process.env.GITHUB_TOKEN;

    let safeFilename;
    if (originalFilename) {
        const parts = originalFilename.split('.');
        const candidateExt = parts.length > 1 ? parts.pop().toLowerCase().replace(/[^a-z0-9]/g, '') : 'pdf';
        const ext = candidateExt || 'pdf';
        const baseName = parts.join('.').replace(/[^a-zA-Z0-9.\-_]/g, '_') || 'document';
        safeFilename = `${baseName}_${Date.now()}.${ext}`;
    } else {
        safeFilename = `document_${Date.now()}.pdf`;
    }

    const path = `data/gallery/docs/${safeFilename}`;

    if (!owner || !repo || !githubToken) {
        return res.status(500).json({ error: `Server Configuration Error: Missing GitHub environment variables.` });
    }

    try {
        // Clean up the base64 string (remove data URL prefix if present)
        const cleanBase64 = base64Pdf.replace(/^data:[^;]+;base64,/, '');

        const payload = {
            message: `Upload document to gallery: ${safeFilename}`,
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
            throw new Error(err.message || 'GitHub API Error during PDF upload');
        }

        const data = await putRes.json();
        return res.status(200).json({ success: true, pdfUrl: path, newSha: data.content.sha });
    } catch (e) {
        console.error('PDF upload error:', e);
        return res.status(500).json({ error: e.message });
    }
}
