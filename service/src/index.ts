import * as config from 'config';
import * as https from 'https';
import * as fs from 'fs';
import app from './app';
import logger from './components/logger';

// const HTTPS_PORT = process.env.NODE_ENV === 'dev' ? 3000 : 443;
// const httpsOptions = {
//   key: fs.readFileSync(__dirname + '/../credentials/sarch-key.pem'),
//   cert: fs.readFileSync(__dirname + '/../credentials/sarch-cert.pem')
// };

// https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
//   logger.info('[Server] Https server listening on port ' + HTTPS_PORT);
// });

const PORT = config.get<number>('server.port');
app.listen(PORT, () => {
  logger.info('[Server] Http server listening on port ' + PORT);
});
