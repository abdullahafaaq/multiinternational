import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white text-[#263248]">
      <Header />
      <main className="pt-16 md:pt-[72px]">
        <section className="bg-[#1f2d46] py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <p className="mb-3 text-sm font-extrabold text-[#ffbd35]">Terms of Service</p>
            <h1 className="mb-6 text-4xl font-extrabold tracking-[-0.04em] md:text-5xl text-white">
              Terms of Service
            </h1>
            <p className="text-base leading-7 text-white/80">
              These terms govern your use of our website and services.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="prose max-w-none text-[#263248]">
            <h2>Acceptance of Terms</h2>
            <p>
              By using this website, you agree to these Terms of Service.
            </p>

            <h2>Use of the Website</h2>
            <p>
              You agree to use the website lawfully and not to interfere with its operation.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              We provide the website and content “as is” without warranties of any kind.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have questions about these terms, please contact us via the website contact
              form.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

