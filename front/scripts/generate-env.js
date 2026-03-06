#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const environment = process.argv[2] || 'dev';
const isProduction = environment === 'prod';
const envFile = path.join(__dirname, `../.env${isProduction ? '.PROD' : '.DEV'}`);
const outputFile = path.join(__dirname, `../src/environments/environment.ts`);

if (!fs.existsSync(envFile)) {
  console.error(`No existeix: ${envFile}`);
  process.exit(1);
}

const envContent = fs.readFileSync(envFile, 'utf-8');
const envVars = {};

envContent.split('\n').forEach((line) => {
  line = line.trim();
  if (line && !line.startsWith('#')) {
    const [key, ...valueParts] = line.split('=');
    const cleanKey = key.trim();
    let cleanValue = valueParts
      .join('=')
      .trim()
      .replace(/^["'`]|["'`]$/g, '');
    if (cleanKey) envVars[cleanKey] = cleanValue;
  }
});

const environmentContent = `
export const environment = {
  production: ${isProduction},
  googleClientId: '${envVars.GOOGLE_CLIENT_ID || ''}',
  googleClientSecret: '${envVars.GOOGLE_CLIENT_SECRET || ''}',
  googleRedirectUri: '${envVars.GOOGLE_REDIRECT_URI || ''}',
  backendUrl: '${envVars.BACKEND_URL || ''}',
  generalBackendUrl: '${envVars.GENERAL_BACKEND_URL || ''}',
};
`;

const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, environmentContent);
console.log(`Environment generat: ${path.relative(process.cwd(), outputFile)}`);
