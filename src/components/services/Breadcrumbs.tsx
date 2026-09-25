import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Breadcrumbs({ treatment }: { treatment?: string }) {
  return (
    <nav className="care-breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        <li><ChevronRight size={13} aria-hidden="true" />{treatment ? <Link href="/services">Services</Link> : <span aria-current="page">Services</span>}</li>
        {treatment && <li><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">{treatment}</span></li>}
      </ol>
    </nav>
  )
}
