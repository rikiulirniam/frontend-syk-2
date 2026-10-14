// ==========================================
// KONFIGURASI API & DATA DINAMIS (PENGALAMAN & PROJECTS)
// ==========================================

const API_BASE_URL = window.location.origin.includes(':8000') 
  ? window.location.origin 
  : 'http://127.0.0.1:8000';

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function resolveImageUrl(imagePath, baseUrl) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  if (imagePath.startsWith('assets/')) {
    return imagePath;
  }
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }
  if (imagePath.startsWith('storage/')) {
    return `${baseUrl}/${imagePath}`;
  }
  return `${baseUrl}/storage/${imagePath}`;
}

// 1. Memuat Pengalaman Kerja / Pendidikan secara Dinamis dari /api/experiences
async function loadExperiences() {
  const experienceList = document.getElementById('experienceList');
  if (!experienceList) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/experiences`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }

    const experiences = await response.json();
    if (!Array.isArray(experiences) || experiences.length === 0) return;

    // Render list pengalaman secara dinamis
    experienceList.innerHTML = experiences.map((exp, index) => `
      <li class="${index < experiences.length - 1 ? 'mb-10 ' : ''}ml-6">
        <span class="absolute -left-[9px] flex items-center justify-center w-4 h-4 bg-primary rounded-full ring-4 ring-white"></span>
        <p class="text-xs text-gray-400 mb-1">${escapeHtml(exp.year || '')}</p>
        <h3 class="font-heading font-semibold text-gray-900">${escapeHtml(exp.title || '')}</h3>
        <p class="text-gray-500 text-sm mt-1 whitespace-pre-line">${escapeHtml(exp.description || '')}</p>
      </li>
    `).join('');

  } catch (error) {
    console.warn('Gagal memuat data pengalaman dari API, menggunakan data default:', error);
  }
}

// 2. Memuat Skills secara Dinamis dari /api/skills
async function loadSkills() {
  const skillList = document.getElementById('skillList');
  if (!skillList) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/skills`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }

    const skills = await response.json();
    if (!Array.isArray(skills) || skills.length === 0) return;

    // Render badge skill secara dinamis
    skillList.innerHTML = skills.map(skill => `
      <span class="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition">
        ${escapeHtml(skill.name || '')}
      </span>
    `).join('');

  } catch (error) {
    console.warn('Gagal memuat data skills dari API, menggunakan data default:', error);
  }
}

// 3. Memuat Projects secara Dinamis dari /api/projects
async function loadProjects() {
  const projectList = document.getElementById('projectList');
  if (!projectList) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/projects`, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}: ${response.statusText}`);
    }

    const projects = await response.json();
    if (!Array.isArray(projects) || projects.length === 0) return;

    // Render kartu project secara dinamis
    projectList.innerHTML = projects.map(proj => {
      const imageSrc = resolveImageUrl(proj.image, API_BASE_URL);
      const imgContent = imageSrc 
        ? `<img src="${imageSrc}" alt="${escapeHtml(proj.title)}" class="w-full h-full object-cover rounded-xl" onerror="this.parentElement.innerHTML='<span class=\\'text-gray-400 text-xs\\'>${escapeHtml(proj.title)}</span>'">`
        : `<span class="text-gray-400 text-xs">${escapeHtml(proj.title || 'Screenshot')}</span>`;

      return `
        <article class="bg-white border border-gray-100 rounded-2xl p-5 transition duration-200 ease-in-out hover:shadow-[0_10px_25px_-10px_rgba(0,0,0,0.15)] hover:-translate-y-0.5">
          <div class="bg-gray-200 rounded-xl aspect-video mb-4 flex items-center justify-center text-gray-400 text-xs overflow-hidden">
            ${imgContent}
          </div>
          <h3 class="font-heading font-semibold text-lg text-gray-900 mb-1">${escapeHtml(proj.title || '')}</h3>
          <p class="text-gray-500 text-sm mb-3 whitespace-pre-line">${escapeHtml(proj.description || '')}</p>
        </article>
      `;
    }).join('');

  } catch (error) {
    console.warn('Gagal memuat data projects dari API, menggunakan data default:', error);
  }
}

// ==========================================
// INISIALISASI SAAT HALAMAN SELESAI DIMUAT
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Muat data dinamis untuk Pengalaman, Skills & Projects (Profile tetap statis)
  loadExperiences();
  loadSkills();
  loadProjects();

  // Update Tahun Copyright Otomatis
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Hamburger Menu
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  menuBtn?.addEventListener('click', (event) => {
    event.stopPropagation();
    const isClosed = mobileMenu?.classList.contains('hidden');
    mobileMenu?.classList.toggle('hidden');
    mobileMenu?.classList.toggle('flex');
    menuBtn.setAttribute('aria-expanded', isClosed);
    menuBtn.classList.toggle('active');
  });

  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      mobileMenu.classList.remove('flex');
      menuBtn?.classList.remove('active');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });
});
