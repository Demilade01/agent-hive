"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { slideInFromTopVariants } from "@/lib/animations";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
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
          <span className="text-xl font-bold hidden sm:block group-hover:text-cyan-400 transition-colors">
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

        {/* Right CTA */}
        <div className="flex items-center gap-4">
          <Button
            className="bg-linear-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 glow-cyan text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
            asChild
          >
            <Link href="#launch">Launch Agent</Link>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
