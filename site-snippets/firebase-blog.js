/**
 * Drop this into any Apel website's blog.html (before </body>)
 * Replace SITE_ID with: apel-group | wealth | registrars | asset | trust
 * Replace the firebaseConfig values with your actual Firebase project config.
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js'
import {
  getFirestore, collection, getDocs, query, where, orderBy
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js'

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

// ─── Render Blog Posts ────────────────────────────────────────────────────────

async function loadBlogPosts() {
  const container = document.querySelector('[data-blog-list]')
  if (!container) return

  const q     = query(
    collection(db, 'sites', SITE_ID, 'blog'),
    where('status', '==', 'published'),
    orderBy('publishedAt', 'desc')
  )
  const snap  = await getDocs(q)
  const posts = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  container.innerHTML = posts.map(post => `
    <article class="blog-card" data-post-id="${post.id}">
      ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy">` : ''}
      <div class="blog-card__body">
        <h3>${post.title}</h3>
        <p>${post.excerpt || ''}</p>
        <a href="/blog-post.html?id=${post.id}">Read more &rarr;</a>
      </div>
    </article>
  `).join('')
}

// ─── Render Single Blog Post ─────────────────────────────────────────────────

async function loadBlogPost() {
  const container = document.querySelector('[data-blog-post]')
  if (!container) return

  const id   = new URLSearchParams(location.search).get('id')
  if (!id) return

  const { getDoc, doc } = await import('https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js')
  const snap = await getDoc(doc(db, 'sites', SITE_ID, 'blog', id))
  if (!snap.exists()) { container.innerHTML = '<p>Post not found.</p>'; return }

  const post = snap.data()
  document.title = `${post.title} | Blog`

  container.innerHTML = `
    <h1>${post.title}</h1>
    ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" style="width:100%;border-radius:8px;margin-bottom:24px">` : ''}
    <div class="blog-content">${post.content}</div>
  `
}

loadBlogPosts()
loadBlogPost()
