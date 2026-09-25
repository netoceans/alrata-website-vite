'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { contact } from '@/data/clinic'
import type { NavigationItem } from '@/data/navigation'
import Logo from '@/components/layout/Logo'

export default function Header({ items }: { items: readonly NavigationItem[] }) {
  const [open, setOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)
  const mobileMenu = useRef<HTMLDivElement>(null)
  const desktopServicesToggle = useRef<HTMLButtonElement>(null)
  const mobileServicesToggle = useRef<HTMLButtonElement>(null)
  const desktopServicesSubmenu = useRef<HTMLUListElement>(null)
  const mobileServicesSubmenu = useRef<HTMLUListElement>(null)

  const closeNavigation = () => {
    setOpen(false)
    setServicesOpen(false)
  }

  const focusFirstService = (variant: 'desktop' | 'mobile') => {
    window.requestAnimationFrame(() => {
      const submenu = variant === 'desktop' ? desktopServicesSubmenu.current : mobileServicesSubmenu.current
      if (submenu && !submenu.hidden) submenu.querySelector<HTMLAnchorElement>('a')?.focus()
    })
  }

  const handleServicesToggleKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, variant: 'desktop' | 'mobile') => {
    if (event.key !== 'ArrowDown') return
    event.preventDefault()
    setServicesOpen(true)
    focusFirstService(variant)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    let focusFrame = 0
    const focusMenu = () => {
      const menu = mobileMenu.current
      if (!menu) return
      // Visibility transitions can still be hidden on the first animation frame.
      if (getComputedStyle(menu).visibility === 'visible') menu.querySelector<HTMLAnchorElement>('a')?.focus()
      else focusFrame = requestAnimationFrame(focusMenu)
    }
    focusFrame = requestAnimationFrame(focusMenu)
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        const links = mobileMenu.current?.querySelectorAll<HTMLAnchorElement>('a[href]')
        const first = links?.[0]
        const last = links?.[links.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); menuButton.current?.focus()
        } else if (event.shiftKey && document.activeElement === menuButton.current) {
          event.preventDefault(); last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); menuButton.current?.focus()
        }
      }
    }
    const desktop = window.matchMedia('(min-width: 1081px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    desktop.addEventListener('change', closeOnDesktop)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      cancelAnimationFrame(focusFrame)
      window.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (servicesOpen) {
        event.preventDefault()
        setServicesOpen(false)
        const isDesktop = window.matchMedia('(min-width: 1081px)').matches
        ;(isDesktop ? desktopServicesToggle.current : mobileServicesToggle.current)?.focus()
        return
      }
      if (open) {
        setOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [open, servicesOpen])

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1081px)')
    const closeServicesOnBreakpoint = () => setServicesOpen(false)
    desktop.addEventListener('change', closeServicesOnBreakpoint)
    return () => desktop.removeEventListener('change', closeServicesOnBreakpoint)
  }, [])

  const renderNavigationItem = (item: NavigationItem, variant: 'desktop' | 'mobile') => {
    if (!item.children?.length) {
      return <a key={item.href} href={item.href} onClick={closeNavigation}>{item.label}</a>
    }

    const isDesktop = variant === 'desktop'
    const submenuId = `${variant}-services-submenu`
    const toggleRef = isDesktop ? desktopServicesToggle : mobileServicesToggle
    const submenuRef = isDesktop ? desktopServicesSubmenu : mobileServicesSubmenu

    return (
      <div
        key={item.href}
        className={`nav-dropdown nav-dropdown--${variant} ${servicesOpen ? 'nav-dropdown--open' : ''}`}
        onPointerEnter={isDesktop ? () => setServicesOpen(true) : undefined}
        onPointerLeave={isDesktop ? () => {
          const activeElement = document.activeElement
          if (activeElement !== desktopServicesToggle.current && !desktopServicesSubmenu.current?.contains(activeElement)) {
            setServicesOpen(false)
          }
        } : undefined}
        onFocusCapture={isDesktop ? (event) => {
          if (!(event.target instanceof HTMLButtonElement && event.target === desktopServicesToggle.current)) setServicesOpen(true)
        } : undefined}
        onBlurCapture={isDesktop ? (event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setServicesOpen(false)
        } : undefined}
      >
        <div className="nav-dropdown__trigger">
          <a href={item.href} onClick={closeNavigation}>{item.label}</a>
          <button
            ref={toggleRef}
            className="nav-dropdown__toggle"
            type="button"
            aria-label={`${servicesOpen ? 'Close' : 'Open'} ${item.label} submenu`}
            aria-haspopup="true"
            aria-expanded={servicesOpen}
            aria-controls={submenuId}
            onClick={() => setServicesOpen((value) => !value)}
            onKeyDown={(event) => handleServicesToggleKeyDown(event, variant)}
          >
            <ChevronDown size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="nav-dropdown__menu-shell" onPointerEnter={isDesktop ? () => setServicesOpen(true) : undefined}>
          <ul ref={submenuRef} id={submenuId} className="nav-dropdown__menu" hidden={!servicesOpen}>
            {item.children.map((child) => (
              <li key={child.href}>
                <a href={child.href} onClick={closeNavigation}>{child.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
      <div className="site-container header-inner">
        <Logo inverse={!scrolled} />
        <nav className="desktop-nav" aria-label="Primary navigation">
          {items.map((item) => renderNavigationItem(item, 'desktop'))}
        </nav>
        <a className="button button--primary header-book" href={contact.bookingHref}>
          Book appointment
        </a>
        <button
          ref={menuButton}
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => {
            setOpen((value) => !value)
            setServicesOpen(false)
          }}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      <div ref={mobileMenu} id="mobile-menu" inert={!open} className={`mobile-menu ${open ? 'mobile-menu--open' : ''}`}>
        <nav aria-label="Mobile navigation">
          {items.map((item) => renderNavigationItem(item, 'mobile'))}
        </nav>
        <a className="button button--primary" href={contact.bookingHref} onClick={closeNavigation}>Book appointment</a>
        <a className="mobile-call" href={contact.phoneHref} onClick={closeNavigation}><Phone size={18} /> {contact.phoneDisplay}</a>
      </div>
    </header>
  )
}
