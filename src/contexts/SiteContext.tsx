import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteSettings,
  Product,
  Service,
  Certificate,
  Inquiry,
} from '@/lib/siteData';
import {
  clearLocalSiteDataCache,
  loadSharedSiteData,
  readLocalSiteData,
  saveSharedSiteData,
  SiteStoreData,
} from '@/lib/siteStore';

interface SiteContextType {
  settings: SiteSettings;
  products: Product[];
  services: Service[];
  certificates: Certificate[];
  inquiries: Inquiry[];
  updateSettings: (settings: SiteSettings) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addCertificate: (certificate: Omit<Certificate, 'id'>) => void;
  updateCertificate: (certificate: Certificate) => void;
  deleteCertificate: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [siteData, setSiteData] = useState<SiteStoreData>(() => readLocalSiteData());

  const { settings, products, services, certificates, inquiries } = siteData;

  useEffect(() => {
    let mounted = true;

    loadSharedSiteData().then((sharedData) => {
      if (!mounted || !sharedData) return;

      setSiteData(sharedData);
      clearLocalSiteDataCache();
    });

    return () => {
      mounted = false;
    };
  }, []);

  const commitSiteData = (nextData: SiteStoreData) => {
    setSiteData(nextData);
    saveSharedSiteData(nextData);
  };

  const updateSettings = (newSettings: SiteSettings) => {
    commitSiteData({ ...siteData, settings: newSettings });
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    commitSiteData({ ...siteData, products: [...products, newProduct] });
  };

  const updateProduct = (product: Product) => {
    commitSiteData({
      ...siteData,
      products: products.map(p => p.id === product.id ? product : p),
    });
  };

  const deleteProduct = (id: string) => {
    commitSiteData({ ...siteData, products: products.filter(p => p.id !== id) });
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    commitSiteData({ ...siteData, services: [...services, newService] });
  };

  const updateService = (service: Service) => {
    commitSiteData({
      ...siteData,
      services: services.map(s => s.id === service.id ? service : s),
    });
  };

  const deleteService = (id: string) => {
    commitSiteData({ ...siteData, services: services.filter(s => s.id !== id) });
  };

  const addCertificate = (certificate: Omit<Certificate, 'id'>) => {
    const newCertificate = { ...certificate, id: Date.now().toString() };
    commitSiteData({ ...siteData, certificates: [...certificates, newCertificate] });
  };

  const updateCertificate = (certificate: Certificate) => {
    commitSiteData({
      ...siteData,
      certificates: certificates.map(c => c.id === certificate.id ? certificate : c),
    });
  };

  const deleteCertificate = (id: string) => {
    commitSiteData({ ...siteData, certificates: certificates.filter(c => c.id !== id) });
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    commitSiteData({ ...siteData, inquiries: [newInquiry, ...inquiries] });
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    commitSiteData({
      ...siteData,
      inquiries: inquiries.map(i => i.id === id ? { ...i, status } : i),
    });
  };

  const deleteInquiry = (id: string) => {
    commitSiteData({ ...siteData, inquiries: inquiries.filter(i => i.id !== id) });
  };

  return (
    <SiteContext.Provider value={{
      settings,
      products,
      services,
      certificates,
      inquiries,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addService,
      updateService,
      deleteService,
      addCertificate,
      updateCertificate,
      deleteCertificate,
      addInquiry,
      updateInquiryStatus,
      deleteInquiry
    }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSite() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
