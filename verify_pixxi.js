const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // Read .env file
        const envPath = path.resolve(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');

        // Parse PIXXI_TOKEN
        const tokenMatch = envContent.match(/PIXXI_TOKEN=(.+)/);
        const apiUrlMatch = envContent.match(/PIXXI_API_URL=(.+)/);

        if (!tokenMatch) {
            console.error('Could not find PIXXI_TOKEN in .env');
            return;
        }

        const token = tokenMatch[1].trim();
        const apiUrl = apiUrlMatch ? apiUrlMatch[1].trim() : 'https://dataapi.pixxicrm.ae/pixxiapi/v1/properties/Astra Terra Properties L.L.C';

        console.log(`Using API URL: ${apiUrl}`);
        console.log(`Token found: ${token.substring(0, 5)}...`);

        // Check SELL
        const payloadSell = {
            size: 1000,
            status: 'ACTIVE',
            listingType: 'SELL'
        };

        console.log('Fetching SELL properties...');
        const responseSell = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadSell),
        });
        const dataSell = await responseSell.json();
        const countSell = dataSell.data?.list?.length || 0;

        // Check RENT
        const payloadRent = {
            size: 1000,
            status: 'ACTIVE',
            listingType: 'RENT'
        };

        console.log('Fetching RENT properties...');
        const responseRent = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadRent),
        });
        const dataRent = await responseRent.json();
        const countRent = dataRent.data?.list?.length || 0;

        // Check SELL + City 41
        const payloadSellCity = {
            size: 1000,
            status: 'ACTIVE',
            listingType: 'SELL',
            cityIds: [41]
        };

        console.log('Fetching SELL + City 41 properties...');
        const responseSellCity = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'X-PIXXI-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payloadSellCity),
        });
        const dataSellCity = await responseSellCity.json();
        const countSellCity = dataSellCity.data?.list?.length || 0;

        const output = `
Total SELL (All Cities): ${countSell}
Total SELL (City 41): ${countSellCity}
Total RENT properties: ${countRent}
Total Combined: ${countSell + countRent}
    `;
        console.log(output);
        fs.writeFileSync('verification_result.txt', output, 'utf8');

    } catch (err) {
        console.error('Script error:', err);
    }
}

main();
