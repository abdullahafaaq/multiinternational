# Practical Data Transfer Solutions

## Summary: What's Actually Happening

| Aspect | Current Status |
|--------|-----------------|
| **Storage Type** | SQLite database (`data/multiinternational.sqlite`) |
| **Local Machine** | ✅ Database exists with all your changes |
| **Hostinger VPS** | ❌ Database doesn't exist (only code deployed) |
| **On VPS Startup** | Server creates NEW database with defaults |
| **Result** | All your changes gone ❌ |

---

## 🚀 SOLUTION 1: Quick Fix (5 minutes)

**Use this RIGHT NOW if your data is completely lost:**

### Step 1: Upload Your Local Database File

1. **On your local computer**, locate:
   ```
   multiinternational/data/multiinternational.sqlite
   ```

2. **Upload via Hostinger File Manager:**
   - Go to Hostinger Control Panel → File Manager
   - Navigate to `/home/username/public_html/yoursite/data/`
   - Upload `multiinternational.sqlite` file
   - Replace the existing file if prompted

3. **Wait 30 seconds** and refresh your website - data should appear!

---

## ✅ SOLUTION 2: Permanent Fix - Include in Git

**Do this once to ensure future deployments keep data:**

### Step 1: Check Current .gitignore

```bash
# Open .gitignore and check if data/ is excluded
cat .gitignore
```

### Step 2: If `data/` is in .gitignore, remove it

```bash
# Edit .gitignore and remove or comment out:
# data/
```

Or remove specific patterns:
```bash
# Keep backups but track main database
!data/multiinternational.sqlite
data/backups/  # Keep this ignored
```

### Step 3: Add and Commit Your Current Database

```bash
# Make sure your local database has ALL your changes
# Then commit it:

git add data/multiinternational.sqlite
git commit -m "Add database with product catalog and settings"
git push origin main
```

### Step 4: Deploy to Hostinger

```bash
# Via your hosting control panel deployment, or via SSH:
git pull origin main
npm run build
```

**Result:** Database with all your data goes live! ✅

**⚠️ Note:** If you edit data again locally, repeat steps 3-4 to push updates.

---

## 🔄 SOLUTION 3: Persistent Directory (Better)

**Use this if you want data to persist between deployments:**

### Step 1: Modify server.js

Find this section in `server.js`:

```javascript
// CURRENT (around line 7-10):
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'multiinternational.sqlite');
```

Replace with:

```javascript
// NEW - Use persistent directory if available:
const persistentDataDir = process.env.PERSISTENT_DATA_DIR;
const DATA_DIR = persistentDataDir || path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'multiinternational.sqlite');
```

### Step 2: On Hostinger Server

**Contact Hostinger support to:**
- Create a persistent directory (example: `/home/yourusername/persistent_data/`)
- Ask them to set environment variable: `PERSISTENT_DATA_DIR=/home/yourusername/persistent_data/`

Or use SSH:
```bash
# SSH into your server
mkdir -p ~/persistent_data

# Add to your deployment script or .env:
export PERSISTENT_DATA_DIR=/home/yourusername/persistent_data
```

### Step 3: Upload Initial Database

```bash
# First time, upload your local database:
scp data/multiinternational.sqlite yourusername@yourhost:~/persistent_data/

# Or use Hostinger File Manager to upload to the persistent directory
```

**Result:** Data persists across all deployments! ✅

---

## 🗄️ SOLUTION 4: Use MySQL/PostgreSQL (Professional)

**Best long-term solution but requires more setup:**

### Check Hostinger Offerings
- Hostinger usually includes free database with hosting plans
- Go to Control Panel → Databases
- Create new MySQL or PostgreSQL database
- Note credentials: host, user, password, database name

### This Would Require:
1. Modify `server.js` to connect to MySQL instead of SQLite
2. Migrate your SQLite data to MySQL
3. Data automatically persists in Hostinger's managed database

**Complexity:** Medium | **Reliability:** High | **Cost:** Usually free with Hostinger

---

## 📊 Comparison Table

| Solution | Setup Time | Reliability | Data Persistence | Notes |
|----------|-----------|-------------|------------------|-------|
| **Solution 1** | 5 min | ⭐⭐ | Manual each time | Quick fix, manual process |
| **Solution 2** | 10 min | ⭐⭐⭐ | Yes | Best for small changes |
| **Solution 3** | 30 min | ⭐⭐⭐⭐ | Yes | Requires Hostinger support |
| **Solution 4** | 2 hours | ⭐⭐⭐⭐⭐ | Yes | Most professional, needs coding |

---

## 🔍 How to Verify Solution is Working

After implementing ANY solution, test it:

1. **Go to your live website** (hostinger domain)
2. **Check if your products are showing** 
3. **Go to admin panel** and make a small change (edit a product name)
4. **Refresh the website** - does the change appear? If YES ✅ Data persistence works!

---

## 🚨 Troubleshooting

### "Data still shows defaults after uploading database file"

```bash
# Possible causes:
1. File uploaded to wrong directory
   → Check: /home/yourusername/public_html/yoursite/data/

2. File upload was incomplete
   → Re-upload the file

3. Server needs restart
   → Contact Hostinger support to restart Node.js application

4. Wrong file path in server code
   → Verify DATA_DIR path in server.js
```

### "Getting 404 or database errors"

```bash
# SSH into server and check:
ls -la /home/yourusername/public_html/yoursite/data/
# Should show: multiinternational.sqlite

# Check file permissions:
chmod 644 /path/to/multiinternational.sqlite
```

### "Backups not created"

```bash
# Backups directory might not have write permissions:
chmod 755 /path/to/data/backups/
# Then make a change in admin panel to trigger backup
```

---

## 📝 Recommended: SOLUTION 2 + SOLUTION 3

**Best Approach:**

1. **Now:** Use Solution 1 to upload database (5 min)
2. **This week:** Implement Solution 2 (git tracking) (10 min)
3. **Next month:** Set up Solution 3 (persistent directory) (30 min)

This gives you:
- ✅ Immediate working website
- ✅ Version control backup
- ✅ Production persistence

---

## 🆘 Still Having Issues?

Provide this to Hostinger support:

> "My Node.js application uses SQLite database at `/home/yourusername/public_html/site/data/multiinternational.sqlite`. After deploying new code, this database file resets. Can you help me:
>
> 1. Create a persistent directory that survives code deployments?
> 2. Set environment variables for Node.js application?
> 3. Or recommend best practice for persistent data storage?"

---

## 💡 Prevention for Future

Add this to your deployment checklist:

```
Before deploying to production:
- [ ] Are all local admin changes complete?
- [ ] Have I backed up data/multiinternational.sqlite locally?
- [ ] Is database file included in git (or uploaded separately)?
- [ ] Do I have a backup in data/backups/ folder?
- [ ] Is my VPS configured with persistent storage?
```

---

**Choose Solution 2 if:** You want quickest setup with version control  
**Choose Solution 3 if:** You want professional deployment with persistence  
**Choose Solution 4 if:** You want truly scalable production setup
