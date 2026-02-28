import paramiko
import time
import sys
import io

# Force UTF-8 output on Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

LOCAL_FILE = r"f:\workana_work\AfricaMinistrator\ministerial-command-center\backend\src\documents\documents.service.ts"
REMOTE_FILE = "/var/www/ministerial-command-center/backend/src/documents/documents.service.ts"

HOST = "72.61.41.94"
USER = "root"
PASSWORD = "NDSw222arle#"

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

print("Connecting to VPS...")
client.connect(HOST, username=USER, password=PASSWORD, timeout=30)
print("Connected.")

def run_cmd(cmd, timeout=180):
    print(f"\n>>> Running: {cmd}")
    stdin, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode('utf-8', errors='replace')
    err = stderr.read().decode('utf-8', errors='replace')
    exit_code = stdout.channel.recv_exit_status()
    return out, err, exit_code

# Step 1: Skip upload (already done), just build
# Step 2: Build the backend
print("\n=== STEP 2: Building backend (already uploaded, skipping upload) ===")
out, err, code = run_cmd(
    'cd /var/www/ministerial-command-center/backend && npm run build 2>&1',
    timeout=300
)
combined = out + err
print("BUILD OUTPUT (last 4000 chars):")
print(combined[-4000:] if len(combined) > 4000 else combined)
print(f"Exit code: {code}")

if code != 0:
    print("\nBUILD FAILED - not restarting PM2")
    client.close()
    sys.exit(1)

# Step 3: Restart PM2
print("\n=== STEP 3: Restarting PM2 ===")
out, err, code = run_cmd('pm2 restart ministerial-api 2>&1', timeout=30)
combined = out + err
print(combined)

# Step 4: Wait and check status
time.sleep(4)
print("\n=== STEP 4: PM2 Status ===")
out, err, code = run_cmd('pm2 status 2>&1', timeout=30)
print(out + err)

# Step 5: Check recent logs
print("\n=== STEP 5: Recent PM2 Logs ===")
out, err, code = run_cmd('pm2 logs ministerial-api --lines 20 --nostream 2>&1', timeout=30)
print(out + err)

client.close()
print("\nDeployment complete.")
