# Database Persistence & Data Management Guide

## Current Problem Analysis

Your website data is **resetting to defaults after deployment** because of how the database is being managed. Here's what's happening:

---

## 🗂️ How Your Application Stores Data

### Current Setup
Your application uses **SQLite database** (`data/multiinternational.sqlite`) to store:
- ✅ Products
- ✅ Services  
- ✅ Settings (site name, hero text, team members, etc.)
- ✅ Certificates
- ✅ Inquiries/Messages
- ✅ Admin password

### The Data Flow
1. **Admin makes changes** → Calls `/api/site-data` endpoint (PUT request)
2. **Server receives data** → Validates it
3. **Saves to SQLite database** → File: `data/multiinternational.sqlite`
4. **Database persisted** → Backed up automatically to `data/backups/`

---

## ❌ Why Your Data Resets on Hostinger

### Root Cause
The SQLite database file (`data/multiinternational.sqlite`) is **NOT** being deployed to your VPS server. Here's what happens:

```
Local (Your Computer)
├── data/
│   └── multiinternational.sqlite ✅ EXISTS (has your changes)
└── Code files

        ↓ Deploy to Hostinger ↓

Hostinger VPS
├── data/
│   └── multiinternational.sqlite ❌ MISSING or EMPTY
└── Code files

        ↓ Server Starts ↓

Server detects empty database → Initializes with DEFAULT DATA
```

---

## ✅ Solutions to Fix Data Loss

### **SOLUTION 1: Include Database in Version Control (RECOMMENDED)**

**Problem with this approach:**
- SQLite file binary format doesn't merge well in git
- If you edit data in production and locally, you'll have conflicts
- Not ideal for large/frequently changing data

**But useful for:**
- Initial deployment with pre-configured data
- Small content changes

**How to do it:**

1. Remove `data/` from `.gitignore` (if it's there):
```bash
# Check if .gitignore excludes data folder
cat .gitignore
```

2. Make sure your local SQLite file has all your products/settings:
```bash
# On your local machine, verify your data is complete
```

3. Commit the database file:
```bash
git add data/multiinternational.sqlite data/backups/
git commit -m "Include database with initial data"
git push
```

4. Deploy to Hostinger with the database file included.

**⚠️ Limitation:** Next time you edit data locally, you'll need to re-deploy the updated database file.

---

### **SOLUTION 2: Admin Data Sync (BEST LONG-TERM)**

**This is the recommended approach** because it allows the server to have persistent storage.

**Steps:**

1. **After each content change, export your data:**
   - Go to Admin Panel → Create an "Export Data" feature
   - Or manually backup: `data/multiinternational.sqlite`

2. **On Hostinger Server:**
   - Create a persistent directory that survives deployments
   - Many hosts have a `/home/username/persistent/` or similar
   - Upload your database there
   - Modify the server to use that path

3. **Update server configuration:**
   - Add to your deployment environment variables or config
   - Change `DATA_DIR` path to use persistent storage

**Modified `server.js` (lines to change):**
```javascript
// Instead of:
const DATA_DIR = path.join(__dirname, 'data');

// Use environment variable:
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');

// On Hostinger, set environment variable:
// DATA_DIR=/home/yourusername/persistent_data
```

---

### **SOLUTION 3: Remote Database (MOST SCALABLE)**

For a more robust solution, use a **remote database** instead of file-based SQLite:

**Recommended:** PostgreSQL or MySQL on Hostinger

**Benefits:**
- ✅ Data persists across all deployments
- ✅ No file synchronization needed
- ✅ Professional backup solutions
- ✅ Better for team collaboration

**How to implement:**
1. Hostinger usually offers free MySQL/PostgreSQL databases
2. Modify `server.js` to connect to remote database instead of SQLite
3. Migrate your SQLite data to remote database (one-time setup)

---

## 🔧 Quick Temporary Fix (Immediate)

**Until you implement a permanent solution:**

1. **Export your local database:**
   ```bash
   # Copy your database file with all changes
   cp data/multiinternational.sqlite data/multiinternational.sqlite.backup
   ```

2. **Via Hostinger File Manager:**
   - Upload the `multiinternational.sqlite` file to `data/` folder on server
   - File Manager → Navigate to `/public_html/yoursite/data/`
   - Upload the file

3. **Or via SSH/Terminal:**
   ```bash
   scp data/multiinternational.sqlite youruser@hostinger:/path/to/site/data/
   ```

---

## 📋 Action Plan for You

### Immediate (This Week)
- [ ] Upload your local `data/multiinternational.sqlite` to Hostinger via File Manager
- [ ] Test if data persists

### Short Term (This Month)
- [ ] Add `data/` folder to git version control
- [ ] Commit and push current database with all your changes
- [ ] Re-deploy

### Long Term (Recommended)
- [ ] Set up persistent data directory on Hostinger
- [ ] Or migrate to remote database (MySQL/PostgreSQL)
- [ ] Automate backups

---

## 🔐 Security Notes

⚠️ **Important:** Your admin password and database file are sensitive!

**Don't expose:**
- `data/multiinternational.sqlite` in public areas
- Database backup files shouldn't be web-accessible
- Add these to `.gitignore` if using sensitive production passwords:
  ```
  data/multiinternational.sqlite
  data/backups/
  ```

---

## 📞 Hostinger Support

Contact Hostinger support to ask about:
- Persistent directories that survive deployments
- Environment variable support
- Database offerings (MySQL, PostgreSQL)
- SSH access for file management

---

## 💡 How to Verify Current Storage

**Check current database location:**
```javascript
// In server.js, line shows:
const DB_FILE = path.join(__dirname, 'data', 'multiinternational.sqlite');
```

**Check if backups exist:**
- Local: `data/backups/` folder should have automatic backups
- These are created every time you save data

---

**Bottom Line:** 
Your database exists locally and works perfectly, but **it's not being transferred to your VPS**. Pick one solution above and your data will persist! Solution 1 (include in git) is quickest, Solution 2 (persistent directory) is most practical, Solution 3 (remote DB) is most professional.
