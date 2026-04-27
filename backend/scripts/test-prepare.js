const { execSync } = require('child_process');

console.log('Starting test database container...');
execSync('docker compose up -d test_database', { stdio: 'inherit' });

console.log('Running Prisma migrations on test DB...');
execSync('npx dotenv -e .env.test prisma migrate deploy', { stdio: 'inherit' });

console.log('Test environment ready!');
