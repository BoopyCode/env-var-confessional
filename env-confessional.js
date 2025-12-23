#!/usr/bin/env node

// Env Var Confessional - Where your environment variables come to confess their sins
// Because 'undefined' is not a valid confession

const fs = require('fs');
const path = require('path');

// The sacred texts (your env files)
const ENV_FILES = [
    '.env',
    '.env.local',
    '.env.development',
    '.env.production',
    '.env.staging'
];

// The holy requirements (what you actually need)
const REQUIRED_VARS = process.argv.slice(2);

if (REQUIRED_VARS.length === 0) {
    console.log('\n📖 No sins to confess? Specify required vars: node env-confessional.js API_KEY DATABASE_URL');
    console.log('   Example: node env-confessional.js API_KEY DATABASE_URL SECRET');
    process.exit(0);
}

console.log('\n⛪ Welcome to the Environment Variable Confessional\n');
console.log('Let us begin the examination of conscience...\n');

// Collect all confessions from different parishes (env files)
const allConfessions = {};
let foundAnyFile = false;

ENV_FILES.forEach(file => {
    if (fs.existsSync(file)) {
        foundAnyFile = true;
        console.log(`📜 Reading confessions from: ${file}`);
        
        const confessions = fs.readFileSync(file, 'utf8').split('\n');
        confessions.forEach(confession => {
            const confessionLine = confession.trim();
            if (confessionLine && !confessionLine.startsWith('#')) {
                const [sin, penance] = confessionLine.split('=');
                if (sin && penance) {
                    allConfessions[sin.trim()] = penance.trim();
                }
            }
        });
    }
});

if (!foundAnyFile) {
    console.log('❌ No confessionals found! (No .env files detected)');
    console.log('   Create a .env file and try again.');
    process.exit(1);
}

console.log('\n🔍 Examining the state of your soul...\n');

// Check for mortal sins (missing required vars)
let mortalSins = 0;
REQUIRED_VARS.forEach(sin => {
    if (!allConfessions[sin]) {
        console.log(`❌ MORTAL SIN: ${sin} is missing! (Your app will suffer)`);
        mortalSins++;
    } else {
        console.log(`✅ Virtue: ${sin} = "${allConfessions[sin].substring(0, 20)}${allConfessions[sin].length > 20 ? '...' : ''}"`);
    }
});

// Check for venial sins (duplicate confessions)
const envFilesWithVars = ENV_FILES.filter(f => fs.existsSync(f));
if (envFilesWithVars.length > 1) {
    console.log('\n⚠️  VENIAL SIN: Multiple .env files detected');
    console.log('   The last confession heard wins (last file loaded overrides earlier ones)');
}

console.log('\n📊 Confession Summary:');
console.log(`   Total sins examined: ${REQUIRED_VARS.length}`);
console.log(`   Mortal sins found: ${mortalSins}`);
console.log(`   Your soul is ${mortalSins === 0 ? 'CLEAN 🙏' : 'IN DANGER 🔥'}`);

process.exit(mortalSins > 0 ? 1 : 0);
