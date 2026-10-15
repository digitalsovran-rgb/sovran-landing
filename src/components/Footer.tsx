import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SITE = 'https://www.sovranstudio.co.uk';
const FONT = "'Inter', sans-serif";
const W = (a: number) => `rgba(255,255,255,${a})`;

const GROUPS = [
  {
    title: 'Services',
    links: [
      { label: 'Design and Build', href: `${SITE}/design-and-build` },
      { label: 'Architecture', href: `${SITE}/architecture` },
      { label: 'Construction', href: `${SITE}/construction` },
      { label: 'House Extensions', href: `${SITE}/construction/house-extensions` },
      { label: 'Loft Conversions', href: `${SITE}/construction/loft-conversions` },
      { label: 'Basement Conversions', href: `${SITE}/construction/basement-conversions` },
      { label: 'Interiors', href: `${SITE}/interiors` },
      { label: 'Commercial', href: `${SITE}/commercial` },
      { label: 'Hospitality', href: `${SITE}/commercial/hospitality` },
      { label: 'Retail', href: `${SITE}/commercial/retail` },
      { label: 'Multi-Unit Development', href: `${SITE}/commercial/multi-unit-development` },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: `${SITE}/about` },
      { label: 'Contact', href: `${SITE}/contact` },
      { label: 'Resources', href: `${SITE}/resources` },
    ],
  },
  {
    title: 'Get started',
    links: [
      { label: 'Cost Calculator', href: `${SITE}/cost-calculator` },
      { label: 'Email Us', href: 'mailto:info@sovranstudio.co.uk' },
      { label: 'Call Us', href: 'tel:+447516100111' },
      { label: 'WhatsApp Us', href: 'https://wa.me/447516100111?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: `${SITE}/privacy-policy` },
      { label: 'Terms of Service', href: `${SITE}/terms` },
    ],
  },
];

const SOCIALS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/sovran_studio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com/sovranstudio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://uk.linkedin.com/company/sovranstudio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'Houzz',
    href: 'https://houzz.co.uk/pro/sovranstudio',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.5 3L7 6v5l5.5-3V3zm0 7.5L7 13.5v5l5.5-3v-5zm5.5-1L12.5 12.5v5L18 14.5v-5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      const line = footer.querySelector('.ft-line');
      if (line) {
        gsap.from(line, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.5,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: footer, start: 'top 90%', toggleActions: 'play none none none' },
        });
      }

      const monoS = footer.querySelector('.ft-mono-s');
      if (monoS) {
        gsap.from(monoS, {
          opacity: 0,
          scale: 0.85,
          rotation: -5,
          duration: 2.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: footer, start: 'top 85%', toggleActions: 'play none none none' },
        });
        gsap.to(monoS, {
          y: isMobile ? '-35%' : '-55%',
          ease: 'none',
          scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: true },
        });
        gsap.to(monoS, {
          opacity: isMobile ? 0.09 : 0.12,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      }

      const brandImg = footer.querySelector('.ft-brand-img');
      if (brandImg) {
        gsap.set(brandImg, { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' });
        gsap.to(brandImg, {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: footer, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      const reveals = footer.querySelectorAll('.ft-up');
      gsap.from(reveals, {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 80%', toggleActions: 'play none none none' },
      });

      const bottomLine = footer.querySelector('.ft-bottom-line');
      if (bottomLine) {
        gsap.from(bottomLine, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1.2,
          delay: 0.3,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: bottomLine, start: 'top 98%', toggleActions: 'play none none none' },
        });
      }
    }, footer);

    return () => ctx.revert();
  }, [isMobile]);

  const padX = isMobile ? '20px' : 'clamp(32px, 6vw, 120px)';
  const isHttp = (href: string) => href.startsWith('http');

  return (
    <footer
      id="site-footer"
      data-bg="dark"
      ref={footerRef}
      style={{ position: 'relative', zIndex: 20, background: '#0A0A0A', overflow: 'hidden' }}
    >
      <div
        className="ft-mono-s"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          userSelect: 'none',
          right: isMobile ? '-10px' : 'clamp(20px, 5vw, 100px)',
          top: '50%',
          transform: 'translateY(-50%)',
          width: isMobile ? '220px' : 'clamp(400px, 50vw, 800px)',
          height: isMobile ? '220px' : 'clamp(400px, 50vw, 800px)',
          opacity: isMobile ? 0.06 : 0.08,
        }}
      >
        <img
          src="/media/logo-s-white.webp"
          alt=""
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain' }}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div style={{ padding: `0 ${padX}` }}>
        <div className="ft-line" style={{ height: '1px', background: W(0.08) }} />
      </div>

      <div
        style={{
          padding: isMobile
            ? `44px ${padX} 36px`
            : 'clamp(60px, 8vh, 120px) clamp(32px, 6vw, 120px) clamp(48px, 6vh, 80px)',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'flex-end',
          gap: isMobile ? '24px' : 'clamp(32px, 4vw, 80px)',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <img
            src="/media/logo-sovran-white.webp"
            alt="Sovran"
            className="ft-brand-img"
            style={{
              height: isMobile ? 'clamp(28px, 9vw, 42px)' : 'clamp(40px, 5vw, 90px)',
              width: 'auto',
              display: 'block',
            }}
            loading="lazy"
            decoding="async"
          />
        </div>

        <p
          className="ft-up"
          style={{
            margin: 0,
            fontFamily: FONT,
            fontSize: isMobile ? '12px' : 'clamp(12px, 0.9vw, 15px)',
            lineHeight: isMobile ? 1.75 : 1.7,
            color: W(0.3),
            fontWeight: 300,
            maxWidth: isMobile ? '220px' : '280px',
            textAlign: isMobile ? 'left' : 'right',
            paddingBottom: isMobile ? '0' : '0.3em',
          }}
        >
          Bespoke architecture, build, and interiors. Let&apos;s Build It Together.
        </p>
      </div>

      <div
        style={{
          padding: `0 ${padX}`,
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr',
          borderTop: `1px solid ${W(0.05)}`,
        }}
      >
        {GROUPS.map((group, i) => {
          const isRightColMobile = isMobile && i % 2 === 1;
          const isTopRowMobile = isMobile && i < 2;
          return (
            <div
              key={group.title}
              style={{
                paddingTop: isMobile ? '28px' : 'clamp(32px, 4vh, 56px)',
                paddingBottom: isMobile ? '28px' : 'clamp(32px, 4vh, 56px)',
                paddingLeft: !isMobile ? (i === 0 ? '0' : 'clamp(24px, 3vw, 60px)') : isRightColMobile ? '18px' : '0',
                paddingRight: !isMobile ? (i === 0 ? 'clamp(24px, 3vw, 60px)' : '0') : isRightColMobile ? '0' : '18px',
                borderRight: !isMobile && i !== 3 ? `1px solid ${W(0.05)}` : 'none',
                borderLeft: isMobile && isRightColMobile ? `1px solid ${W(0.05)}` : 'none',
                borderBottom: isMobile && isTopRowMobile ? `1px solid ${W(0.05)}` : 'none',
              }}
            >
              <span
                className="ft-up"
                style={{
                  display: 'block',
                  textTransform: 'uppercase',
                  fontFamily: FONT,
                  fontSize: isMobile ? '9px' : 'clamp(9px, 0.7vw, 11px)',
                  letterSpacing: '0.2em',
                  color: W(0.2),
                  fontWeight: 400,
                  marginBottom: isMobile ? '18px' : 'clamp(20px, 2.5vh, 36px)',
                }}
              >
                {group.title}
              </span>

              <nav style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : 'clamp(12px, 1.4vh, 20px)' }}>
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(isHttp(link.href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="ft-up"
                    style={{
                      fontFamily: FONT,
                      fontSize: isMobile ? '14px' : 'clamp(15px, 1.1vw, 19px)',
                      color: W(0.45),
                      fontWeight: 300,
                      textDecoration: 'none',
                      transition: 'color 0.3s ease, transform 0.3s ease',
                      display: 'inline-block',
                    }}
                    onMouseEnter={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.color = '#FFFFFF';
                        e.currentTarget.style.transform = 'translateX(8px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMobile) {
                        e.currentTarget.style.color = W(0.45);
                        e.currentTarget.style.transform = 'translateX(0)';
                      }
                    }}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>
          );
        })}
      </div>

      <div style={{ padding: `0 ${padX}`, borderTop: `1px solid ${W(0.05)}` }}>
        <div
          style={{
            display: 'flex',
            padding: isMobile ? '20px 0' : 'clamp(20px, 2.5vh, 36px) 0',
            gap: isMobile ? '12px' : 'clamp(24px, 3vw, 48px)',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'center',
          }}
        >
          <span
            className="ft-up"
            style={{
              textTransform: 'uppercase',
              fontFamily: FONT,
              fontSize: 'clamp(9px, 0.7vw, 11px)',
              letterSpacing: '0.2em',
              color: W(0.2),
              fontWeight: 400,
              marginRight: isMobile ? '0' : 'auto',
            }}
          >
            Follow us
          </span>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: isMobile ? '10px 18px' : '0 clamp(24px, 3vw, 48px)',
              alignItems: 'center',
            }}
          >
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="ft-up"
                style={{
                  color: W(0.35),
                  textDecoration: 'none',
                  transition: 'color 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isMobile) e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  if (!isMobile) e.currentTarget.style.color = W(0.35);
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: `0 ${padX} ${isMobile ? '24px' : 'clamp(28px, 3.5vh, 44px)'}` }}>
        <div
          className="ft-bottom-line"
          style={{
            height: '1px',
            background: W(0.05),
            marginBottom: isMobile ? '18px' : 'clamp(20px, 2.5vh, 32px)',
          }}
        />

        <address
          className="ft-up"
          style={{
            fontStyle: 'normal',
            fontFamily: FONT,
            fontSize: isMobile ? '10px' : 'clamp(10px, 0.75vw, 12px)',
            lineHeight: 1.8,
            color: W(0.32),
            fontWeight: 300,
            marginBottom: isMobile ? '14px' : 'clamp(14px, 1.8vh, 22px)',
          }}
        >
          Sovran Global Ltd, Saracen House, 2nd Floor, Swan Street, Isleworth, United Kingdom TW7 6RJ
          {' · '}
          <a
            href="mailto:info@sovranstudio.co.uk"
            style={{ color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              if (!isMobile) e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              if (!isMobile) e.currentTarget.style.color = 'inherit';
            }}
          >
            info@sovranstudio.co.uk
          </a>
          {' · '}
          <a
            href="tel:+447516100111"
            style={{ color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={(e) => {
              if (!isMobile) e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              if (!isMobile) e.currentTarget.style.color = 'inherit';
            }}
          >
            07516 100111
          </a>
        </address>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '14px' : '0',
          }}
        >
          <span
            className="ft-up"
            style={{
              fontFamily: FONT,
              fontSize: isMobile ? '10px' : 'clamp(10px, 0.75vw, 12px)',
              color: W(0.18),
              fontWeight: 300,
            }}
          >
            &copy; {new Date().getFullYear()} Sovran Global Ltd. All rights reserved.
          </span>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="ft-up"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '10px' : 'clamp(10px, 1vw, 16px)',
              background: 'none',
              border: `1px solid ${W(0.15)}`,
              padding: isMobile ? '10px 16px' : 'clamp(10px, 1.2vh, 16px) clamp(18px, 1.8vw, 28px)',
              fontFamily: FONT,
              fontSize: isMobile ? '9px' : 'clamp(9px, 0.7vw, 11px)',
              letterSpacing: '0.2em',
              color: W(0.5),
              fontWeight: 400,
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = W(0.4);
                e.currentTarget.style.background = W(0.05);
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.color = W(0.5);
                e.currentTarget.style.borderColor = W(0.15);
                e.currentTarget.style.background = 'none';
              }
            }}
          >
            Back to top
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
