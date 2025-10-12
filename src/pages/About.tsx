import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PenSquare } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              About The Vinyl Vault
            </h1>
            <p className="text-xl text-muted-foreground">
              A platform for writers, musicians, and creators
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Vinyl Vault is a modern blogging platform designed to empower writers and creators to share their stories, 
                knowledge, and ideas with the world. We believe in the power of words to inspire, educate, and connect people 
                across the globe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <PenSquare className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>A powerful markdown editor for crafting beautiful blog posts</span>
                </li>
                <li className="flex items-start gap-3">
                  <PenSquare className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                  <span>An intuitive dashboard for managing your content and audience</span>
                </li>
                <li className="flex items-start gap-3">
                  <PenSquare className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                  <span>A clean, responsive design that looks great on all devices</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded by passionate developers and writers, The Vinyl Vault was created to bridge the gap between 
                technical excellence and creative expression. We understand the needs of modern content creators 
                and have built a platform that combines powerful features with an elegant, distraction-free writing experience.
              </p>
            </section>

            <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 rounded-lg">
              <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Whether you're a seasoned writer, a musician documenting your journey, or someone who just loves to share ideas, 
                The Vinyl Vault is the perfect home for your content.
              </p>
              <Link 
                to="/register" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary via-secondary to-accent text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <PenSquare className="h-5 w-5" />
                Start Writing Today
              </Link>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
