import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        <section className="bg-[#1f2d46] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 text-sm font-extrabold text-[#ffbd35]">Privacy Policy</p>
            <h1 className="mb-6 text-4xl font-extrabold tracking-[-0.04em] md:text-5xl text-white">
              Privacy Policy
            </h1>
            <p className="text-base leading-7 text-white/80">
              This page explains how we collect, use, and protect your information.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="prose max-w-none text-[#263248]">
            <h2>Information We Collect</h2>
            <p>
              We may collect information you provide when contacting us or submitting inquiries
              through this website.
            </p>

            <h2>How We Use Information</h2>
            <p>
              We use your information to respond to inquiries, provide services, and improve our
              website.
            </p>

            <h2>How We Protect Information</h2>
            <p>
              We implement reasonable security measures to help protect your information.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about this policy, please contact us via the website contact
              form.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

