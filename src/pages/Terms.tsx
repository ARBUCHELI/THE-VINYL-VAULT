import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using The Vinyl Vault, you agree to be bound by these Terms of Service and all applicable 
                laws and regulations. If you do not agree with any of these terms, you are prohibited from using this platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Accounts</h2>
              <h3 className="text-xl font-semibold mb-3">Registration</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To access certain features, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Content Guidelines</h2>
              <h3 className="text-xl font-semibold mb-3">Your Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You retain ownership of content you post on The Vinyl Vault. By posting content, you grant us a worldwide, 
                non-exclusive, royalty-free license to use, reproduce, and distribute your content.
              </p>
              
              <h3 className="text-xl font-semibold mb-3 mt-6">Prohibited Content</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You may not post content that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Violates any laws or regulations</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains hate speech or discrimination</li>
                <li>Promotes violence or illegal activities</li>
                <li>Contains spam or malicious code</li>
                <li>Impersonates others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Use the platform for any unlawful purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the platform</li>
                <li>Collect or harvest information about other users</li>
                <li>Create multiple accounts to evade bans</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed">
                The platform itself, including all software, designs, text, graphics, and other content (excluding user-generated content), 
                is owned by The Vinyl Vault, and protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend your account at any time, without prior notice or liability, 
                for any reason, including breach of these Terms. Upon termination, your right to use the platform will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The platform is provided "as is" without warranties of any kind, either express or implied. We do not warrant 
                that the platform will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, The Vinyl Vault shall not be liable for any indirect, incidental, special, 
                consequential, or punitive damages resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes. 
                Your continued use of the platform after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Service, please contact us at andresrbucheli@gmail.com
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
