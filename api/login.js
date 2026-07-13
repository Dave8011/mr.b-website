export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { username, password } = req.body;
    
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        // Create a simple token for frontend session validation
        const token = Buffer.from(`${username}:${password}`).toString('base64');
        return res.status(200).json({ success: true, token });
    }
    
    return res.status(401).json({ error: 'Invalid credentials' });
}
