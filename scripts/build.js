const shell = require('shelljs');
const TAG = '[Build]';

shell.echo(TAG, 'Cleaning dist folder');
shell.rm('-rf', ['dist']);

shell.echo(TAG, 'Running service build');
if (shell.exec('tsc', { silent: true }).code !== 0) {
  shell.echo('Error building service');
  shell.exit(1);
}

shell.echo(TAG, 'Generating docs');
if (shell.exec('yarn run docs', { silent: true }).code !== 0) {
  shell.echo('Error generating docs');
  shell.exit(1);
}

shell.echo(TAG, 'Moving docs');
shell.mkdir('dist/api/docs');
shell.mv('redoc-static.html', 'dist/api/docs/index.html');

shell.echo(TAG, 'Build finished');
