import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-[#30363d] py-8">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-[#1f6feb] mb-4">Patryk Kulesza</div>
          <p className="text-[#8b949e] mb-4">
            Korepetycje z pasją • Matematyka • Angielski • Programowanie 
          </p>
          <div className="text-sm text-[#8b949e]">
            © 2024 Patryk Kulesza. Wszystkie prawa zastrzeżone.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;