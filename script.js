
// Load profile data and hydrate the page
async function loadProfile() {
  const res = await fetch('./data/profile.json');
  const p = await res.json();

  document.getElementById('nameTag').textContent = p.name;
  document.getElementById('headlineTag').textContent = p.headline;
  document.getElementById('locationTag').textContent = p.location;

  document.getElementById('aboutCopy').textContent = p.about;

  document.getElementById('linkedinLink').href = p.links.linkedin;
  document.getElementById('githubLink').href = p.links.github;
  document.getElementById('emailLink').textContent = p.email;
  document.getElementById('emailLink').href = 'mailto:' + p.email;
  document.getElementById('locText').textContent = p.location;

  const year = new Date().getFullYear();
  document.getElementById('year').textContent = year;

  const avatar = document.getElementById('avatarImg');
  // Use local avatar if provided, else a placeholder gradient
  fetch('./assets/avatar.jpg', { method: 'HEAD' }).then(resp => {
    if (resp.ok) avatar.src = './assets/avatar.jpg';
    else avatar.src = 'https://images.unsplash.com/photo-1544725121-be3bf52e2dc8?q=80&w=800&auto=format&fit=crop';
  });

  // Experience
  const eg = document.getElementById('experienceGrid');
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

  // Projects
  const pg = document.getElementById('projectsGrid');
  p.projects.forEach(pr => {
    const card = document.createElement('article');
    card.className = 'tilt-card glass rounded-2xl p-5 ring-1 ring-white/5 hover:-translate-y-1 transition transform';
    card.innerHTML = `
      <h3 class="text-lg font-bold">${pr.name}</h3>
      <div class="mt-1 text-slate-400 text-sm">${pr.stack.join(' • ')}</div>
      <p class="mt-2 text-slate-300">${pr.desc}</p>
    `;
    pg.appendChild(card);
    // Tilt effect
    VanillaTilt.init(card, { max: 8, speed: 400, glare: true, 'max-glare': 0.25 });
  });

  // Skills
  const sw = document.getElementById('skillsWrap');
  p.skills.forEach(s => {
    const chip = document.createElement('span');
    chip.className = 'px-3 py-1 rounded-full bg-slate-800/80 ring-1 ring-white/5 text-sm';
    chip.textContent = s;
    sw.appendChild(chip);
  });

  // Animate sections on scroll
  gsap.utils.toArray('.reveal-section').forEach((sec) => {
    gsap.to(sec, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out',
      scrollTrigger: { trigger: sec, start: 'top 80%' }
    });
  });

  // Tilt hero card
  VanillaTilt.init(document.querySelector('.tilt-card'), { max: 10, speed: 400, glare: true, 'max-glare': 0.2 });
}

window.addEventListener('DOMContentLoaded', loadProfile);
