import { useEffect, useRef, useState } from 'react';
import { saleMessages } from '../../data/products';

const SaleStrip = () => {
  const messages = [...saleMessages, ...saleMessages]; // duplicate for seamless loop

  return (
    <div className="sale-strip py-2.5 overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {messages.map((msg, i) => (
          <span
            key={i}
            className="font-inter text-[11px] tracking-[2.5px] uppercase text-[#E8E0F0] px-10"
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default SaleStrip;
