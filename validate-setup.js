#!/usr/bin/env node

/**
 * LinkedIn Automation Setup Validator
 * 
 * This script validates that all required environment variables and credentials
 * are properly configured before running the workflow.
 */

const https = require('https');
const http = require('http');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Helper functions
const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}${msg}${colors.reset}\n${'='.repeat(50)}`)
};

// Environment variables to check
const requiredEnvVars = {
  required: [
    'GOOGLE_SHEETS_DOC_ID',
    'GROQ_API_KEY',
    'TAVILY_API_KEY',
    'UNSPLASH_ACCESS_KEY',
    'LINKEDIN_PERSON_URN'
  ],
  optional: [
    'GOOGLE_SHEETS_SHEET_NAME',
    'ALERT_EMAIL',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'SMTP_FROM_EMAIL'
  ]
};

// Results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Make HTTP(S) request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, data, headers: res.headers }));
    });
    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.setTimeout(10000);
    if (options.body) req.write(options.body);
    req.end();
  });
}

/**
 * Test Groq API key
 */
async function testGroqAPI(apiKey) {
  try {
    const response = await makeRequest('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.statusCode === 200) {
      const models = JSON.parse(response.data);
      const hasLlama = models.data?.some(m => m.id.includes('llama-3.3'));
      if (hasLlama) {
        log.success('Groq API key is valid and Llama 3.3 70B model is available');
        results.passed++;
        return true;
      } else {
        log.warning('Groq API key is valid but Llama 3.3 70B model not found');
        results.warnings++;
        return true;
      }
    } else if (response.statusCode === 401) {
      log.error('Groq API key is invalid or expired');
      results.failed++;
      return false;
    } else {
      log.warning(`Groq API returned unexpected status: ${response.statusCode}`);
      results.warnings++;
      return true;
    }
  } catch (error) {
    log.error(`Failed to test Groq API: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Test Tavily API key
 */
async function testTavilyAPI(apiKey) {
  try {
    const body = JSON.stringify({
      api_key: apiKey,
      query: 'test query',
      max_results: 1
    });

    const response = await makeRequest('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body
    });

    if (response.statusCode === 200) {
      log.success('Tavily API key is valid');
      results.passed++;
      return true;
    } else if (response.statusCode === 401 || response.statusCode === 403) {
      log.error('Tavily API key is invalid');
      results.failed++;
      return false;
    } else {
      log.warning(`Tavily API returned status: ${response.statusCode}`);
      results.warnings++;
      return true;
    }
  } catch (error) {
    log.error(`Failed to test Tavily API: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Test Unsplash API key
 */
async function testUnsplashAPI(accessKey) {
  try {
    const response = await makeRequest('https://api.unsplash.com/photos?per_page=1', {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      }
    });

    if (response.statusCode === 200) {
      log.success('Unsplash API key is valid');
      results.passed++;
      return true;
    } else if (response.statusCode === 401) {
      log.error('Unsplash API key is invalid');
      results.failed++;
      return false;
    } else {
      log.warning(`Unsplash API returned status: ${response.statusCode}`);
      results.warnings++;
      return true;
    }
  } catch (error) {
    log.error(`Failed to test Unsplash API: ${error.message}`);
    results.failed++;
    return false;
  }
}

/**
 * Validate Google Sheets Document ID format
 */
function validateGoogleSheetsID(docId) {
  // Google Sheets IDs are typically 44 characters long with alphanumeric, hyphens, and underscores
  const pattern = /^[a-zA-Z0-9-_]{40,50}$/;
  
  if (pattern.test(docId)) {
    log.success('Google Sheets Document ID format is valid');
    results.passed++;
    return true;
  } else {
    log.error('Google Sheets Document ID format is invalid');
    log.info('  Format should be: https://docs.google.com/spreadsheets/d/YOUR_DOC_ID/edit');
    log.info('  Extract only the YOUR_DOC_ID part');
    results.failed++;
    return false;
  }
}

/**
 * Validate LinkedIn Person URN format
 */
function validateLinkedInURN(urn) {
  // LinkedIn Person URN format: urn:li:person:XXXXXXXXXX
  const pattern = /^urn:li:person:[a-zA-Z0-9_-]+$/;
  
  if (pattern.test(urn)) {
    log.success('LinkedIn Person URN format is valid');
    results.passed++;
    return true;
  } else {
    log.error('LinkedIn Person URN format is invalid');
    log.info('  Format should be: urn:li:person:XXXXXXXXXX');
    log.info('  Get this from LinkedIn API: https://api.linkedin.com/v2/userinfo');
    results.failed++;
    return false;
  }
}

/**
 * Main validation function
 */
async function validateSetup() {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════╗
║  LinkedIn AI/ML Automation Setup Validator          ║
╚══════════════════════════════════════════════════════╝${colors.reset}
`);

  // Check for .env file
  try {
    require('dotenv').config();
  } catch (error) {
    log.warning('dotenv package not found. Using process.env directly');
    log.info('To use .env file, run: npm install dotenv');
  }

  // Section 1: Required Environment Variables
  log.section('1. Checking Required Environment Variables');
  
  for (const varName of requiredEnvVars.required) {
    const value = process.env[varName];
    if (value && value.trim() !== '') {
      log.success(`${varName} is set`);
      results.passed++;
    } else {
      log.error(`${varName} is not set or empty`);
      results.failed++;
    }
  }

  // Section 2: Optional Environment Variables
  log.section('2. Checking Optional Environment Variables');
  
  const emailConfigured = process.env.ALERT_EMAIL && 
                          process.env.SMTP_HOST && 
                          process.env.SMTP_USER && 
                          process.env.SMTP_PASSWORD;

  if (emailConfigured) {
    log.success('Email alerts are configured');
    results.passed++;
  } else {
    log.warning('Email alerts are not configured (this is optional)');
    log.info('  Email alerts will notify you of workflow failures');
    results.warnings++;
  }

  // Section 3: Validate Formats
  log.section('3. Validating Configuration Formats');

  if (process.env.GOOGLE_SHEETS_DOC_ID) {
    validateGoogleSheetsID(process.env.GOOGLE_SHEETS_DOC_ID);
  }

  if (process.env.LINKEDIN_PERSON_URN) {
    validateLinkedInURN(process.env.LINKEDIN_PERSON_URN);
  }

  // Section 4: Test API Keys
  log.section('4. Testing API Keys (this may take a few seconds)');

  if (process.env.GROQ_API_KEY) {
    await testGroqAPI(process.env.GROQ_API_KEY);
  } else {
    log.error('GROQ_API_KEY not set, skipping API test');
  }

  if (process.env.TAVILY_API_KEY) {
    await testTavilyAPI(process.env.TAVILY_API_KEY);
  } else {
    log.error('TAVILY_API_KEY not set, skipping API test');
  }

  if (process.env.UNSPLASH_ACCESS_KEY) {
    await testUnsplashAPI(process.env.UNSPLASH_ACCESS_KEY);
  } else {
    log.error('UNSPLASH_ACCESS_KEY not set, skipping API test');
  }

  // Section 5: OAuth Credentials Check
  log.section('5. OAuth Credentials');
  
  log.info('OAuth credentials must be configured in n8n:');
  log.info('  • LinkedIn OAuth2 - For posting to LinkedIn');
  log.info('  • Google Sheets OAuth2 - For logging and tracking');
  log.info('  These cannot be validated by this script');
  log.warning('Make sure to configure these in n8n\'s Credential Manager');
  results.warnings++;

  // Section 6: Summary
  log.section('Summary');

  console.log(`
  ${colors.green}Passed:${colors.reset}   ${results.passed}
  ${colors.red}Failed:${colors.reset}   ${results.failed}
  ${colors.yellow}Warnings:${colors.reset} ${results.warnings}
  `);

  if (results.failed === 0 && results.warnings <= 2) {
    console.log(`${colors.green}✓ Setup looks good! You're ready to import the workflow.${colors.reset}\n`);
    console.log('Next steps:');
    console.log('  1. Import the workflow JSON into n8n');
    console.log('  2. Configure OAuth credentials in n8n');
    console.log('  3. Test the workflow manually before activating');
    console.log('  4. Activate the workflow to start automation\n');
    process.exit(0);
  } else if (results.failed === 0) {
    console.log(`${colors.yellow}⚠ Setup is mostly complete with some warnings.${colors.reset}\n`);
    console.log('Review the warnings above and address them if needed.\n');
    process.exit(0);
  } else {
    console.log(`${colors.red}✗ Setup has issues that need to be fixed.${colors.reset}\n`);
    console.log('Please address the errors above before proceeding.\n');
    console.log('For help, see:');
    console.log('  • SETUP.md - Detailed setup instructions');
    console.log('  • TROUBLESHOOTING.md - Common issues and solutions\n');
    process.exit(1);
  }
}

// Run validation
validateSetup().catch(error => {
  log.error(`Validation failed with error: ${error.message}`);
  process.exit(1);
});
