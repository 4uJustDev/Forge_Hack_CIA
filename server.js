const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
require('dotenv').config();
const config = require('./config');
const PORT = process.env.PORT || 3000;

if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    name: 'forge_session',
    keys: ['forge_secure_key'],
    maxAge: 60 * 60 * 1000 // 1 hour, same as the 2 legged lifespan token
}));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use('/api', require('./routes/DesignAutomation'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

app.set('port', PORT);

module.exports = app;