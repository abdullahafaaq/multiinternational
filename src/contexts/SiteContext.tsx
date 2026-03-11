import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteSettings,
  Product,
  Service,
  Inquiry,
  defaultSiteSettings,
  defaultProducts,
  defaultServices
} from '@/lib/siteData';

interface SiteContextType {
  settings: SiteSettings;
  products: Product[];
  services: Service[];
  inquiries: Inquiry[];
  updateSettings: (settings: SiteSettings) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  deleteInquiry: (id: string) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('multiinternational_settings');
    return saved ? { ...defaultSiteSettings, ...JSON.parse(saved) } : defaultSiteSettings;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('multiinternational_products');
    return saved ? JSON.parse(saved) : defaultProducts;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('multiinternational_services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('multiinternational_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('multiinternational_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('multiinternational_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('multiinternational_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('multiinternational_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addService = (service: Omit<Service, 'id'>) => {
    const newService = { ...service, id: Date.now().toString() };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (service: Service) => {
    setServices(prev => prev.map(s => s.id === service.id ? service : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const updateInquiryStatus = (id: string, status: Inquiry['status']) => {
    setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
  };

  const deleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(i => i.id !== id));
  };

  return (
    <SiteContext.Provider value={{
      settings,
      products,
      services,
      inquiries,
      updateSettings,
      addProduct,
      updateProduct,
      deleteProduct,
      addService,
      updateService,
      deleteService,
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
