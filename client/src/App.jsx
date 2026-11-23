
import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import {
  Menu,
  X,
  Search,
  MapPin,
  ArrowUpRight,
  Trees,
  Home,
  Building2,
  MessageCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  SlidersHorizontal,
  ShieldCheck,
  Compass,
  Leaf,
  Phone,
  Mail,
  CheckCircle2
} from 'lucide-react'

// ========================================
// BRAND CONFIGURATION
// ========================================

const WHATSAPP_NUMBER = '919663596415'

// Demonstration property listings.
// Replace these with verified property details before publishing.

const properties = [
  {
    id: 1,
    title: 'The Green Valley Estate',
    location: 'Madikeri, Coorg',
    type: 'Coffee Estates',
    area: '5 Acres',
    price: 'Price on Request',
    featured: true,
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=85',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=85'
    ],
    description: 'Discover a beautiful green estate opportunity surrounded by the natural landscapes of Coorg.',
    features: ['Green surroundings', 'Estate property', 'Site visit by appointment']
  },
  {
    id: 2,
    title: 'Scenic Agricultural Land',
    location: 'Virajpet, Coorg',
    type: 'Land & Plots',
    area: '2 Acres',
    price: 'Price on Request',
    featured: false,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85',
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1200&q=85'
    ],
    description: 'Explore an agricultural land opportunity in the beautiful surroundings of Virajpet.',
    features: ['Agricultural land', 'Natural surroundings', 'Site visit by appointment']
  },
  {
    id: 3,
    title: 'Contemporary Nature Villa',
    location: 'Kushalnagar, Coorg',
    type: 'Villas & Homes',
    area: '3,000 Sq. Ft.',
    price: 'Price on Request',
    featured: true,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=85',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=85'
    ],
    description: 'Explore this contemporary residential property in a peaceful natural setting.',
    features: ['Residential property', 'Modern architecture', 'Site visit by appointment']
  },
  {
    id: 4,
    title: 'The Plantation Retreat',
    location: 'Siddapur, Coorg',
    type: 'Coffee Estates',
    area: '8 Acres',
    price: 'Price on Request',
    featured: false,
    image: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=85',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85'
    ],
    description: 'A scenic estate opportunity surrounded by greenery and the natural charm of Coorg.',
    features: ['Coffee estate opportunity', 'Green landscape', 'Site visit by appointment']
  },
  {
    id: 5,
    title: 'Residential Land Opportunity',
    location: 'Gonikoppal, Coorg',
    type: 'Land & Plots',
    area: '30 Guntas',
    price: 'Price on Request',
    featured: false,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=85'
    ],
    description: 'Explore a residential land opportunity in the Gonikoppal area.',
    features: ['Residential land', 'Location assistance', 'Site visit by appointment']
  },
  {
    id: 6,
    title: 'Modern Hillside Home',
    location: 'Madikeri, Coorg',
    type: 'Villas & Homes',
    area: '2,500 Sq. Ft.',
    price: 'Price on Request',
    featured: false,
    image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=85',
    gallery: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=85'
    ],
    description: 'A contemporary home opportunity for buyers looking to explore residential properties.',
    features: ['Residential property', 'Modern design', 'Site visit by appointment']
  }
]

const categories = [
  { name: 'All Properties', icon: Building2 },
  { name: 'Land & Plots', icon: Trees },
  { name: 'Coffee Estates', icon: Leaf },
  { name: 'Villas & Homes', icon: Home }
]

// ========================================
// WHATSAPP COMPONENT
// ========================================

function WhatsAppLink({ property, children, className = '' }) {
  const message = property
    ? `Hello Coffee Landfinders!\n\nI am interested in ${property.title}.\nLocation: ${property.location}\nArea: ${property.area}\n\nPlease share more details and arrange a site visit.`
    : 'Hello Coffee Landfinders! I would like to explore properties in Coorg. Please assist me.'

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}

// ========================================
// NAVIGATION
// ========================================

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    ['Home', '#home'],
    ['About', '#about'],
    ['Properties', '#properties'],
    ['Services', '#services'],
    ['Contact', '#contact']
  ]

  return (
    <header className="navbar">
      <div className="nav-inner">

        <a href="#home" className="brand">
          <div className="brand-mark">CL</div>

          <div>
            <div className="brand-name">COFFEE LANDFINDERS</div>
            <div className="brand-subtitle">PROPERTY CONSULTANTS · COORG</div>
          </div>
        </a>

        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          {links.map(([name, href]) => (
            <a
              key={name}
              href={href}
              onClick={() => setMenuOpen(false)}
            >
              {name}
            </a>
          ))}

          <a
            href="#contact"
            className="nav-cta"
            onClick={() => setMenuOpen(false)}
          >
            Enquire Now <ArrowUpRight size={15} />
          </a>
        </nav>

        <button
          className="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </div>
    </header>
  )
}

// ========================================
// HERO SECTION
// ========================================

function Hero() {
  const slides = [
    {
      image: '/01-brand-introduction.png',
      alt: 'Coffee Landfinders premium property consultancy in Coorg'
    },
    {
      image: '/02-premium-properties-coorg.png',
      alt: 'Premium properties in Coorg'
    },
    {
      image: '/03-coffee-estates-homestays.png',
      alt: 'Coffee estates and homestays in Coorg'
    },
    {
      image: '/04-farms-and-plots.png',
      alt: 'Farms and plots in Coorg'
    }
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  // Keep the slideshow running automatically, including while the pointer is over it.
  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide(current => (current + 1) % slides.length)
    }, 5000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const showPrevious = () => {
    setActiveSlide(current => (current - 1 + slides.length) % slides.length)
  }

  const showNext = () => {
    setActiveSlide(current => (current + 1) % slides.length)
  }

  return (
    <section
      className="hero hero-slideshow"
      id="home"
      aria-label="Coffee Landfinders featured property banners"
    >
      <div className="hero-background">
        {slides.map((slide, index) => (
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            className={`hero-slide-image ${index === activeSlide ? 'is-active' : ''}`}
            fetchPriority={index === 0 ? 'high' : 'auto'}
            loading={index === 0 ? 'eager' : 'lazy'}
            aria-hidden={index !== activeSlide}
          />
        ))}
      </div>

      <a
        className="hero-instagram-badge"
        href="https://www.instagram.com/coffee_land_finders12/"
        target="_blank"
        rel="noreferrer"
        aria-label="Visit Coffee Landfinders on Instagram"
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1" fill="currentColor" />
        </svg>
        <span>@coffee_land_finders12</span>
        <ArrowUpRight size={14} />
      </a>

      <div className="hero-slideshow-controls">
        <button
          type="button"
          className="hero-slide-arrow"
          onClick={showPrevious}
          aria-label="Previous banner"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="hero-slide-dots" aria-label="Choose banner">
          {slides.map((slide, index) => (
            <button
              key={slide.image}
              type="button"
              className={`hero-slide-dot ${index === activeSlide ? 'is-active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Show banner ${index + 1}`}
              aria-current={index === activeSlide ? 'true' : undefined}
            />
          ))}
        </div>

        <button
          type="button"
          className="hero-slide-arrow"
          onClick={showNext}
          aria-label="Next banner"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  )
}

// ========================================
// PROPERTY SEARCH
// ========================================

function PropertySearch({
  search,
  setSearch,
  category,
  setCategory
}) {
  return (
    <section className="search-section">
      <div className="search-panel container">

        <div className="search-input-group">
          <label>LOCATION</label>

          <div className="search-input">
            <MapPin size={18} />

            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Where would you like to buy?"
            />
          </div>
        </div>

        <div className="search-input-group">
          <label>PROPERTY TYPE</label>

          <div className="search-input">
            <SlidersHorizontal size={18} />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              {categories.map(item => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <a href="#properties" className="search-button">
          <Search size={18} />
          Find Properties
        </a>

      </div>
    </section>
  )
}

// ========================================
// PROPERTY CARD
// ========================================

function PropertyCard({ property, onView }) {
  return (
    <article className="property-card">

      <button
        className="property-photo"
        onClick={() => onView(property)}
        aria-label={`View ${property.title}`}
      >
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
        />

        <span className="property-type-tag">
          {property.type}
        </span>

        {property.featured && (
          <span className="featured-tag">
            FEATURED
          </span>
        )}

        <span className="photo-arrow">
          <ArrowUpRight size={20} />
        </span>
      </button>

      <div className="property-card-content">

        <div className="property-location">
          <MapPin size={14} />
          {property.location}
        </div>

        <h3>{property.title}</h3>

        <div className="property-specs">
          <span>
            <Maximize2 size={14} />
            {property.area}
          </span>

          <span>{property.type}</span>
        </div>

        <div className="property-card-footer">
          <div>
            <small>PRICE</small>
            <strong>{property.price}</strong>
          </div>

          <button
            className="view-property"
            onClick={() => onView(property)}
          >
            View Details <ArrowUpRight size={16} />
          </button>
        </div>

      </div>
    </article>
  )
}

// ========================================
// PROPERTY LISTINGS
// ========================================

function Properties({
  properties = [],
  search,
  setSearch,
  category,
  setCategory,
  onView
}) {
  const filtered = useMemo(() => {
    return properties.filter(property => {

      const matchesSearch =
        `${property.title} ${property.location}`
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesCategory =
        category === 'All Properties' ||
        property.type === category

      return matchesSearch && matchesCategory
    })
  }, [properties, search, category])

  return (
    <section id="properties" className="properties-section">

      <div className="container">

        <div className="section-heading">

          <div>
            <span className="section-kicker">
              01 / PROPERTY COLLECTION
            </span>

            <h2>
              Discover places
              <br />
              <em>worth calling yours.</em>
            </h2>
          </div>

          <p>
            From beautiful coffee estates to residential land,
            explore property opportunities across Coorg.
          </p>

        </div>

        <div className="category-tabs">

          {categories.map(item => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={
                  category === item.name ? 'category-active' : ''
                }
                onClick={() => setCategory(item.name)}
              >
                <Icon size={16} />
                {item.name}
              </button>
            )
          })}

        </div>

        <div className="property-results-heading">

          <div>
            <h3>Explore Properties</h3>
            <span>Opportunities in and around Coorg</span>
          </div>

          <span className="results-count">
            {filtered.length} LISTINGS
          </span>

        </div>

        <div className="property-grid">

          {filtered.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={onView}
            />
          ))}

        </div>

        {filtered.length === 0 && (
          <div className="no-results">
            <Search size={32} />

            <h3>No matching properties found</h3>

            <p>
              Try another location or property category.
            </p>

            <button
              onClick={() => {
                setSearch('')
                setCategory('All Properties')
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  )
}

// ========================================
// PROPERTY DETAILS MODAL
// ========================================

function PropertyDetails({ property, onClose }) {
  const [activeImage, setActiveImage] = useState(0)

  if (!property) return null

  const gallery = property.gallery?.length
    ? property.gallery
    : [property.image]

  const previousImage = () => {
    setActiveImage(current =>
      (current - 1 + gallery.length) % gallery.length
    )
  }

  const nextImage = () => {
    setActiveImage(current =>
      (current + 1) % gallery.length
    )
  }

  return (
    <div
      className="details-overlay"
      onClick={onClose}
    >
      <div
        className="details-modal"
        role="dialog"
        aria-modal="true"
        aria-label={property.title}
        onClick={e => e.stopPropagation()}
      >

        <button
          className="details-close"
          onClick={onClose}
          aria-label="Close details"
        >
          <X />
        </button>

        <div className="details-gallery">

          <img
            src={gallery[activeImage]}
            alt={property.title}
          />

          {gallery.length > 1 && (
            <>
              <button
                className="gallery-arrow gallery-left"
                onClick={previousImage}
              >
                <ChevronLeft />
              </button>

              <button
                className="gallery-arrow gallery-right"
                onClick={nextImage}
              >
                <ChevronRight />
              </button>

              <div className="gallery-counter">
                {activeImage + 1} / {gallery.length}
              </div>
            </>
          )}

        </div>

        {Array.isArray(property.videos) && property.videos.length > 0 && (
          <section
            className="property-video-section"
            style={{
              padding: '24px',
              background: '#f7f6f0',
              borderBottom: '1px solid #e5e2d8'
            }}
          >
            <span className="section-kicker">
              PROPERTY VIDEO TOUR
            </span>

            <h3 style={{ margin: '12px 0 18px' }}>
              Explore this property
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '18px'
              }}
            >
              {property.videos.map((video, index) => (
                <video
                  key={`${video}-${index}`}
                  src={video}
                  controls
                  playsInline
                  preload="metadata"
                  style={{
                    width: '100%',
                    maxHeight: '320px',
                    borderRadius: '10px',
                    background: '#000',
                    objectFit: 'contain'
                  }}
                >
                  Your browser does not support video playback.
                </video>
              ))}
            </div>
          </section>
        )}

        <div className="details-content">

          <span className="section-kicker">
            PROPERTY INFORMATION
          </span>

          <div className="details-type">
            {property.type}
          </div>

          <h2>{property.title}</h2>

          <p className="property-location">
            <MapPin size={15} />
            {property.location}
          </p>

          <div className="details-specs">

            <div>
              <Maximize2 />
              <span>AREA</span>
              <strong>{property.area}</strong>
            </div>

            <div>
              <Building2 />
              <span>PROPERTY TYPE</span>
              <strong>{property.type}</strong>
            </div>

          </div>

          <h3>About this property</h3>

          <p className="details-description">
            {property.description}
          </p>

          <h3>Property highlights</h3>

          <div className="details-features">
            {property.features.map(feature => (
              <div key={feature}>
                <CheckCircle2 size={16} />
                {feature}
              </div>
            ))}
          </div>

          <div className="details-price">

            <div>
              <small>PROPERTY PRICE</small>
              <strong>{property.price}</strong>
            </div>

            <WhatsAppLink
              property={property}
              className="button button-green"
            >
              <MessageCircle size={17} />
              Enquire Now
            </WhatsAppLink>

          </div>

          <p className="details-disclaimer">
            Property information is subject to verification
            and confirmation. Contact us for current
            availability and documentation details.
          </p>

        </div>
      </div>
    </div>
  )
}

// ========================================
// ABOUT SECTION
// ========================================

function About() {
  return (
    <section id="about" className="about-section">

      <div className="about-image">

        <img
          src="https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1200&q=85"
          alt="Green natural landscape"
          loading="lazy"
        />

        <div className="about-image-label">
          <Leaf size={17} />
          THE BEAUTY OF COORG
        </div>

      </div>

      <div className="about-content">

        <span className="section-kicker">
          02 / OUR STORY
        </span>

        <h2>
          A connection to
          <br />
          land, nature
          <br />
          and <em>opportunity.</em>
        </h2>

        <p>
          Coffee Landfinders is a property consultancy
          focused on helping buyers discover land, coffee
          plantations, estates and residential properties
          in Coorg.
        </p>

        <p>
          Through local property sourcing and personalised
          assistance, we help connect genuine buyers with
          suitable property opportunities.
        </p>

        <a href="#contact" className="underlined-link">
          Get in touch <ArrowUpRight size={17} />
        </a>

      </div>
    </section>
  )
}

// ========================================
// TRUST SECTION
// ========================================

function TrustSection() {
  const items = [
    {
      icon: Compass,
      title: 'Local Knowledge',
      text: 'Explore property opportunities across Coorg.'
    },
    {
      icon: ShieldCheck,
      title: 'Buyer Assistance',
      text: 'Personalised assistance throughout your search.'
    },
    {
      icon: Leaf,
      title: 'Property Discovery',
      text: 'Discover land, plantations and homes.'
    }
  ]

  return (
    <section className="trust-section">

      <div className="container">

        <div className="trust-heading">

          <span className="section-kicker">
            03 / WHY COFFEE LANDFINDERS
          </span>

          <h2>
            Finding the right property
            <br />
            starts with the <em>right connection.</em>
          </h2>

        </div>

        <div className="trust-grid">

          {items.map(item => {
            const Icon = item.icon

            return (
              <div className="trust-card" key={item.title}>

                <Icon size={30} />

                <h3>{item.title}</h3>

                <p>{item.text}</p>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}

// ========================================
// SERVICES
// ========================================

function Services() {
  const services = [
    {
      number: '01',
      icon: Trees,
      title: 'Land & Plot Sourcing',
      description: 'Explore residential, agricultural and investment land opportunities.'
    },
    {
      number: '02',
      icon: Leaf,
      title: 'Coffee Estate Discovery',
      description: 'Discover plantation and estate property opportunities.'
    },
    {
      number: '03',
      icon: Home,
      title: 'Buying & Selling',
      description: 'Assistance connecting genuine buyers and property owners.'
    },
    {
      number: '04',
      icon: MapPin,
      title: 'Site Visit Assistance',
      description: 'Coordinate property visits and explore shortlisted properties.'
    }
  ]

  return (
    <section id="services" className="services-section">

      <div className="container">

        <span className="section-kicker">
          04 / OUR SERVICES
        </span>

        <div className="section-heading">

          <h2>
            Property solutions,
            <br />
            <em>made personal.</em>
          </h2>

          <p>
            From discovering suitable land to coordinating
            site visits, we're here to help you explore.
          </p>

        </div>

        <div className="services-grid">

          {services.map(service => {
            const Icon = service.icon

            return (
              <article className="service-card" key={service.number}>

                <div className="service-top">
                  <span>{service.number}</span>
                  <Icon size={27} />
                </div>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

              </article>
            )
          })}

        </div>

      </div>
    </section>
  )
}

// ========================================
// CONTACT
// ========================================

function Contact() {
  return (
    <section id="contact" className="contact-section">

      <div className="contact-background" />

      <div className="container contact-inner">

        <div className="contact-main">

          <span className="section-kicker">
            05 / LET'S CONNECT
          </span>

          <h2>
            Your next
            <br />
            opportunity could
            <br />
            be in <em>Coorg.</em>
          </h2>

          <p>
            Tell us what you're looking for.
            Let's explore the right property together.
          </p>

          <WhatsAppLink className="button button-gold">
            <MessageCircle size={17} />
            Connect on WhatsApp
            <ArrowUpRight size={16} />
          </WhatsAppLink>

        </div>

        <div className="contact-info">

          <div>
            <span>
              <Phone size={15} />
              PHONE
            </span>

            <a href="tel:+919663596415">
              +91 96635 96415
            </a>
          </div>

          <div>
            <span>
              <Mail size={15} />
              EMAIL
            </span>

            <a href="mailto:coffeelandfinders12@gmail.com">
              coffeelandfinders12@gmail.com
            </a>
          </div>

          <div>
            <span>
              <MapPin size={15} />
              LOCATION
            </span>

            <p>Coorg, Karnataka, India</p>
          </div>

        </div>

      </div>
    </section>
  )
}

// ========================================
// FOOTER
// ========================================

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-main">

          <a href="#home" className="brand footer-brand">

            <div className="brand-mark">CL</div>

            <div>
              <div className="brand-name">
                COFFEE LANDFINDERS
              </div>

              <div className="brand-subtitle">
                PROPERTY CONSULTANTS · COORG
              </div>
            </div>

          </a>

          <p>
            Discover land. Explore possibilities.
            Find your place in Coorg.
          </p>

          <div className="footer-social">

            <a
              href="https://www.instagram.com/coffee_land_finders12/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <MessageCircle size={19} />
            </a>

            <WhatsAppLink
              className="footer-whatsapp"
            >
              <MessageCircle size={19} />
            </WhatsAppLink>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Coffee Landfinders. All rights reserved.
          </span>

          <a href="#home">Back to top ↑</a>

        </div>

      </div>

    </footer>
  )
}

// ========================================
// MAIN APPLICATION
// ========================================

function HomePage() {

const [search, setSearch] = useState('')
const [category, setCategory] = useState('All Properties')
const [selectedProperty, setSelectedProperty] = useState(null)
const [properties, setProperties] = useState([])

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await fetch(
        'https://coffee-landfinders-api.onrender.com/api/properties'
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to load properties')
      }

      const formattedProperties = (data.properties || []).map(property => ({
        ...property,
        id: property._id,
        image: property.images?.[0] ||
          'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85',
        gallery: property.images?.length
          ? property.images
          : ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200&q=85']
      }))

      setProperties(formattedProperties)
    } catch (error) {
      console.error('Property loading error:', error)
    }
  }

  fetchProperties()
}, [])
  return (
    <>
      <Navbar />

      <main>

        <Hero />

        <PropertySearch
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
        />

        <Properties
          properties={properties}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          onView={setSelectedProperty}
        />

        <About />

        <TrustSection />

        <Services />

        <Contact />

      </main>

      <Footer />

      {selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

    </>
  )
}


// ========================================
// ADMIN DASHBOARD PLACEHOLDER
// ========================================

function AdminDashboardPlaceholder() {
  const token = localStorage.getItem('adminToken')

  if (!token) {
    return <Navigate to="/admin" replace />
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminInfo')
    window.location.href = '/admin'
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>Coffee Landfinders Admin</h1>
      <p>Welcome to your admin portal!</p>
      <p>Your admin login is successful.</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// ========================================
// APPLICATION ROUTES
// ========================================

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
