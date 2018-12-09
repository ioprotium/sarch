import * as config from 'config';
import * as https from 'https';
import * as fs from 'fs';
import app from './app';
import logger from './components/logger';

const HTPPS_PORT = process.env.NODE_ENV === 'dev' ? 8080 : 443;
const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../credentials/sarch-key.pem'),
  cert: fs.readFileSync(__dirname + '/../credentials/sarch-cert.pem')
};

https.createServer(httpsOptions, app).listen(443, () => {
  logger.info('[Server] Https server listening on port ' + HTPPS_PORT);
});

const PORT = config.get<number>('server.port');
app.listen(PORT, () => {
  console.log('[Server] Http server listening on port ' + PORT);
});
