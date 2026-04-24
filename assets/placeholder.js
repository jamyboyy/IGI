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
      img: 'assets/team/chairman.png',
      fallback: 'https://picsum.photos/seed/igi-chairman-portrait-suit/900/1125' },
    { match: /md\s*\/?\s*ceo|\bceo\b/i,
      img: 'assets/team/akinlolu-akinyele.png',
      fallback: 'https://picsum.photos/seed/igi-ceo-executive-african/900/1125' },
    { match: /cfo/i,
      img: 'assets/team/ayoola-iyiola.png',
      fallback: 'https://picsum.photos/seed/igi-cfo-finance-executive/900/1125' },
    { match: /company secretary/i,
      img: 'assets/team/emmanuel-ojomah.png',
      fallback: 'https://picsum.photos/seed/igi-secretary-african/900/1125' },

    // Non-Executive Directors (person-specific, matched before generic Director)
    { match: /kabir|tukur/i,
      img: 'assets/team/kabir-ayinde-tukur.png',
      fallback: 'https://picsum.photos/seed/igi-ned-kabir/900/1125' },
    { match: /augustine|olorunsola/i,
      img: 'assets/team/augustine-olorunsola.png',
      fallback: 'https://picsum.photos/seed/igi-ned-augustine/900/1125' },
    { match: /kanayo|okoye/i,
      img: 'assets/team/kanayo-okoye.png',
      fallback: 'https://picsum.photos/seed/igi-ned-kanayo/900/1125' },
    { match: /gaffar|animashawun/i,
      img: 'assets/team/gaffar-animashawun.png',
      fallback: 'https://picsum.photos/seed/igi-ned-gaffar/900/1125' },
    { match: /bukky|akomolafe/i,
      img: 'assets/team/bukky-akomolafe.png',
      fallback: 'https://picsum.photos/seed/igi-ned-bukky/900/1125' },
    { match: /sadiq|kaita/i,
      img: 'assets/team/sadiq-kaita.png',
      fallback: 'https://picsum.photos/seed/igi-ned-sadiq/900/1125' },
    { match: /tajudeen|ayeola/i,
      img: 'assets/team/tajudeen-ayeola.png',
      fallback: 'https://picsum.photos/seed/igi-ned-tajudeen/900/1125' },

    // Fallback for any other director/executive — gets a seeded stock photo
    { match: /executive|director|board member/i,
      perLabel: true,   // each unique data-ph gets its own image
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
    for (const r of LABEL_MAP) {
      if (r.match.test(label)) {
        if (r.perLabel) {
          // Each unique data-ph label gets a distinct seeded image
          const seed = 'igi-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return {
            img: 'https://picsum.photos/seed/' + encodeURIComponent(seed) + '/900/1125',
            fallback: r.fallback
          };
        }
        return r;
      }
    }
    return DEFAULT;
  }

  function hydrate(root){
    (root||document).querySelectorAll('.ph:not([data-ph-done]):not(.ph--image)').forEach(el=>{
      const label   = el.getAttribute('data-ph') || 'image';
      const src     = pick(label);
      // Real local team portraits are on white backgrounds — use the lightest overlay
      // so the subject stays readable.
      const isLocalPortrait = src.img.startsWith('assets/');
      const variant = el.getAttribute('data-ph-variant') || (isLocalPortrait ? 'ivory' : 'dark');

      el.setAttribute('data-ph-done','1');
      el.style.position = 'relative';
      el.style.backgroundColor = isLocalPortrait ? '#F5F2EC' : '#0A2540';
      el.style.overflow = 'hidden';

      const img = document.createElement('img');
      img.src = src.img;
      img.alt = label;
      img.loading = 'lazy';
      Object.assign(img.style, {
        position:'absolute', inset:'0', width:'100%', height:'100%',
        objectFit: 'cover',
        objectPosition: isLocalPortrait ? 'center 15%' : 'center',
        display:'block',
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
