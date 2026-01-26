import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteSettings,
  TravelPackage,
  Service,
  Inquiry,
  defaultSiteSettings,
  defaultPackages,
  defaultServices
} from '@/lib/siteData';

interface SiteContextType {
  settings: SiteSettings;
  packages: TravelPackage[];
  services: Service[];
  inquiries: Inquiry[];
  updateSettings: (settings: SiteSettings) => void;
  addPackage: (pkg: Omit<TravelPackage, 'id'>) => void;
  updatePackage: (pkg: TravelPackage) => void;
  deletePackage: (id: string) => void;
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
    const saved = localStorage.getItem('multitravel_settings');
    return saved ? JSON.parse(saved) : defaultSiteSettings;
  });

  const [packages, setPackages] = useState<TravelPackage[]>(() => {
    const saved = localStorage.getItem('multitravel_packages');
    return saved ? JSON.parse(saved) : defaultPackages;
  });

  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('multitravel_services');
    return saved ? JSON.parse(saved) : defaultServices;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('multitravel_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('multitravel_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('multitravel_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('multitravel_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('multitravel_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addPackage = (pkg: Omit<TravelPackage, 'id'>) => {
    const newPkg = { ...pkg, id: Date.now().toString() };
    setPackages(prev => [...prev, newPkg]);
  };

  const updatePackage = (pkg: TravelPackage) => {
    setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
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
      packages,
      services,
      inquiries,
      updateSettings,
      addPackage,
      updatePackage,
      deletePackage,
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
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
}
