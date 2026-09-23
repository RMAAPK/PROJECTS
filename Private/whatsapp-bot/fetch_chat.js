const { default: makeWASocket, useMultiFileAuthState, Browsers } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');

const TARGET_PHONE_NUMBER = "923309246239";
let pairingCodeRequested = false;

async function getChat() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    
    const sock = makeWASocket({
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;
        
        if (qr && !pairingCodeRequested && !sock.authState?.creds?.registered) {
            pairingCodeRequested = true;
            try {
                const rawCode = await sock.requestPairingCode(TARGET_PHONE_NUMBER);
                const formattedCode = rawCode?.match(/.{1,4}/g)?.join("-") || rawCode;
                console.log("\n=======================================================");
                console.log(`>>> YOUR WHATSAPP PAIRING CODE IS: ${formattedCode} <<<`);
                console.log("=======================================================\n");
            } catch (err) {
                console.error("Pairing code error:", err);
            }
        }
        
        if (connection === 'open') {
            console.log('Connected! Waiting for history sync (can take up to 2 minutes)...');
        }
    });

    sock.ev.on('messaging-history.set', ({ messages }) => {
        console.log('History sync received with ' + messages.length + ' messages.');
        
        let output = "=== CHAT EXTRACT: OWAIS & HASEEB ===\n\n";
        
        // Sort messages by timestamp
        messages.sort((a, b) => (a.messageTimestamp || 0) - (b.messageTimestamp || 0));
        
        messages.forEach(msg => {
            const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
            const lower = text.toLowerCase();
            
            // Only capture if it has text and is somewhat relevant, or just capture all text from the specific chat if we can identify it.
            // Since we want the summary, let's just grab everything that mentions the keywords.
            if (lower.includes('owais') || lower.includes('haseeb') || lower.includes('hasseb') || lower.includes('drunk') || lower.includes('drink')) {
                const jid = msg.key.remoteJid;
                const fromMe = msg.key.fromMe;
                const time = new Date((msg.messageTimestamp || 0) * 1000).toLocaleString();
                const sender = fromMe ? "Me (Muhammad Ali)" : jid.split('@')[0];
                output += `[${time}] ${sender}: ${text}\n`;
            }
        });

        fs.writeFileSync('chat_summary.txt', output);
        console.log('Chat extracted to chat_summary.txt. Exiting.');
        process.exit(0);
    });

    // 300 seconds timeout to give time for pairing and syncing
    setTimeout(() => { 
        console.log('Timeout waiting for history sync. Exiting...'); 
        process.exit(0); 
    }, 300000);
}

getChat();
