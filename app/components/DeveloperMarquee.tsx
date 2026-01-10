'use client';

import Image from 'next/image';

const developerLogos = Array.from({ length: 15 }, (_, i) => i + 1);

export default function DeveloperMarquee() {
  return (
    <div className="at-container" id="developers-anchor">
      <div className="at-developer-section">
        <div className="at-developer-title">
          <h5>Partner Developers</h5>
        </div>
        <div className="at-marquee-container">
          <ul className="at-marquee-list">
            {[...developerLogos, ...developerLogos].map((num, idx) => (
              <li key={idx}>
                <Image
                  src={`/img/dev/${num}.png`}
                  alt={`Developer logo ${num}`}
                  width={120}
                  height={60}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

