const { execSync } = require('child_process');
execSync('npm install @radix-ui/react-switch', { stdio: 'inherit', cwd: __dirname });
