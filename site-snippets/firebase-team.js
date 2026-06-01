/**
 * Drop this into any Apel website's about/team page (before </body>)
 * Add data-team-grid to the container element.
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

async function loadTeam() {
  const container = document.querySelector('[data-team-grid]')
  if (!container) return

  const q       = query(collection(db, 'sites', SITE_ID, 'team'), orderBy('order', 'asc'))
  const snap    = await getDocs(q)
  const members = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  container.innerHTML = members.map(m => `
    <div class="team-card">
      ${m.photo ? `<img src="${m.photo}" alt="${m.name}" style="width:100px;height:100px;border-radius:50%;object-fit:cover">` : ''}
      <h4>${m.name}</h4>
      <p class="team-role">${m.role}</p>
      ${m.bio ? `<p class="team-bio">${m.bio}</p>` : ''}
    </div>
  `).join('')
}

loadTeam()
