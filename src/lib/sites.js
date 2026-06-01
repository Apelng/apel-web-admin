import { Building2, TrendingUp, ClipboardList, BarChart3, ShieldCheck } from 'lucide-react'

export const SITES = [
  {
    id:       'apel-group',
    name:     'Apel Group',
    domain:   'apel.com.ng',
    Icon:     Building2,
    iconBg:   'bg-brand-50',
    iconText: 'text-brand-600',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:       'wealth',
    name:     'Apel Wealth',
    domain:   'wealth.apel.com.ng',
    Icon:     TrendingUp,
    iconBg:   'bg-emerald-50',
    iconText: 'text-emerald-600' ,
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:       'registrars',
    name:     'Apel Registrars',
    domain:   'registrars.apel.com.ng',
    Icon:     ClipboardList,
    iconBg:   'bg-violet-50',
    iconText: 'text-violet-600',
    features: ['blog', 'pages', 'team'],
  },
  {
    id:       'asset',
    name:     'Apel Asset',
    domain:   'asset.apel.com.ng',
    Icon:     BarChart3,
    iconBg:   'bg-amber-50',
    iconText: 'text-amber-600',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
  {
    id:       'trust',
    name:     'Apel Trust',
    domain:   'trust.apel.com.ng',
    Icon:     ShieldCheck,
    iconBg:   'bg-rose-50',
    iconText: 'text-rose-600',
    features: ['blog', 'gallery', 'pages', 'team'],
  },
]

export function getSite(id) {
  return SITES.find(s => s.id === id)
}
