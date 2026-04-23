// Hydrates .ph placeholders with real images.
// Strategy:
//   1. Try topical Unsplash CDN image (stable photo IDs, free to hotlink).
//   2. On error, fall back to picsum.photos seed URL (always returns an image).
// Each label maps to a consistent Unsplash photo ID + picsum seed so the layout is predictable.
(function(){
  const STYLE_OVERLAY = {
    dark:     'linear-gradient(180deg, rgba(10,37,64,0.18) 0%, rgba(10,37,64,0.55) 100%)',
    brass:    'linear-gradient(180deg, rgba(10,37,64,0.10) 0%, rgba(10,37,64,0.42) 100%)',
    ivory:    'linear-gradient(180deg, rgba(245,242,236,0.0) 0%, rgba(10,37,64,0.18) 100%)',
    graphite: 'linear-gradient(180deg, rgba(31,41,55,0.18) 0%, rgba(10,37,64,0.5) 100%)'
  };

  const LABEL_MAP = [
    // LEADERSHIP / PORTRAITS
    { match: /chairman/i,
      img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-chairman-portrait-suit/900/1125' },
    { match: /md\s*\/?\s*ceo|\bceo\b/i,
      img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-ceo-executive-african/900/1125' },
    { match: /cfo/i,
      img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-cfo-finance-executive/900/1125' },
    { match: /company secretary/i,
      img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-secretary-african/900/1125' },
    { match: /executive|director|board member/i,
      img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-director-boardroom/900/1125' },
    { match: /portrait/i,
      img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=900&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/igi-portrait-professional/900/1125' },

    // CITY / REAL ESTATE
    { match: /ikoyi|lekki/i,
      img: 'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1400&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/ikoyi-lekki-bridge-lagos/1400/1750' },
    { match: /lagos|victoria island|head office|skyline/i,
      img: 'https://images.unsplash.com/photo-1588401667987-e00844a56a33?w=1400&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/lagos-skyline-dusk/1400/1750' },

    // OIL & GAS
    { match: /rig|offshore|oil|energy|refinery|niger delta/i,
      img: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=1400&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/offshore-oil-rig-platform/1400/1750' },

    // AVIATION
    { match: /aircraft|aviation|murtala|tarmac|flight|airport/i,
      img: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1400&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/aircraft-tarmac-aviation/1400/1750' },

    // MARINE / CARGO
    { match: /cargo|vessel|marine|apapa|port|ship/i,
      img: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?w=1400&q=80&auto=format&fit=crop',
      fallback: 'https://picsum.photos/seed/cargo-vessel-port-marine/1400/1750' }
  ];
  const DEFAULT = {
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80&auto=format&fit=crop',
    fallback: 'https://picsum.photos/seed/igi-default/1400/1750'
  };

  function pick(label){
    for (const r of LABEL_MAP) if (r.match.test(label)) return r;
    return DEFAULT;
  }

  function hydrate(root){
    (root||document).querySelectorAll('.ph:not([data-ph-done]):not(.ph--image)').forEach(el=>{
      const label   = el.getAttribute('data-ph') || 'image';
      const variant = el.getAttribute('data-ph-variant') || 'dark';
      const src     = pick(label);

      el.setAttribute('data-ph-done','1');
      el.style.position = 'relative';
      el.style.backgroundColor = '#0A2540';
      el.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.src = src.img;
      img.alt = label;
      img.loading = 'lazy';
      Object.assign(img.style, {
        position:'absolute', inset:'0', width:'100%', height:'100%',
        objectFit:'cover', display:'block',
        filter: 'saturate(0.95) contrast(1.02)',
        opacity: '0',
        transition: 'opacity .6s ease'
      });
      img.onload  = () => { img.style.opacity = '1'; };
      img.onerror = () => {
        if (img.src !== src.fallback) img.src = src.fallback;
      };

      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position:'absolute', inset:'0',
        background: STYLE_OVERLAY[variant] || STYLE_OVERLAY.dark,
        pointerEvents: 'none', zIndex: '1'
      });

      el.innerHTML = '';
      el.appendChild(img);
      el.appendChild(overlay);
    });
  }
  window.__hydratePlaceholders = hydrate;
  if (document.readyState !== 'loading') hydrate();
  else document.addEventListener('DOMContentLoaded', ()=>hydrate());
})();
