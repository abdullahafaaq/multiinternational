import {
  defaultProductCategories,
  defaultProducts,
  defaultServices,
  defaultSiteSettings,
  defaultTeamMembers,
  Inquiry,
  Product,
  Service,
  SiteSettings,
  Certificate,
} from '@/lib/siteData';

const STORAGE_KEYS = {
  settings: 'multiinternational_settings',
  services: 'multiinternational_services',
  inquiries: 'multiinternational_inquiries',
};

const LEGACY_PRODUCT_STORAGE_KEY = 'multiinternational_products';
const LEGACY_SETTINGS_STORAGE_KEY = 'multiinternational_settings';
const LEGACY_SERVICES_STORAGE_KEY = 'multiinternational_services';
const LEGACY_INQUIRIES_STORAGE_KEY = 'multiinternational_inquiries';

export interface SiteStoreData {
  settings: SiteSettings;
  products: Product[];
  services: Service[];
  certificates: Certificate[];
  inquiries: Inquiry[];
}

export const defaultSiteStoreData: SiteStoreData = {
  settings: defaultSiteSettings,
  products: defaultProducts,
  services: defaultServices,
  certificates: [],
  inquiries: [],
};

function normalizeSettings(settings: Partial<SiteSettings> | undefined): SiteSettings {
  const nextSettings = {
    ...defaultSiteSettings,
    ...(settings || {}),
  };
  const normalizedTeamMembers = Array.isArray(nextSettings.teamMembers) && nextSettings.teamMembers.length > 0
    ? nextSettings.teamMembers.map((member, index) => ({
        ...defaultTeamMembers[index % defaultTeamMembers.length],
        ...member,
        image: member.image || defaultTeamMembers[index % defaultTeamMembers.length].image,
      }))
    : defaultTeamMembers;

  return {
    ...nextSettings,
    heroSlides: Array.isArray(nextSettings.heroSlides) && nextSettings.heroSlides.length > 0
      ? nextSettings.heroSlides
      : defaultSiteSettings.heroSlides,
    productCategories: Array.isArray(nextSettings.productCategories) && nextSettings.productCategories.length > 0
      ? nextSettings.productCategories
      : defaultProductCategories,
    footerRegions: Array.isArray(nextSettings.footerRegions)
      ? nextSettings.footerRegions
      : defaultSiteSettings.footerRegions,
    teamMembers: normalizedTeamMembers,
  };
}

function normalizeSiteData(data: Partial<SiteStoreData> | undefined): SiteStoreData {
  return {
    settings: normalizeSettings(data?.settings),
    products: Array.isArray(data?.products) ? data.products : defaultProducts,
    services: Array.isArray(data?.services) ? data.services : defaultServices,
    certificates: Array.isArray(data?.certificates) ? data.certificates : [],
    inquiries: Array.isArray(data?.inquiries) ? data.inquiries : [],
  };
}

export function readLocalSiteData(): SiteStoreData {
  localStorage.removeItem(LEGACY_PRODUCT_STORAGE_KEY);
  localStorage.removeItem(LEGACY_SETTINGS_STORAGE_KEY);
  localStorage.removeItem(LEGACY_SERVICES_STORAGE_KEY);
  localStorage.removeItem(LEGACY_INQUIRIES_STORAGE_KEY);

  return defaultSiteStoreData;
}

export function clearLocalSiteDataCache() {
  localStorage.removeItem(STORAGE_KEYS.settings);
  localStorage.removeItem(LEGACY_PRODUCT_STORAGE_KEY);
  localStorage.removeItem(STORAGE_KEYS.services);
  localStorage.removeItem(STORAGE_KEYS.inquiries);
}

export async function loadSharedSiteData(): Promise<SiteStoreData | null> {
  try {
    const response = await fetch('/api/site-data');
    if (!response.ok) {
      throw new Error(`Failed to load site data: ${response.status}`);
    }
    return normalizeSiteData(await response.json());
  } catch (error) {
    console.warn('Using default site data because shared site data is unavailable.', error);
    return null;
  }
}

export async function saveSharedSiteData(data: SiteStoreData) {
  clearLocalSiteDataCache();

  try {
    const response = await fetch('/api/site-data', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(normalizeSiteData(data)),
    });

    if (!response.ok) {
      throw new Error(`Failed to save site data: ${response.status}`);
    }
  } catch (error) {
    console.warn('Unable to save shared site data.', error);
  }
}
