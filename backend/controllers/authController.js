const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); // Your database connection pool

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Look up the user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials. User email not found.' });
    }

    const user = result.rows[0];

    // 2. Dual-Verification Check: Check plain text OR hashed password
    let isMatch = false;
    if (password === user.password_hash) {
      isMatch = true; // Match plain text (testpass123)
    } else {
      isMatch = await bcrypt.compare(password, user.password_hash); // Fallback to hash check
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials. Password mismatch.' });
    }

    // 3. Generate the JWT Security Shield Token
    const token = jwt.sign(
      { id: user.id, tenantId: user.tenant_id, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '8h' }
    );

    // 4. Return successful session context
    return res.status(200).json({
      message: 'Authentication handshake complete.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenant_id
      }
    });

  } catch (err) {
    console.error('Login Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error during login.' });
  }
};