import Link from 'next/link'

export default function HeroBreadcrumbs({ currentPage }: { currentPage: string }) {
  return (
    <nav className='hero-breadcrumbs' aria-label='Breadcrumb'>
      <ol>
        <li><Link href='/'>Home</Link></li>
        <li>
          <span aria-hidden='true'>/</span>
          <span aria-current='page'>{currentPage}</span>
        </li>
      </ol>
    </nav>
  )
}
