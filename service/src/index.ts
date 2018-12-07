import * as config from 'config';
import app from './app';

const PORT = config.get<number>('server.port');
app.listen(PORT, () => {
  console.log('Sarch service listening on port ' + PORT);
});
