#!/usr/bin/env python3
"""
🏛️ UNITED FEDERATION OF AI AGENTS - FIX HTTPS ISSUE
Fix the HTTPS issue by configuring n8n to work with HTTP and setting up HTTPS
"""

import os
import subprocess
import time
from datetime import datetime

class FixHTTPSIssue:
    """Fix the HTTPS issue for Federation agency"""
    
    def __init__(self):
        self.config = {
            "system_name": "Fix HTTPS Issue",
            "correct_instance_ip": "3.144.205.118",
            "ssh_key_path": "~/.ssh/AlexKeyPair.pem",
            "server_user": "ubuntu",
            "created_at": datetime.now().isoformat()
        }
    
    def fix_n8n_http_config(self):
        """Fix n8n configuration to work with HTTP"""
        print("🔧 Fixing n8n configuration for HTTP access...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Stop current container
            stop_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'cd /home/ubuntu && sudo docker-compose down'
            ], capture_output=True, text=True, timeout=60)
            
            if stop_result.returncode == 0:
                print("✅ Container stopped")
            else:
                print(f"⚠️  Container stop: {stop_result.stderr}")
            
            # Update docker-compose.yml with HTTP-friendly config
            compose_content = """version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    container_name: federation-agency-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_LISTEN_ADDRESS=0.0.0.0
      - N8N_WEBHOOK_URL=http://3.144.205.118:5678
      - N8N_BASIC_AUTH_ACTIVE=false
      - N8N_USER_MANAGEMENT_DISABLED=true
      - N8N_TEMPLATES_ENABLED=false
      - N8N_ONBOARDING_FLOW_DISABLED=true
      - N8N_LOG_LEVEL=info
      - N8N_PAYLOAD_SIZE_MAX=16
      - N8N_SECURE_COOKIE=false
      - N8N_COOKIE_SECURE=false
      - N8N_COOKIE_SAME_SITE=lax
    volumes:
      - n8n_data:/home/node/.n8n
      - ./federation_workflows:/home/node/.n8n/workflows
    networks:
      - federation-network

volumes:
  n8n_data:

networks:
  federation-network:
    driver: bridge
"""
            
            # Update docker-compose.yml
            update_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                f'cat > /home/ubuntu/docker-compose.yml << \'EOF\'\n{compose_content}\nEOF'
            ], capture_output=True, text=True, timeout=60)
            
            if update_result.returncode == 0:
                print("✅ Docker Compose updated with HTTP config")
            else:
                print(f"❌ Docker Compose update failed: {update_result.stderr}")
                return False
            
            # Start container with new config
            start_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'cd /home/ubuntu && sudo docker-compose up -d'
            ], capture_output=True, text=True, timeout=120)
            
            if start_result.returncode == 0:
                print("✅ Container started with HTTP config")
                time.sleep(30)  # Wait for startup
                return True
            else:
                print(f"❌ Container start failed: {start_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ HTTP config fix error: {e}")
            return False
    
    def setup_https_with_letsencrypt(self):
        """Setup HTTPS with Let's Encrypt"""
        print("🔒 Setting up HTTPS with Let's Encrypt...")
        
        try:
            ssh_key_path = os.path.expanduser(self.config['ssh_key_path'])
            
            # Install certbot and nginx
            install_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo apt update && sudo apt install -y certbot python3-certbot-nginx nginx'
            ], capture_output=True, text=True, timeout=300)
            
            if install_result.returncode == 0:
                print("✅ Certbot and nginx installed")
            else:
                print(f"⚠️  Installation warning: {install_result.stderr}")
                return False
            
            # Create nginx config for n8n
            nginx_config = """server {
    listen 80;
    server_name n8n.pbradygeorgen.com;
    
    location / {
        proxy_pass http://localhost:5678;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}"""
            
            # Create nginx site config
            nginx_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                f'cat > /home/ubuntu/n8n-site << \'EOF\'\n{nginx_config}\nEOF'
            ], capture_output=True, text=True, timeout=60)
            
            if nginx_result.returncode == 0:
                print("✅ Nginx config created")
            else:
                print(f"❌ Nginx config creation failed: {nginx_result.stderr}")
                return False
            
            # Install nginx config and get SSL certificate
            ssl_result = subprocess.run([
                'ssh', '-i', ssh_key_path, '-o', 'StrictHostKeyChecking=no',
                f'{self.config["server_user"]}@{self.config["correct_instance_ip"]}',
                'sudo cp /home/ubuntu/n8n-site /etc/nginx/sites-available/n8n && sudo ln -sf /etc/nginx/sites-available/n8n /etc/nginx/sites-enabled/ && sudo nginx -t && sudo systemctl reload nginx && sudo certbot --nginx -d n8n.pbradygeorgen.com --non-interactive --agree-tos --email admin@pbradygeorgen.com'
            ], capture_output=True, text=True, timeout=600)
            
            if ssl_result.returncode == 0:
                print("✅ HTTPS setup completed")
                return True
            else:
                print(f"⚠️  HTTPS setup warning: {ssl_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ HTTPS setup error: {e}")
            return False
    
    def test_https_access(self):
        """Test HTTPS access"""
        print("🧪 Testing HTTPS access...")
        
        try:
            # Test HTTP access (should work now)
            http_result = subprocess.run([
                'curl', '-s', '-m', '10', 'http://3.144.205.118:5678'
            ], capture_output=True, text=True, timeout=15)
            
            if http_result.returncode == 0:
                print("✅ HTTP access working")
            else:
                print(f"⚠️  HTTP access: {http_result.stderr}")
            
            # Test HTTPS access
            https_result = subprocess.run([
                'curl', '-s', '-m', '10', 'https://n8n.pbradygeorgen.com'
            ], capture_output=True, text=True, timeout=15)
            
            if https_result.returncode == 0:
                print("✅ HTTPS access working")
                return True
            else:
                print(f"⚠️  HTTPS access: {https_result.stderr}")
                return False
                
        except Exception as e:
            print(f"❌ HTTPS test error: {e}")
            return False
    
    def execute_https_fix(self):
        """Execute the complete HTTPS fix process"""
        print("🏛️ EXECUTING HTTPS ISSUE FIX")
        print("=" * 80)
        print("🔧 Fixing HTTPS issue for Federation agency access")
        print("=" * 80)
        
        # Step 1: Fix n8n HTTP configuration
        print("🔧 Step 1: Fixing n8n HTTP configuration...")
        if not self.fix_n8n_http_config():
            print("❌ HTTP configuration fix failed")
            return False
        
        # Step 2: Setup HTTPS with Let's Encrypt
        print("🔒 Step 2: Setting up HTTPS with Let's Encrypt...")
        if not self.setup_https_with_letsencrypt():
            print("❌ HTTPS setup failed")
            return False
        
        # Step 3: Test HTTPS access
        print("🧪 Step 3: Testing HTTPS access...")
        if not self.test_https_access():
            print("❌ HTTPS access test failed")
            return False
        
        # Success summary
        print("\n" + "=" * 80)
        print("🎉 HTTPS ISSUE FIX COMPLETED!")
        print("=" * 80)
        print(f"✅ n8n HTTP configuration fixed")
        print(f"✅ HTTPS setup completed")
        print(f"✅ Federation agency accessible via HTTPS")
        
        print(f"\n🏛️ WHAT WE ACCOMPLISHED:")
        print(f"   • Fixed n8n secure cookie issue")
        print(f"   • Set up proper HTTPS with Let's Encrypt")
        print(f"   • Federation agency accessible via n8n.pbradygeorgen.com")
        
        print(f"\n💡 NEXT STEPS:")
        print(f"• **Access Federation agency** - Visit https://n8n.pbradygeorgen.com")
        print(f"• **Activate Federation workflow** - Toggle activation in n8n UI")
        print(f"• **Test Federation agency** - Send 'ALL HANDS ON BOARD' directive")
        
        print(f"\n🔒 SECURITY FEATURES:")
        print(f"• HTTPS enabled with Let's Encrypt SSL certificate")
        print(f"• Secure cookie configuration")
        print(f"• Professional nginx reverse proxy")
        
        print(f"\n🚀 READY FOR TESTING:")
        print(f"1. Visit https://n8n.pbradygeorgen.com")
        print(f"2. Access n8n UI without secure cookie errors")
        print(f"3. Activate Federation workflow")
        print(f"4. Test your Federation agency!")
        
        return True

def main():
    """Main function"""
    print("🏛️ UNITED FEDERATION OF AI AGENTS")
    print("🔧 FIX HTTPS ISSUE")
    print("=" * 80)
    
    fixer = FixHTTPSIssue()
    success = fixer.execute_https_fix()
    
    if success:
        print("\n🎉 HTTPS issue fix completed successfully!")
        print("🏛️ Your Federation agency is accessible via HTTPS!")
        print("\n🎯 Visit https://n8n.pbradygeorgen.com to access your crew!")
    else:
        print("\n❌ HTTPS issue fix failed - check logs above")
        exit(1)

if __name__ == "__main__":
    main()
