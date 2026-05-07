import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir, readFile, readdir, rename, stat, unlink, writeFile } from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import initSqlJs from 'sql.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3001);
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'multiinternational.sqlite');
const LEGACY_JSON_FILE = path.join(DATA_DIR, 'site-data.json');
const DIST_DIR = path.join(__dirname, 'dist');
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const defaultData = {
  settings: {
    siteName: 'Multi International',
    tagline: 'Your Global Trade Partner',
    heroTitle: 'Connecting Businesses Worldwide',
    heroSubtitle: 'We specialize in premium quality imports and exports, connecting businesses across continents with reliable supply chains and competitive pricing.',
    heroSlides: [
      {
        id: 'slide-1',
        badge: 'Your Global Trade Partner',
        title: 'Connecting Businesses Worldwide',
        subtitle: 'We specialize in premium quality imports and exports, connecting businesses across continents with reliable supply chains and competitive pricing.',
        backgroundImage: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920',
        primaryCtaLabel: 'View Products',
        primaryCtaPath: '/products',
        secondaryCtaLabel: 'Learn About Us',
        secondaryCtaPath: '/about',
      },
      {
        id: 'slide-2',
        badge: 'Reliable Import & Export',
        title: 'Quality Products, Global Reach',
        subtitle: 'From sourcing to delivery, our team ensures smooth cross-border trade operations tailored to your business goals.',
        backgroundImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920',
        primaryCtaLabel: 'Our Services',
        primaryCtaPath: '/services',
        secondaryCtaLabel: 'Contact Us',
        secondaryCtaPath: '/contact',
      },
    ],
    productCategories: [
      'Agricultural Products',
      'Industrial Machinery',
      'Textiles & Garments',
      'Chemicals',
      'Electronics',
      'Raw Materials',
      'Consumer Goods',
      'Other',
    ],
    email: 'info@multiinternational.asia',
    phone: '+92 331 9056666 | 042 3755 3030',
    address: 'UG-21, Lucky Center, 7-8 Jail Road, Lahore, Pakistan',
    address2: '',
    aboutText: 'Multi International has been facilitating global trade for over 15 years. Under the leadership of Chief Executive IKRAM UL HAQ, our team of trade experts combines market knowledge with international experience to deliver quality products and reliable partnerships that exceed expectations.',
    footerDescription: 'Your Global Trade Partner. Facilitating global trade since 2010.',
    footerQuickLinksTitle: 'Quick Links',
    footerRegionsTitle: 'Trade Regions',
    footerRegions: ['Asia Pacific', 'Europe', 'North America', 'Middle East', 'Africa', 'South America'],
    footerCopyright: 'Multi International (Pvt). Ltd. All rights reserved.',
    footerWebsite: 'www.multiinternational.asia',
    facebookUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
    teamMembers: [
      { id: 'team-1', name: 'IKRAM UL HAQ', title: 'Chief Executive Officer' },
      { id: 'team-2', name: 'Ayesha Khan', title: 'Director, Global Operations' },
      { id: 'team-3', name: 'Bilal Ahmed', title: 'Head of Trade & Logistics' },
      { id: 'team-4', name: 'Sara Malik', title: 'Manager, Client Relations' },
    ],
  },
  certificates: [],
  products: [
    {
      id: '1',
      name: 'Premium Basmati Rice',
      category: 'Agricultural Products',
      origin: 'India',
      unit: 'Metric Ton',
      minOrderQuantity: '20 MT',
      pricePerUnit: 1200,
      description: 'Extra-long grain premium basmati rice, aged for 2 years. Perfect aroma and texture for fine dining.',
      specifications: ['Extra Long Grain', '2 Year Aged', '1% Broken Max', 'Non-GMO Certified'],
      image: 'rice',
      featured: true,
    },
    {
      id: '2',
      name: 'Organic Arabica Coffee',
      category: 'Agricultural Products',
      origin: 'Colombia',
      unit: 'Metric Ton',
      minOrderQuantity: '5 MT',
      pricePerUnit: 4500,
      description: 'Single-origin organic arabica coffee beans, carefully selected and roasted to perfection.',
      specifications: ['Single Origin', 'Organic Certified', 'Fair Trade', 'Medium Roast'],
      image: 'coffee',
      featured: true,
    },
    {
      id: '3',
      name: 'Industrial CNC Machinery',
      category: 'Industrial Machinery',
      origin: 'Germany',
      unit: 'Unit',
      minOrderQuantity: '1 Unit',
      pricePerUnit: 85000,
      description: 'High-precision CNC milling machines for manufacturing. Industry-leading accuracy and durability.',
      specifications: ['5-Axis Control', '0.001mm Precision', 'CE Certified', '2 Year Warranty'],
      image: 'machinery',
      featured: true,
    },
    {
      id: '4',
      name: 'Cotton Textiles',
      category: 'Textiles & Garments',
      origin: 'Bangladesh',
      unit: 'Metric Ton',
      minOrderQuantity: '10 MT',
      pricePerUnit: 2800,
      description: 'High-quality cotton fabrics and textiles suitable for garment manufacturing and home furnishings.',
      specifications: ['100% Cotton', 'OEKO-TEX Certified', 'Multiple Thread Counts', 'Various Colors'],
      image: 'textiles',
      featured: false,
    },
    {
      id: '5',
      name: 'Pharmaceutical Grade Chemicals',
      category: 'Chemicals',
      origin: 'Switzerland',
      unit: 'Kilogram',
      minOrderQuantity: '500 KG',
      pricePerUnit: 150,
      description: 'High-purity pharmaceutical intermediates and active ingredients for drug manufacturing.',
      specifications: ['99.9% Purity', 'GMP Certified', 'COA Included', 'Cold Chain Available'],
      image: 'chemicals',
      featured: false,
    },
    {
      id: '6',
      name: 'Consumer Electronics',
      category: 'Electronics',
      origin: 'China',
      unit: 'Unit',
      minOrderQuantity: '1000 Units',
      pricePerUnit: 45,
      description: 'Wholesale consumer electronics including smart devices, accessories, and components.',
      specifications: ['CE/FCC Certified', 'OEM Available', 'Custom Branding', '1 Year Warranty'],
      image: 'electronics',
      featured: false,
    },
  ],
  services: [
    {
      id: '1',
      name: 'Import/Export Consulting',
      description: 'Expert guidance on international trade regulations, tariffs, and market entry strategies.',
      icon: 'globe',
    },
    {
      id: '2',
      name: 'Customs Clearance',
      description: 'Streamlined customs documentation and clearance services for hassle-free imports and exports.',
      icon: 'file-check',
    },
    {
      id: '3',
      name: 'Freight Forwarding',
      description: 'Comprehensive logistics solutions including sea, air, and land freight at competitive rates.',
      icon: 'ship',
    },
    {
      id: '4',
      name: 'Quality Inspection',
      description: 'Pre-shipment and on-site quality inspections to ensure products meet your specifications.',
      icon: 'search-check',
    },
    {
      id: '5',
      name: 'Trade Documentation',
      description: 'Complete documentation services including letters of credit, bills of lading, and certificates.',
      icon: 'file-text',
    },
    {
      id: '6',
      name: 'Supply Chain Management',
      description: 'End-to-end supply chain optimization for efficient and cost-effective operations.',
      icon: 'network',
    },
  ],
  inquiries: [],
};

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

let db;
let SQL;
let writeQueue = Promise.resolve();

async function pathExists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function initDatabase() {
  await mkdir(DATA_DIR, { recursive: true });
  SQL = await initSqlJs({
    locateFile: (file) => fileURLToPath(pathToFileURL(path.join(__dirname, 'node_modules', 'sql.js', 'dist', file))),
  });

  if (await pathExists(DB_FILE)) {
    db = new SQL.Database(await readFile(DB_FILE));
  } else {
    db = new SQL.Database();
  }

  db.run(`
    PRAGMA foreign_keys = ON;
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      origin TEXT NOT NULL,
      unit TEXT NOT NULL,
      min_order_quantity TEXT NOT NULL,
      price_per_unit REAL NOT NULL DEFAULT 0,
      description TEXT NOT NULL,
      specifications TEXT NOT NULL DEFAULT '[]',
      image TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      issuer TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      featured INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      product_id TEXT,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS admin_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  if (isDatabaseEmpty()) {
    const initialData = await loadInitialData();
    replaceSiteData(initialData);
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    await persistDatabase();
  } else if (!getAdminPasswordHash()) {
    setAdminPassword(DEFAULT_ADMIN_PASSWORD);
    await persistDatabase();
  }

  // If certificates table exists but is empty, try to import certificates from legacy JSON
  try {
    const certCount = db.exec("SELECT COUNT(*) AS count FROM certificates")[0]?.values[0][0] || 0;
    if (certCount === 0 && await pathExists(LEGACY_JSON_FILE)) {
      try {
        const legacyData = JSON.parse(await readFile(LEGACY_JSON_FILE, 'utf8'));
        if (Array.isArray(legacyData.certificates) && legacyData.certificates.length > 0) {
          const insertCertificate = db.prepare('INSERT INTO certificates (id, name, issuer, description, image, featured, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
          for (const cert of legacyData.certificates) {
            insertCertificate.run([
              String(cert.id || Date.now().toString()),
              cert.name || '',
              cert.issuer || '',
              cert.description || '',
              cert.image || '',
              cert.featured ? 1 : 0,
            ]);
          }
          insertCertificate.free();
          await persistDatabase();
        }
      } catch (e) {
        console.warn('Failed to import legacy certificates', e);
      }
    }
  } catch (e) {
    // ignore if certificates table not present yet
  }
}

function isDatabaseEmpty() {
  const settingsCount = db.exec('SELECT COUNT(*) AS count FROM settings')[0]?.values[0][0] || 0;
  const productCount = db.exec('SELECT COUNT(*) AS count FROM products')[0]?.values[0][0] || 0;
  return settingsCount === 0 && productCount === 0;
}

async function loadInitialData() {
  if (await pathExists(LEGACY_JSON_FILE)) {
    try {
      const legacyData = JSON.parse(await readFile(LEGACY_JSON_FILE, 'utf8'));
      return {
        settings: { ...defaultData.settings, ...legacyData.settings },
        products: Array.isArray(legacyData.products) ? legacyData.products : defaultData.products,
        services: Array.isArray(legacyData.services) ? legacyData.services : defaultData.services,
        certificates: Array.isArray(legacyData.certificates) ? legacyData.certificates : defaultData.certificates,
        inquiries: Array.isArray(legacyData.inquiries) ? legacyData.inquiries : defaultData.inquiries,
      };
    } catch (error) {
      console.warn('Could not migrate legacy JSON data. Starting from defaults.', error);
    }
  }

  return defaultData;
}

function persistDatabase() {
  writeQueue = writeQueue.then(async () => {
    const tempFile = `${DB_FILE}.tmp`;
    await backupDatabase();
    await writeFile(tempFile, Buffer.from(db.export()));
    await rename(tempFile, DB_FILE);
  });

  return writeQueue;
}

async function backupDatabase() {
  if (!(await pathExists(DB_FILE))) return;

  await mkdir(BACKUP_DIR, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await copyFile(DB_FILE, path.join(BACKUP_DIR, `multiinternational-${timestamp}.sqlite`));
  await pruneBackups();
}

async function pruneBackups() {
  const backups = (await readdir(BACKUP_DIR))
    .filter((file) => file.endsWith('.sqlite'))
    .sort();

  const staleBackups = backups.slice(0, Math.max(0, backups.length - 20));

  await Promise.all(staleBackups.map((file) => unlink(path.join(BACKUP_DIR, file))));
}

function parseJson(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function selectProducts() {
  const result = db.exec(`
    SELECT id, name, category, origin, unit, min_order_quantity, price_per_unit, description, specifications, image, featured
    FROM products
    ORDER BY rowid
  `)[0];

  if (!result) return [];

  return result.values.map(([id, name, category, origin, unit, minOrderQuantity, pricePerUnit, description, specifications, image, featured]) => ({
    id,
    name,
    category,
    origin,
    unit,
    minOrderQuantity,
    pricePerUnit,
    description,
    specifications: parseJson(specifications, []),
    image,
    featured: Boolean(featured),
  }));
}

function selectServices() {
  const result = db.exec('SELECT id, name, description, icon FROM services ORDER BY rowid')[0];
  if (!result) return [];

  return result.values.map(([id, name, description, icon]) => ({
    id,
    name,
    description,
    icon,
  }));
}

function selectInquiries() {
  const result = db.exec(`
    SELECT id, name, email, phone, product_id, message, created_at, status
    FROM inquiries
    ORDER BY created_at DESC
  `)[0];

  if (!result) return [];

  return result.values.map(([id, name, email, phone, productId, message, createdAt, status]) => ({
    id,
    name,
    email,
    phone,
    productId: productId || undefined,
    message,
    createdAt,
    status,
  }));
}

function selectCertificates() {
  const result = db.exec('SELECT id, name, issuer, description, image, featured FROM certificates ORDER BY rowid')[0];
  if (!result) return [];

  return result.values.map(([id, name, issuer, description, image, featured]) => ({
    id,
    name,
    issuer,
    description,
    image,
    featured: Boolean(featured),
  }));
}

function readSiteData() {
  const settingsRow = db.exec('SELECT data FROM settings WHERE id = 1')[0]?.values[0]?.[0];

  return {
    settings: {
      ...defaultData.settings,
      ...(settingsRow ? parseJson(settingsRow, {}) : {}),
    },
    products: selectProducts(),
    services: selectServices(),
    certificates: selectCertificates(),
    inquiries: selectInquiries(),
  };
}

function replaceSiteData(data) {
  db.run('BEGIN TRANSACTION');

  try {
    db.run('DELETE FROM settings');
    db.run('DELETE FROM products');
    db.run('DELETE FROM services');
    db.run('DELETE FROM certificates');
    db.run('DELETE FROM inquiries');

    db.run('INSERT INTO settings (id, data, updated_at) VALUES (1, ?, CURRENT_TIMESTAMP)', [
      JSON.stringify({ ...defaultData.settings, ...data.settings }),
    ]);

    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, category, origin, unit, min_order_quantity, price_per_unit, description, specifications, image, featured, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    for (const product of data.products || []) {
      insertProduct.run([
        String(product.id),
        product.name || '',
        product.category || '',
        product.origin || '',
        product.unit || '',
        product.minOrderQuantity || '',
        Number(product.pricePerUnit || 0),
        product.description || '',
        JSON.stringify(Array.isArray(product.specifications) ? product.specifications : []),
        product.image || '',
        product.featured ? 1 : 0,
      ]);
    }
    insertProduct.free();

    const insertService = db.prepare('INSERT INTO services (id, name, description, icon, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)');
    for (const service of data.services || []) {
      insertService.run([String(service.id), service.name || '', service.description || '', service.icon || '']);
    }
    insertService.free();

    const insertCertificate = db.prepare('INSERT INTO certificates (id, name, issuer, description, image, featured, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
    for (const cert of data.certificates || []) {
      insertCertificate.run([
        String(cert.id),
        cert.name || '',
        cert.issuer || '',
        cert.description || '',
        cert.image || '',
        cert.featured ? 1 : 0,
      ]);
    }
    insertCertificate.free();

    const insertInquiry = db.prepare(`
      INSERT INTO inquiries (id, name, email, phone, product_id, message, created_at, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const inquiry of data.inquiries || []) {
      insertInquiry.run([
        String(inquiry.id),
        inquiry.name || '',
        inquiry.email || '',
        inquiry.phone || '',
        inquiry.productId || null,
        inquiry.message || '',
        inquiry.createdAt || new Date().toISOString(),
        inquiry.status || 'new',
      ]);
    }
    insertInquiry.free();

    db.run('COMMIT');
  } catch (error) {
    db.run('ROLLBACK');
    throw error;
  }
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, 'sha256').toString('hex');
  return `${salt}:${hash}`;
}

function getAdminPasswordHash() {
  return db.exec("SELECT value FROM admin_settings WHERE key = 'password_hash'")[0]?.values[0]?.[0] || '';
}

function setAdminPassword(password) {
  db.run(`
    INSERT INTO admin_settings (key, value, updated_at)
    VALUES ('password_hash', ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
  `, [hashPassword(password)]);
}

function verifyAdminPassword(password) {
  const stored = getAdminPasswordHash();
  const [salt, expectedHash] = stored.split(':');
  if (!salt || !expectedHash) return false;

  const actualHash = hashPassword(password, salt).split(':')[1];
  return crypto.timingSafeEqual(Buffer.from(actualHash, 'hex'), Buffer.from(expectedHash, 'hex'));
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10_000_000) {
        reject(new Error('Request body is too large.'));
        request.destroy();
      }
    });

    request.on('end', () => resolve(body));
    request.on('error', reject);
  });
}

async function readJsonBody(request) {
  const body = await readRequestBody(request);
  return body ? JSON.parse(body) : {};
}

function sendJson(response, status, data) {
  response.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(JSON.stringify(data));
}

function isValidSiteData(data) {
  return (
    data &&
    typeof data === 'object' &&
    data.settings &&
    Array.isArray(data.products) &&
    Array.isArray(data.services) &&
    Array.isArray(data.certificates) &&
    Array.isArray(data.inquiries)
  );
}

async function handleSiteDataApi(request, response) {
  if (request.method === 'GET') {
    sendJson(response, 200, readSiteData());
    return;
  }

  if (request.method === 'PUT') {
    const data = await readJsonBody(request);

    if (!isValidSiteData(data)) {
      sendJson(response, 400, { error: 'Invalid site data.' });
      return;
    }

    replaceSiteData(data);
    await persistDatabase();
    sendJson(response, 200, readSiteData());
    return;
  }

  response.writeHead(405, { Allow: 'GET, PUT' });
  response.end();
}

async function handleAuthApi(request, response) {
  if (request.url === '/api/auth/login' && request.method === 'POST') {
    const { password } = await readJsonBody(request);
    sendJson(response, 200, { success: verifyAdminPassword(String(password || '')) });
    return;
  }

  if (request.url === '/api/admin/password' && request.method === 'PUT') {
    const { currentPassword, newPassword } = await readJsonBody(request);

    if (!verifyAdminPassword(String(currentPassword || ''))) {
      sendJson(response, 400, { error: 'Current password is incorrect.' });
      return;
    }

    if (String(newPassword || '').length < 6) {
      sendJson(response, 400, { error: 'New password must be at least 6 characters.' });
      return;
    }

    setAdminPassword(String(newPassword));
    await persistDatabase();
    sendJson(response, 200, { success: true });
    return;
  }

  sendJson(response, 404, { error: 'Not found' });
}

async function handleApi(request, response) {
  if (request.url === '/api/site-data') {
    await handleSiteDataApi(request, response);
    return;
  }

  if (request.url?.startsWith('/api/auth/') || request.url === '/api/admin/password') {
    await handleAuthApi(request, response);
    return;
  }

  sendJson(response, 404, { error: 'Not found' });
}

async function serveStatic(request, response) {
  const urlPath = new URL(request.url || '/', `http://${request.headers.host}`).pathname;
  const requestedPath = urlPath === '/' ? '/index.html' : urlPath;
  const normalizedPath = path.normalize(decodeURIComponent(requestedPath)).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST_DIR, normalizedPath);

  if (!filePath.startsWith(DIST_DIR)) {
    response.writeHead(403);
    response.end('Forbidden');
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const extension = path.extname(filePath);
  response.writeHead(200, {
    'Content-Type': contentTypes[extension] || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}

await initDatabase();

createServer(async (request, response) => {
  try {
    if (request.url?.startsWith('/api/')) {
      await handleApi(request, response);
      return;
    }

    await serveStatic(request, response);
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: 'Server error' });
  }
}).listen(PORT, () => {
  console.log(`Multi International server running on http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_FILE}`);
});
