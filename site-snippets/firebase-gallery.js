/**
 * Drop this into any Apel website's gallery page (before </body>)
 * Add data-gallery-grid to the container element where images should appear.
 * Replace SITE_ID and firebaseConfig below.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import { getFirestore, collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'

const SITE_ID = 'wealth' // <-- change per site

const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

async function loadGallery() {
  const container = document.querySelector('[data-gallery-grid]')
  if (!container) return

  const q      = query(collection(db, 'sites', SITE_ID, 'gallery'), orderBy('order', 'asc'))
  const snap   = await getDocs(q)
  const images = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  container.innerHTML = images.map(img => `
    <figure class="gallery-item">
      <img
        src="${img.url}"
        alt="${img.title || ''}"
        loading="lazy"
        style="width:100%;height:240px;object-fit:cover;border-radius:8px"
      />
      ${img.title ? `<figcaption>${img.title}</figcaption>` : ''}
    </figure>
  `).join('')
}

loadGallery()
