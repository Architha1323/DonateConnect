import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                <Heart className="h-4 w-4 text-white" fill="white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">DonateConnect</span>
            </Link>
            <p className="text-sm text-muted-foreground">Connecting donors with verified NGOs to promote sustainable reuse and support underprivileged communities.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link></li>
              <li><Link href="/ngos" className="hover:text-foreground transition-colors">NGO Directory</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Get Involved</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-foreground transition-colors">Donate Items</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Register as NGO</Link></li>
              <li><Link href="/register" className="hover:text-foreground transition-colors">Volunteer</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} DonateConnect. All rights reserved. Built with ❤️ for a better world.</p>
        </div>
      </div>
    </footer>
  );
}
