const https = require('https');

const TOKEN = '_AN_rViCnfvJp7QnliKIphT1qH2Uwk98';
const API_URL = 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C';
const ID = '434147';

console.log('--- DEBUGGING PIXXI API ---');
console.log(`Target ID: ${ID}`);
console.log(`Token: ${TOKEN.substring(0, 5)}...`);

function post(payload, label) {
    console.log(`\n[${label}] Sending payload:`, JSON.stringify(payload));

    const options = {
        method: 'POST',
        headers: {
            'X-PIXXI-TOKEN': TOKEN,
            'Content-Type': 'application/json'
        }
    };

    const req = https.request(API_URL, options, (res) => {
        console.log(`[${label}] Status Code: ${res.statusCode}`);
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const fs = require('fs');
                fs.writeFileSync('debug-output.json', data, 'utf8'); // WRITE FILE
                const json = JSON.parse(data);
                console.log(`[${label}] Success. Data written to debug-output.json`);
                if (json.data && json.data.list) {
                    console.log(`[${label}] Items found: ${json.data.list.length}`);
                    if (json.data.list.length > 0) {
                        const item = json.data.list[0];
                        console.log(`[${label}] First item ID:`, item.id);
                        console.log(`[${label}] First item RefNo:`, item.referenceNumber);
                        console.log(`[${label}] First item Title:`, item.title);

                        // Check match
                        const match = json.data.list.find(i => String(i.id) === ID || i.referenceNumber === ID);
                        if (match) {
                            console.log(`✅ [${label}] FOUND MATCH! Title: ${match.title}`);
                        } else {
                            console.log(`❌ [${label}] NO MATCH in this batch.`);
                        }

                        // Dump keys of first item to check for "id" field name
                        console.log(`[${label}] Keys of first item:`, Object.keys(item).join(', '));
                    }
                } else {
                    console.log(`[${label}] No list in data (or error message):`, JSON.stringify(json).substring(0, 200));
                }
            } catch (e) {
                console.log(`[${label}] Error:`, e.message);
                console.log(`[${label}] Raw Body:`, data.substring(0, 500));
            }
        });
    });

    req.on('error', (e) => {
        console.error(`[${label}] Request Error: ${e.message}`);
    });

    req.write(JSON.stringify(payload));
    req.end();
}

// Test 1: By Reference Number (Strategy 1)
post({ size: 1, status: 'ACTIVE', referenceNumber: ID }, 'STRATEGY 1 (RefNo)');

// Test 2: Batch Fetch (Strategy 2)
// Test 3: Filter by Developer ID (Sanzen = 997)
post({ size: 5, status: 'ACTIVE', developerId: '997' }, 'STRATEGY 3 (DevFilter)');

// Test 4: Filter by Developer Name (Azizi)
post({ size: 5, status: 'ACTIVE', developer: 'Azizi' }, 'STRATEGY 4 (DevNameFilter)');
