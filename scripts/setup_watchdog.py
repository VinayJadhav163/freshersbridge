import subprocess

remote_script = "#!/bin/bash\n# FreshersBridge WhatsApp Watchdog & Auto-Healer\nSTATUS=$(curl -s 'http://localhost:8080/instance/status?name=freshersbridge' -H 'apikey: FreshersBridgeSecret2026')\nif ! echo \"$STATUS\" | grep -q '\"Connected\":true'; then\n    echo \"$(date): WhatsApp disconnected. Triggering auto-reconnect...\" >> /home/ubuntu/watchdog.log\n    curl -s -X POST 'http://localhost:8080/instance/connect' -H 'apikey: FreshersBridgeSecret2026' -H 'Content-Type: application/json' -d '{\"name\": \"freshersbridge\"}' >> /home/ubuntu/watchdog.log\nfi\n"

cron_entry = "# FreshersBridge WhatsApp Watchdog (Runs every 10 mins to guarantee 100% uptime)\n*/10 * * * * /home/ubuntu/whatsapp_watchdog.sh > /dev/null 2>&1\n# Weekly Sunday Maintenance at 03:00 AM UTC (Flushes cache & restarts containers)\n0 3 * * 0 sudo docker restart evolution_postgres evolution-go > /dev/null 2>&1\n"

# Upload script with binary write to ensure LF only
p1 = subprocess.Popen([
    'ssh', '-i', r'C:\Users\jadha\Downloads\freshersbridge-key.pem',
    '-o', 'StrictHostKeyChecking=no',
    'ubuntu@65.0.170.65',
    'cat > /home/ubuntu/whatsapp_watchdog.sh && chmod +x /home/ubuntu/whatsapp_watchdog.sh'
], stdin=subprocess.PIPE)
p1.communicate(remote_script.encode('utf-8'))
print("Watchdog script uploaded successfully.")

p2 = subprocess.Popen([
    'ssh', '-i', r'C:\Users\jadha\Downloads\freshersbridge-key.pem',
    '-o', 'StrictHostKeyChecking=no',
    'ubuntu@65.0.170.65',
    'crontab -'
], stdin=subprocess.PIPE)
p2.communicate(cron_entry.encode('utf-8'))
print("Crontab configured with clean LF endings.")
