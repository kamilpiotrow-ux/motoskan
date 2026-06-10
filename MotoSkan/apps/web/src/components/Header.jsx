import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/" className="inline-block">
          <h1 className="text-3xl font-bold text-foreground">
            Moto<span className="text-[#378ADD]">Skan</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Wszystko co warto wiedzieć przed zakupem
          </p>
        </Link>
      </div>
    </header>
  );
}

export default Header;