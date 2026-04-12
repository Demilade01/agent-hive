"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { slideInFromTopVariants } from "@/lib/animations";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Product", href: "#product" },
    { label: "Marketplace", href: "#marketplace" },
    { label: "Docs", href: "#docs" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={slideInFromTopVariants}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-effect-dark border-b border-cyan-500/20"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-shadow rounded-lg">
            <Image
              src="/icon.jpg"
              alt="AgentHive Logo"
              width={40}
              height={40}
              className="w-full h-full"
            />
          </div>
          <span className="text-xl font-bold hidden sm:block text-white group-hover:text-cyan-400 transition-colors">
            AgentHive
          </span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-slate-300 hover:text-cyan-400 transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA and Mobile Menu */}
        <div className="flex items-center gap-4">
          <Button
            className="hidden sm:flex bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 glow-cyan text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
            asChild
          >
            <Link href="/dashboard/agents">Launch Agent</Link>
          </Button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="sm:hidden p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sm:hidden bg-slate-950/95 backdrop-blur-md border-b border-cyan-500/20"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block text-slate-300 hover:text-cyan-400 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <Button
              className="w-full bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 glow-cyan text-white font-semibold py-2 rounded-lg transition-all duration-300 mt-4"
              asChild
            >
              <Link href="/dashboard/agents" onClick={() => setIsMenuOpen(false)}>Launch Agent</Link>
            </Button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
