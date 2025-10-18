async function loadProfile() {
  const res = await fetch('./data/profile.json?v=4');
  const p = await res.json();

  const isProjectsPage = location.pathname.endsWith('projects.html');

  // header info used on home
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Home-only elements
  if (!isProjectsPage) {
    const nameTag = document.getElementById('nameTag');
    if (nameTag) nameTag.textContent = p.name;
    const headlineTag = document.getElementById('headlineTag');
    if (headlineTag) headlineTag.textContent = p.headline;
    const locationTag = document.getElementById('locationTag');
    if (locationTag) locationTag.textContent = p.location;

    const aboutEl = document.getElementById('aboutCopy');
    if (aboutEl) {
      aboutEl.style.whiteSpace = 'pre-wrap';
      aboutEl.textContent = p.about.replace(/\\n/g, '\n').trim();
    }

    // Links
    const gh = document.getElementById('githubLink');
    if (gh) gh.href = p.links.github;
    const li = document.getElementById('linkedinLink');
    if (li) li.href = p.links.linkedin;
    const emailLink = document.getElementById('email');
    if (emailLink) { emailLink.textContent = p.email; emailLink.href = 'mailto:' + p.email; }
    const locText = document.getElementById('locText');
    if (locText) locText.textContent = p.location;

    // Avatar
    const avatar = document.getElementById('avatarImg');
    if (avatar) {
      fetch('./assets/avatar.jpg', { method: 'HEAD' }).then(r => {
        avatar.src = r.ok
          ? './assets/avatar.jpg'
          : 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?q=80&w=800&auto=format&fit=crop';
      });
    }

    // Awards
    if (Array.isArray(p.awards)) {
      const ag = document.getElementById('awardsGrid');
      if (ag) {
        p.awards.forEach(a => {
          const card = document.createElement('article');
          card.className = 'glass rounded-2xl p-5 ring-1 ring-white/5 hover:-translate-y-1 transition transform';
          card.innerHTML = `
            <h3 class="text-lg font-bold">${a.title}</h3>
            <div class="mt-1 text-slate-400 text-sm">${a.issuer} · ${a.date || ''}</div>
            ${a.associated ? `<div class="text-slate-400 mt-1">${a.associated}</div>` : ''}
            ${a.details ? `<p class="text-slate-300 mt-2">${a.details}</p>` : ''}
            ${Array.isArray(a.links) ? `<div class="mt-3 flex flex-wrap gap-2">` +
              a.links.map(l => `<a href="${l.url}" target="_blank" rel="noopener" class="btn-secondary">${l.label}</a>`).join('') +
            `</div>` : ''}
          `;
          ag.appendChild(card);
        });
      }
    }

    // Experience
    const eg = document.getElementById('experienceGrid');
    if (eg) {
      p.experience.forEach(exp => {
        const card = document.createElement('article');
        card.className = 'glass rounded-2xl p-5 ring-1 ring-white/5 hover:-translate-y-1 transition transform';
        card.innerHTML = `
          <div class="text-sm text-slate-400">${exp.dates}</div>
          <h3 class="text-lg font-bold mt-1">${exp.role}</h3>
          <div class="text-slate-400 mb-2">${exp.org}</div>
          <ul class="list-disc ml-5 space-y-1 text-slate-300">
            ${exp.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        `;
        eg.appendChild(card);
      });
    }

    // Skills
    const sw = document.getElementById('skillsWrap');
    p.skills.forEach(s => {
      const chip = document.createElement('span');
      chip.className = 'px-3 py-1 rounded-full bg-slate-800/80 ring-1 ring-white/5 text-sm';
      chip.textContent = s;
      sw.appendChild(chip);
    });

    // Projects preview (home page)
    // const pg = document.getElementById('projectsGrid');
    // if (pg && p.projects) {
    //   p.projects.slice(0, 6).forEach(pr => {
    //     const card = document.createElement('article');
    //     card.className = 'tilt-card glass rounded-2xl p-5 ring-1 ring-white/5 hover:-translate-y-1 transition transform';
    //     card.innerHTML = `
    //       <h3 class="text-lg font-bold">${pr.name}</h3>
    //       <div class="mt-1 text-slate-400 text-sm">${pr.stack.join(' • ')}</div>
    //       <p class="mt-2 text-slate-300">${pr.desc}</p>
    //     `;
    //     pg.appendChild(card);
    //     VanillaTilt.init(card, { max: 8, speed: 400, glare: true, 'max-glare': 0.25 });
    //   });
    // }
  }

  // Projects page
  if (isProjectsPage) {
    const grid = document.getElementById('projectsGrid');
    const search = document.getElementById('projSearch');
    const filters = document.getElementById('stackFilters');

    const allStacks = [...new Set(p.projects.flatMap(x => x.stack))].sort();
    const active = new Set();

    function render() {
      const q = (search?.value || '').toLowerCase();
      grid.innerHTML = '';

      // helper: turn desc string into bullet <li> items
      const toBullets = (text) => {
        // split on period+space, semicolons, or newlines; filter short fragments
        return text
          .split(/(?:\.\s+|;\s+|\n+)/)
          .map(s => s.trim())
          .filter(s => s.length > 2);
      };

      p.projects
        .filter(pr => {
          const hay = (pr.name + ' ' + pr.desc + ' ' + pr.stack.join(' ')).toLowerCase();
          return !q || hay.includes(q);
        })
        .filter(pr => active.size === 0 || pr.stack.some(s => active.has(s)))
        .forEach(pr => {
          const card = document.createElement('article');
          card.className = 'tilt-card glass rounded-2xl p-5 ring-1 ring-white/5 hover:-translate-y-1 transition transform';

          // header + stack
          const headerHtml = `
            <h3 class="text-lg font-bold">${pr.name}</h3>
            <div class="mt-1 text-slate-400 text-sm">${pr.stack.join(' • ')}</div>
          `;

          // bullets
          const bullets = toBullets(pr.desc);
          const bulletsHtml = bullets.length
            ? `<ul class="mt-3 list-disc ml-5 space-y-1 text-slate-300">
                ${bullets.map(b => `<li>${b}${/[\.\!]$/.test(b) ? '' : ''}</li>`).join('')}
              </ul>`
            : `<p class="mt-2 text-slate-300">${pr.desc}</p>`;

          card.innerHTML = headerHtml + bulletsHtml;

          // link buttons (PDF / GitHub / Demo)
          if (Array.isArray(pr.links) && pr.links.length) {
            const btnRow = document.createElement('div');
            btnRow.className = 'mt-3 flex flex-wrap gap-2';
            pr.links.forEach(l => {
              const a = document.createElement('a');
              a.href = l.url;
              a.target = '_blank';
              a.rel = 'noopener';
              a.className = 'btn-secondary';
              a.textContent = l.label;
              btnRow.appendChild(a);
            });
            card.appendChild(btnRow);
          }

          grid.appendChild(card);
          VanillaTilt.init(card, { max: 8, speed: 400, glare: true, 'max-glare': 0.25 });
        });
    }


    // Build filter chips
    allStacks.forEach(s => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.textContent = s;
      chip.className = 'px-3 py-1 rounded-full bg-slate-800/80 ring-1 ring-white/5 text-sm';
      chip.addEventListener('click', () => {
        if (active.has(s)) active.delete(s); else active.add(s);
        chip.classList.toggle('bg-slate-700');
        render();
      });
      filters.appendChild(chip);
    });

    if (search) search.addEventListener('input', render);
    render();
  }

  // Scroll reveals + icons
  gsap.utils.toArray('.reveal-section').forEach((sec) => {
    gsap.to(sec, { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 80%' } });
  });
  if (window.lucide && lucide.createIcons) lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', loadProfile);
