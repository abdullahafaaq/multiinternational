# Technical Deep Dive: How Your Database Works

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER / ADMIN UI                   │
│          (React Components - src/pages/admin/)          │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP Requests
                   ↓
┌─────────────────────────────────────────────────────────┐
│                   Node.js SERVER                        │
│                  (server.js)                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  /api/site-data        (GET & PUT endpoints)     │  │
│  │  ├─ GET  → Returns entire site data              │  │
│  │  └─ PUT  → Saves updated site data               │  │
│  └───────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────┐
│              SQLite DATABASE                            │
│         (data/multiinternational.sqlite)               │
│                                                         │
│  ┌─────────┬──────────┬──────────┬────────────┐         │
│  │settings │ products │ services │inquiries   │ ...    │
│  └─────────┴──────────┴──────────┴────────────┘         │
│                                                         │
│  Backed up to: data/backups/*.sqlite                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Database File Location

```
multiinternational/
├── server.js                           (Node.js server)
├── data/                               (Database directory)
│   ├── multiinternational.sqlite       (⚠️ THE CRITICAL FILE)
│   └── backups/
│       ├── multiinternational-2024-01-15T...sqlite
│       ├── multiinternational-2024-01-16T...sqlite
│       └── ... (keeps last 20 backups)
├── src/
│   ├── lib/
│   │   ├── siteData.ts                (Data interfaces)
│   │   └── siteStore.ts               (Frontend state management)
│   └── pages/
│       └── admin/                     (Admin editing interface)
└── dist/                              (Compiled frontend)
```

**KEY FILE:** `data/multiinternational.sqlite` - This is the database file that MUST be on your VPS!

---

## 🔄 Data Flow: When You Edit Product

### Step 1: Admin Makes Change
```
User edits product in Admin Panel
    ↓
React component updates state
    ↓
Calls: saveSharedSiteData(data)  [src/lib/siteStore.ts]
```

### Step 2: Frontend Sends to Server
```javascript
// From src/lib/siteStore.ts
async function saveSharedSiteData(data: SiteStoreData) {
  const response = await fetch('/api/site-data', {
    method: 'PUT',                    // ← Important: PUT request
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)        // ← Sends all data
  });
}
```

**Network request:**
```
PUT /api/site-data HTTP/1.1
Content-Type: application/json

{
  "settings": { ... },
  "products": [ { id: "1", name: "Rice", ... }, ... ],
  "services": [ ... ],
  "certificates": [ ... ],
  "inquiries": [ ... ]
}
```

### Step 3: Server Receives & Validates
```javascript
// From server.js - Line 688
async function handleSiteDataApi(request, response) {
  if (request.method === 'PUT') {
    const data = await readJsonBody(request);
    
    // Validates data structure
    if (!isValidSiteData(data)) {
      sendJson(response, 400, { error: 'Invalid site data.' });
      return;
    }
    
    // Saves to database
    replaceSiteData(data);          // ← Writes to SQLite
    await persistDatabase();         // ← Saves to disk
    
    sendJson(response, 200, readSiteData());
  }
}
```

### Step 4: Database Updated
```javascript
// From server.js - Line 493
function replaceSiteData(data) {
  db.run('BEGIN TRANSACTION');  // Start database transaction
  
  // Clear old data
  db.run('DELETE FROM products');
  
  // Insert all new products
  const insertProduct = db.prepare(`
    INSERT INTO products (
      id, name, category, origin, unit, min_order_quantity,
      price_per_unit, description, specifications, image, featured
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  for (const product of data.products) {
    insertProduct.run([...productData...]);
  }
  
  db.run('COMMIT');  // Save all changes
}
```

### Step 5: File Written to Disk
```javascript
// From server.js - Line 325
function persistDatabase() {
  writeQueue = writeQueue.then(async () => {
    const tempFile = `${DB_FILE}.tmp`;
    await backupDatabase();  // ← Creates backup first!
    await writeFile(tempFile, Buffer.from(db.export()));
    await rename(tempFile, DB_FILE);  // ← Atomic write to disk
  });
}
```

**Result:** `data/multiinternational.sqlite` file updated with your changes! ✅

---

## 🗄️ Database Schema

```sql
-- Settings table (stores site config)
CREATE TABLE settings (
  id INTEGER PRIMARY KEY CHECK (id = 1),      -- Only 1 row
  data TEXT NOT NULL,                         -- JSON string
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  origin TEXT NOT NULL,
  unit TEXT NOT NULL,
  min_order_quantity TEXT NOT NULL,
  price_per_unit REAL NOT NULL DEFAULT 0,
  description TEXT NOT NULL,
  specifications TEXT NOT NULL DEFAULT '[]',  -- Stored as JSON
  image TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,        -- Boolean: 0 or 1
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Certificates table
CREATE TABLE certificates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Inquiries/Messages table
CREATE TABLE inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  product_id TEXT,
  message TEXT NOT NULL,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL
);

-- Admin settings (password hash stored here)
CREATE TABLE admin_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Server Startup Process

When your server starts (local or on VPS):

```javascript
// From server.js - Line 236
async function initDatabase() {
  // 1. Create data directory if needed
  await mkdir(DATA_DIR, { recursive: true });
  
  // 2. Check if database file exists
  if (await pathExists(DB_FILE)) {
    console.log('✅ Database file found!');
    db = new SQL.Database(await readFile(DB_FILE));
    // ↑ Loads existing database
  } else {
    console.log('❌ Database file NOT found');
    console.log('⚠️ Creating NEW database with DEFAULT DATA');
    db = new SQL.Database();  // Create empty database
    // ↓ Fills with defaults
  }
  
  // 3. Create tables if they don't exist
  db.run(`CREATE TABLE IF NOT EXISTS products ...`);
  
  // 4. If empty, load default data
  if (isDatabaseEmpty()) {
    const initialData = await loadInitialData();
    replaceSiteData(initialData);  // ← FILLS WITH DEFAULTS
    await persistDatabase();
  }
}
```

**This is where your data resets! ↑**

---

## 🔴 Why Data Resets on VPS

### Deployment Process on Hostinger:

```
Local Machine                    →    Hostinger VPS
┌──────────────────────────────┐     ┌─────────────────┐
│ multiinternational/          │     │ public_html/    │
│ ├── server.js        ✅      │────→│ ├── server.js   │
│ ├── src/         ✅          │────→│ ├── src/        │
│ ├── dist/        ✅          │────→│ ├── dist/       │
│ ├── data/                    │     │ ├── data/       │
│ │   └── multiinternational   │     │ │   └── (empty) │
│ │       .sqlite      ✅      │     │ │       (not pushed)
│ │                           │     │ │                │
│ └──────────────────────────────┘     └─────────────────┘
       (with YOUR data)                 (only code!)
```

**On VPS server startup:**
```
Server starts
    ↓
Loads server.js
    ↓
Tries to read: data/multiinternational.sqlite
    ↓
❌ FILE NOT FOUND (wasn't deployed)
    ↓
Creates NEW database
    ↓
⚠️ Fills with DEFAULT DATA
    ↓
Your changes: GONE ❌
```

---

## ✅ How to Fix: File Deployment

### Option A: Include in Git (Recommended)

```bash
# 1. Ensure data folder is NOT in .gitignore
# 2. Add database file
git add data/multiinternational.sqlite
git add data/backups/

# 3. Commit with message
git commit -m "Include database with current product catalog"

# 4. Push to Hostinger
git push origin main

# 5. On VPS, pull and rebuild
git pull origin main
npm run build
```

**Result:** Database file deployed! Server reads it on startup ✅

### Option B: Upload Manually

```bash
# 1. Local machine: ensure database has all changes
ls -lah data/multiinternational.sqlite

# 2. Via Hostinger File Manager:
#    - Go to /home/yourusername/public_html/yoursite/
#    - Create "data" folder if missing
#    - Upload multiinternational.sqlite into it

# 3. Server restarts (automatic or manual)
#    Now reads the uploaded database file ✅
```

---

## 🔍 How to Check Database Status

### Locally on Your Machine:

```bash
# Check if database exists
ls -lh data/multiinternational.sqlite

# Check file size (should be > 10KB)
du -h data/multiinternational.sqlite

# Check if backups exist
ls -lh data/backups/
```

### On VPS via SSH:

```bash
# SSH into your server, then:
cd /home/yourusername/public_html/yoursite

# Check if database file exists
ls -lh data/multiinternational.sqlite

# If file is small (< 5KB), it's new/empty
# If file is larger, it has data

# View file permissions
ls -la data/multiinternational.sqlite
# Should show: -rw-r--r-- (or similar)
```

---

## 📊 Data Persistence Timeline

```
LOCAL MACHINE:
Day 1:  Add 10 products        → Saved to data/multiinternational.sqlite
Day 2:  Edit settings          → Updated in sqlite file
Day 3:  Add 5 more products    → Updated in sqlite file
                     ↓
        DEPLOY TO VPS
                     ↓
Day 3:  If sqlite file NOT deployed:
        ✅ Code deployed
        ❌ Database NOT deployed
        ↓
        Server starts, finds no database
        ↓
        Creates new database with defaults
        ↓
        All 15 products GONE! ❌

        If sqlite file IS deployed:
        ✅ Code deployed
        ✅ Database deployed
        ↓
        Server starts, finds database
        ↓
        Loads all 15 products
        ↓
        Everything works! ✅
```

---

## 🎯 Solution Summary

| What | Where | Problem | Solution |
|------|-------|---------|----------|
| **Server Code** | `server.js` + `src/` + `dist/` | ✅ Deployed | Deployed via git |
| **Frontend Code** | `dist/` folder | ✅ Deployed | Deployed via git |
| **Database File** | `data/multiinternational.sqlite` | ❌ NOT deployed | **Need to fix** |
| **Your Changes** | Stored in database file | ❌ LOST | Fix by deploying database |

---

## 🚀 Next Steps

1. **Immediately:** Upload your local database file to VPS `data/` folder
2. **This week:** Add database to git version control
3. **Next month:** Set up persistent storage directory on VPS
4. **Production:** Consider using MySQL/PostgreSQL for better reliability

Your data isn't lost - it's just on your local machine and needs to be transferred to the VPS!
