export const SITES = [
  {
    id:     'apel-group',
    name:   'Apel Group',
    domain: 'apel.com.ng',
    color:  'bg-blue-600',
    icon:   '🏛️',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:     'wealth',
    name:   'Apel Wealth',
    domain: 'wealth.apel.com.ng',
    color:  'bg-emerald-600',
    icon:   '💹',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:     'registrars',
    name:   'Apel Registrars',
    domain: 'registrars.apel.com.ng',
    color:  'bg-purple-600',
    icon:   '📋',
    features: ['blog', 'pages', 'team'],
  },
  {
    id:     'asset',
    name:   'Apel Asset',
    domain: 'asset.apel.com.ng',
    color:  'bg-orange-600',
    icon:   '📈',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:     'trust',
    name:   'Apel Trust',
    domain: 'trust.apel.com.ng',
    color:  'bg-rose-600',
    icon:   '🔐',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
]

export function getSite(id) {
  return SITES.find(s => s.id === id)
}
