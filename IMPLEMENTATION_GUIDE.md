# Step-by-Step: Fix Data Loss (Choose Your Path)

## 🚀 FASTEST FIX: Upload Database Now (5 min)

**Do this RIGHT NOW if your site shows default products:**

### Step 1: Download Your Local Database
```
On your computer, find and copy this file:
multiinternational/data/multiinternational.sqlite
```

### Step 2: Login to Hostinger File Manager
1. Go to **Hostinger Control Panel**
2. Click **File Manager**
3. Navigate to: `/home/yourusername/public_html/yoursitename/`

### Step 3: Create `data` Folder (if missing)
1. Right-click in file manager
2. Select **"New Folder"**
3. Name it: `data`

### Step 4: Upload Database File
1. **Right-click** → **Upload**
2. Select: `multiinternational.sqlite`
3. Upload to: `/data/` folder
4. Wait for upload to complete ✅

### Step 5: Test
1. **Refresh** your website: `yourdomain.com`
2. Should show YOUR products, not defaults
3. ✅ Data is back!

---

## 📦 PERMANENT FIX: Add to Git (10 min)

**Do this so data persists on ALL future deployments:**

### Step 1: Check Your .gitignore File

**Open terminal/PowerShell in your project folder:**

```powershell
# Windows PowerShell
cat .gitignore
```

```bash
# Mac/Linux
cat .gitignore
```

**Look for:** Does it contain `data/` or `/data/`?

### Step 2A: If `data/` is in .gitignore - Remove It

**Edit .gitignore file:**

Find this line:
```
data/
```

Delete it or comment it out:
```
# data/
```

Save file.

**OR** if you want to keep backups ignored but track database:
```
# Keep database but ignore backups
!data/multiinternational.sqlite
data/backups/
```

### Step 2B: If `data/` is NOT in .gitignore - Skip to Step 3

### Step 3: Verify Your Local Database Has All Data

```powershell
# Check file exists and has size > 10KB (means it has data)
ls -l data/multiinternational.sqlite
```

Expected output:
```
-rw-r--r-- 1 user 123456 450000 Jan 15 10:30 multiinternational.sqlite
         ↑                ↑↑↑↑↑↑
      permissions    file size (should be 100KB+)
```

If file size is small (< 5KB), database might be empty - check Admin panel first!

### Step 4: Add Database to Git

```powershell
# Stage the database file
git add data/multiinternational.sqlite

# Verify it was added
git status
# Should show:
# new file: data/multiinternational.sqlite
```

### Step 5: Commit Changes

```powershell
git commit -m "Add database with current products and settings"
```

Expected output:
```
[main abc1234] Add database with current products and settings
 1 file changed, 1 insertion(+)
 create mode 100644 data/multiinternational.sqlite
```

### Step 6: Push to Remote

```powershell
git push origin main
```

Or if using different branch:
```powershell
git push origin your-branch-name
```

### Step 7: Deploy on Hostinger

**Via Hostinger Dashboard:**
- Go to Control Panel → Git
- Click "Pull" or "Deploy"
- Or manually SSH and `git pull origin main`

### Step 8: Verify

1. **Refresh** your website
2. Check if YOUR products show ✅
3. Go to admin panel
4. Make a small test change
5. Refresh website - does it persist? ✅

---

## 🔄 Going Forward: Update Cycle

After Step 7, here's how to handle future content updates:

### When You Add Products in Admin Panel:

```powershell
# After making changes in admin:
# 1. Wait 10 seconds for save
# 2. Then update git:

git add data/multiinternational.sqlite
git commit -m "Update products: add new rice variant"
git push origin main

# On Hostinger server:
# Pull the changes
git pull origin main
```

**OR if using automated deployments:**
- Some hosting platforms auto-pull on git push
- Check Hostinger's Git integration settings

---

## 🔧 ADVANCED: Persistent Directory (30 min)

**For true production-grade setup:**

### Step 1: Contact Hostinger Support

Send them this message:

> "Hi! I'm running a Node.js app using SQLite database at `/data/multiinternational.sqlite`. After deployments, the database resets because the file isn't persistent. Can you:
>
> 1. Create a persistent directory (e.g., `/home/myusername/persistent_data/`) that survives code deployments?
> 2. Help me configure my Node.js app to use this directory?
> 3. Or recommend best practices for persistent storage?
>
> I'd prefer the directory approach if possible. Thanks!"

### Step 2: Modify server.js

Once Hostinger creates persistent directory, update server.js:

Find line ~7:
```javascript
const DATA_DIR = path.join(__dirname, 'data');
```

Change to:
```javascript
// Use persistent directory if available (set on VPS)
// Otherwise use local directory
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
```

### Step 3: Upload Initial Database

Hostinger will tell you the persistent path. Upload your database:

```powershell
# If you have SSH access:
scp data/multiinternational.sqlite yourusername@host:/home/yourusername/persistent_data/

# Otherwise, use Hostinger File Manager to upload to that directory
```

### Step 4: Set Environment Variable

Ask Hostinger to set (or do via control panel):
```
DATA_DIR=/home/yourusername/persistent_data
```

### Step 5: Commit server.js Change

```powershell
git add server.js
git commit -m "Support persistent data directory"
git push origin main
```

---

## ✅ Troubleshooting

### "Still showing default products after uploading"

```powershell
# 1. Check file was uploaded correctly:
# Via Hostinger File Manager, confirm:
# /home/yourusername/public_html/yoursite/data/multiinternational.sqlite
# ✅ File exists
# ✅ File size > 50KB

# 2. Server may need restart (contact Hostinger):
# - Restart Node.js application
# - Or wait 5-10 minutes for auto-restart

# 3. Check admin panel:
# Go to admin panel on your VPS
# Make a test change to confirm database works
```

### "Getting permission denied errors"

```bash
# SSH into server, then:
chmod 755 /home/yourusername/public_html/site/data/
chmod 644 /home/yourusername/public_html/site/data/multiinternational.sqlite

# Then restart server
```

### "File upload fails in File Manager"

```
- Try uploading in smaller chunks
- Or use SFTP client (Filezilla)
- Or ask Hostinger for SSH access and use: scp
```

### "Git push conflicts"

```powershell
# If database file causes conflicts:
# (Usually happens if server already has different database)

# Option 1: Force your local version
git add data/multiinternational.sqlite
git push origin main --force

# Option 2: Or pull server version first
git pull origin main
# (This will get server's database)
# Then repeat your edits locally
git add data/multiinternational.sqlite
git push origin main
```

---

## 📋 Verification Checklist

After implementing ANY solution:

- [ ] Website shows MY products (not defaults)
- [ ] Admin panel login works
- [ ] Can edit a product name
- [ ] After refresh, change is still there
- [ ] Backups exist in `data/backups/` folder
- [ ] No error messages in console

If all ✅ = Data persistence is FIXED!

---

## 🎯 Which Solution for You?

**QUICK FIX (Solution 1):**
- ✅ Want to fix NOW
- ✅ Don't know git well
- ✅ One-time upload is fine
- → **Do this: 5 minutes**

**PROPER FIX (Solution 2):**
- ✅ Using git already
- ✅ Want version control of data
- ✅ Making frequent changes
- → **Do this: 10 minutes + commit when data changes**

**PROFESSIONAL FIX (Solution 3):**
- ✅ Production website
- ✅ Lots of data changes
- ✅ Want fully persistent storage
- → **Do this: 30 minutes + Hostinger help**

---

## 📞 Still Stuck?

If none of these work:

1. **Verify database exists locally:**
   ```
   multiinternational/data/multiinternational.sqlite
   File should be > 50KB
   ```

2. **Check Hostinger file location:**
   Ask in chat: "Is my app running in `/home/username/public_html/site/` ?"

3. **Verify Node.js app is running:**
   Ask: "Is my Node.js application currently running?"

4. **Check error logs:**
   Ask Hostinger: "Can you show me recent Node.js error logs?"

---

**You've got this! Pick one solution above and your data will stay. Let me know if you get stuck!**
