import {
  collection, doc, addDoc, setDoc, updateDoc, deleteDoc,
  getDocs, getDoc, query, orderBy, where, serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'

// ─── helpers ────────────────────────────────────────────────────────────────

const siteCol  = (siteId, col) => collection(db, 'sites', siteId, col)
const siteDoc  = (siteId, col, id) => doc(db, 'sites', siteId, col, id)

function snap(d) {
  return d.exists() ? { id: d.id, ...d.data() } : null
}
function snaps(qs) {
  return qs.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ─── gallery ────────────────────────────────────────────────────────────────

export async function getGallery(siteId) {
  const q = query(siteCol(siteId, 'gallery'), orderBy('order', 'asc'))
  return snaps(await getDocs(q))
}

export async function addGalleryImage(siteId, data) {
  return addDoc(siteCol(siteId, 'gallery'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateGalleryImage(siteId, imageId, data) {
  return updateDoc(siteDoc(siteId, 'gallery', imageId), data)
}

export async function deleteGalleryImage(siteId, imageId) {
  return deleteDoc(siteDoc(siteId, 'gallery', imageId))
}

export async function deleteGalleryImages(siteId, imageIds) {
  const batch = writeBatch(db)
  imageIds.forEach(id => batch.delete(siteDoc(siteId, 'gallery', id)))
  return batch.commit()
}

export async function renameCategoryImages(siteId, oldName, newName) {
  const q    = query(siteCol(siteId, 'gallery'), where('category', '==', oldName))
  const snap = await getDocs(q)
  const batch = writeBatch(db)
  snap.docs.forEach(d => batch.update(d.ref, { category: newName }))
  return batch.commit()
}

// ─── blog ────────────────────────────────────────────────────────────────────

export async function getBlogPosts(siteId, statusFilter = null) {
  let q = query(siteCol(siteId, 'blog'), orderBy('createdAt', 'desc'))
  if (statusFilter) {
    q = query(siteCol(siteId, 'blog'), where('status', '==', statusFilter), orderBy('createdAt', 'desc'))
  }
  return snaps(await getDocs(q))
}

export async function getBlogPost(siteId, postId) {
  return snap(await getDoc(siteDoc(siteId, 'blog', postId)))
}

export async function createBlogPost(siteId, data) {
  return addDoc(siteCol(siteId, 'blog'), {
    ...data,
    status: data.status || 'draft',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateBlogPost(siteId, postId, data) {
  return updateDoc(siteDoc(siteId, 'blog', postId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteBlogPost(siteId, postId) {
  return deleteDoc(siteDoc(siteId, 'blog', postId))
}

// ─── pages ───────────────────────────────────────────────────────────────────

export async function getPages(siteId) {
  return snaps(await getDocs(siteCol(siteId, 'pages')))
}

export async function getPage(siteId, pageId) {
  return snap(await getDoc(siteDoc(siteId, 'pages', pageId)))
}

export async function savePage(siteId, pageId, data) {
  return setDoc(siteDoc(siteId, 'pages', pageId), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

// ─── team ────────────────────────────────────────────────────────────────────

export async function getTeam(siteId) {
  const q = query(siteCol(siteId, 'team'), orderBy('order', 'asc'))
  return snaps(await getDocs(q))
}

export async function addTeamMember(siteId, data) {
  return addDoc(siteCol(siteId, 'team'), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateTeamMember(siteId, memberId, data) {
  return updateDoc(siteDoc(siteId, 'team', memberId), data)
}

export async function deleteTeamMember(siteId, memberId) {
  return deleteDoc(siteDoc(siteId, 'team', memberId))
}

// ─── popups ───────────────────────────────────────────────────────────────────

export async function getPopups(siteId) {
  const q = query(siteCol(siteId, 'popups'), orderBy('createdAt', 'desc'))
  return snaps(await getDocs(q))
}

export async function addPopup(siteId, data) {
  return addDoc(siteCol(siteId, 'popups'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updatePopup(siteId, popupId, data) {
  return updateDoc(siteDoc(siteId, 'popups', popupId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deletePopup(siteId, popupId) {
  return deleteDoc(siteDoc(siteId, 'popups', popupId))
}

// Only one popup should be active at a time — deactivate all others in a batch
export async function setActivePopup(siteId, activeId) {
  const all   = await getPopups(siteId)
  const batch = writeBatch(db)
  all.forEach(p => {
    batch.update(siteDoc(siteId, 'popups', p.id), { active: p.id === activeId })
  })
  return batch.commit()
}
