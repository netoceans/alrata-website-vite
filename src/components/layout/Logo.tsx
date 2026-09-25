import Image from 'next/image'
import Link from 'next/link'
export default function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/#home" className="logo" aria-label="Alrata Art of Dentistry home">
      <Image
        src="https://alratadental.com/wp-content/uploads/2024/08/logo-svg.svg"
        alt="Alrata Art of Dentistry"
        width={228}
        height={78}
        data-inverse-context={inverse || undefined}
      />
    </Link>
  )
}
