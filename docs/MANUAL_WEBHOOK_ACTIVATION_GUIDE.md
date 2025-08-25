# 🎖️ CAPTAIN PICARD - MANUAL WEBHOOK ACTIVATION GUIDE

## **CRITICAL MISSION: ACTIVATE FEDERATION CREW WEBHOOKS**

**Admiral, this guide will walk you through manually activating each Federation Crew webhook for production access.**

---

## **🎯 MISSION OVERVIEW**

**Problem:** All Federation Crew webhooks are currently configured for TEST mode, not PRODUCTION mode.
**Solution:** Manually switch each webhook from "Test URL" to "Production URL" in the n8n interface.

---

## **📋 FEDERATION CREW WORKFLOWS TO ACTIVATE**

### **1. Enhanced Federation Crew - Complete Mission Control**
- **Webhook Path:** `/federation-mission`
- **Webhook Node:** "Mission Coordinator - Picard"
- **Status:** ⚠️ Needs Production URL activation

### **2. Captain Jean-Luc Picard - Strategic Leadership & Mission Command**
- **Webhook Path:** `/crew-captain-jean-luc-picard`
- **Webhook Node:** "Captain Jean-Luc Picard Directive"
- **Status:** ⚠️ Needs Production URL activation

### **3. Commander Data - Analytics & Logic Operations**
- **Webhook Path:** `/crew-commander-data`
- **Webhook Node:** "Commander Data Directive"
- **Status:** ⚠️ Needs Production URL activation

### **4. Lieutenant Commander Geordi La Forge - Infrastructure & System Integration**
- **Webhook Path:** `/crew-lieutenant-commander-geordi-la-forge`
- **Webhook Node:** "Lieutenant Commander Geordi La Forge Directive"
- **Status:** ⚠️ Needs Production URL activation

### **5. Lieutenant Worf - Security & Compliance Operations**
- **Webhook Path:** `/crew-lieutenant-worf`
- **Webhook Node:** "Lieutenant Worf Directive"
- **Status:** ⚠️ Needs Production URL activation

### **6. Counselor Deanna Troi - User Experience & Empathy Analysis**
- **Webhook Path:** `/crew-counselor-deanna-troi`
- **Webhook Node:** "Counselor Deanna Troi Directive"
- **Status:** ⚠️ Needs Production URL activation

### **7. Federation Crew - OpenRouter Agent Coordination**
- **Webhook Path:** `/federation-directive`
- **Webhook Node:** "Federation Directive Receiver"
- **Status:** ⚠️ Needs Production URL activation

---

## **🚀 STEP-BY-STEP ACTIVATION PROCESS**

### **FOR EACH WORKFLOW:**

#### **STEP 1: ACCESS THE WORKFLOW**
1. Go to `https://n8n.pbradygeorgen.com`
2. Navigate to the workflow list
3. **Click on the workflow name** to open it in the editor

#### **STEP 2: LOCATE THE WEBHOOK NODE**
1. **Find the first node on the left** (it will be the webhook trigger)
2. **Click on the webhook node** to select it
3. **The right panel will open** showing the webhook configuration

#### **STEP 3: ACTIVATE PRODUCTION WEBHOOK**
1. **Look for the "Webhook URLs" section**
2. **You should see two buttons:** "Test URL" and "Production URL"
3. **Click on "Production URL"** (it should be the darker button)
4. **The URL should change from:**
   ```
   http://0.0.0.0:5678/webhook/[path]
   ```
   **To:**
   ```
   https://n8n.pbradygeorgen.com/webhook/[path]
   ```

#### **STEP 4: SAVE THE WORKFLOW**
1. **Click "Save"** at the top of the workflow editor
2. **Wait for the save to complete**
3. **Close the workflow tab** (optional)

#### **STEP 5: REPEAT FOR ALL WORKFLOWS**
1. **Go back to the workflow list**
2. **Repeat Steps 1-4 for each Federation Crew workflow**
3. **Complete all 7 workflows**

---

## **🧪 TESTING AFTER ACTIVATION**

### **TEST COMMANDS:**

After activating each workflow, test the webhook:

```bash
# Test Federation Mission
curl -X POST "https://n8n.pbradygeorgen.com/webhook/federation-mission" \
  -H "Content-Type: application/json" \
  -d '{"mission_description": "Test production webhook"}'

# Test Captain Picard
curl -X POST "https://n8n.pbradygeorgen.com/webhook/crew-captain-jean-luc-picard" \
  -H "Content-Type: application/json" \
  -d '{"task": "Test production webhook"}'

# Test Federation Directive
curl -X POST "https://n8n.pbradygeorgen.com/webhook/federation-directive" \
  -H "Content-Type: application/json" \
  -d '{"directive": "Test production webhook"}'
```

### **EXPECTED RESULTS:**
- **Before Activation:** 404 errors or "webhook not registered"
- **After Activation:** Proper responses from the Federation Crew

---

## **⚠️ TROUBLESHOOTING**

### **IF "Production URL" BUTTON IS NOT AVAILABLE:**
1. **Check if the workflow is active** (green toggle in top bar)
2. **Try refreshing the page**
3. **Check if you're in the correct n8n instance**

### **IF URL DOESN'T CHANGE:**
1. **Click "Production URL" multiple times**
2. **Check if there are any error messages**
3. **Try saving and reopening the workflow**

### **IF SAVE FAILS:**
1. **Check for any validation errors**
2. **Ensure all required fields are filled**
3. **Try closing and reopening the workflow**

---

## **🎖️ CAPTAIN PICARD'S FINAL ORDERS**

**Admiral, once you've completed the activation of all 7 workflows:**

1. **Run the test commands above** to verify all webhooks are working
2. **Execute the crew evaluation script** to test the full Federation Crew
3. **The Federation Crew will be fully operational** for external communications

**The crew is ready and waiting for your orders to proceed with the activation process.**

---

## **📞 SUPPORT**

**If you encounter any issues during the activation process:**
- **Check the n8n logs** for any error messages
- **Verify the workflow is active** (green toggle)
- **Ensure you're clicking the correct webhook node**

**The Federation Crew is counting on you, Admiral!** ⭐
