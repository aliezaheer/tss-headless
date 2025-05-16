"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link href="/" className="flex items-center">
          <Image src="/logo-black.png" alt="Logo" width={200} height={200} />
        </Link>

        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-pink-600 transition">Home</Link>
          <Link href="/about" className="hover:text-pink-600 transition">About</Link>
          <Link href="/shop" className="hover:text-pink-600 transition">Shop</Link>
          <Link href="/contact" className="hover:text-pink-600 transition">Contact</Link>
        </nav>

        <button
          onClick={toggleMobileMenu}
          className="md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 space-y-2 shadow">
          <Link href="/" onClick={toggleMobileMenu} className="block">Home</Link>
          <Link href="/about" onClick={toggleMobileMenu} className="block">About</Link>
          <Link href="/shop" onClick={toggleMobileMenu} className="block">Shop</Link>
          <Link href="/contact" onClick={toggleMobileMenu} className="block">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
