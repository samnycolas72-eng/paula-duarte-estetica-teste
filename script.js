const config = window.SITE_CONFIG

function encodeMessage(message) {
  return encodeURIComponent(message.trim())
}

function whatsappLink(message) {
  return `https://wa.me/${config.WHATSAPP}?text=${encodeMessage(message)}`
}

function setBackgroundImage(element, imageUrl) {
  if (!imageUrl) return
  const overlay = element.classList.contains('photo-main')
    ? ''
    : 'linear-gradient(135deg, rgba(23,60,49,.28), rgba(185,146,82,.12)), '
  element.style.backgroundImage = `${overlay}url('${imageUrl}')`
  element.classList.add('has-image')
}

function setupMenu() {
  const button = document.querySelector('.menu-toggle')
  const menu = document.querySelector('#site-menu')
  if (!button || !menu) return

  button.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open')
    document.body.classList.toggle('menu-open', isOpen)
    button.setAttribute('aria-expanded', String(isOpen))
  })

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('open')
      document.body.classList.remove('menu-open')
      button.setAttribute('aria-expanded', 'false')
    })
  })
}

function setupWhatsAppLinks() {
  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    const message = link.getAttribute('data-whatsapp')
    link.setAttribute('href', whatsappLink(message))
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })
}

function renderServices() {
  const grid = document.querySelector('#services-grid')
  const serviceSelect = document.querySelector('#service')
  if (!grid || !serviceSelect) return

  grid.innerHTML = ''

  config.services.forEach((service) => {
    const card = document.createElement('article')
    card.className = 'service-card reveal'

    const media = document.createElement('div')
    media.className = 'service-media'
    media.innerHTML = '<span>Imagem editável</span>'
    setBackgroundImage(media, service.image)

    const title = document.createElement('h3')
    title.textContent = service.name

    const description = document.createElement('p')
    description.textContent = service.description

    const price = document.createElement('div')
    price.className = 'price-note'
    price.textContent = service.price || 'Preço sob consulta'

    const button = document.createElement('a')
    button.className = 'btn btn-outline'
    button.textContent = 'Quero saber mais'
    button.href = whatsappLink(service.whatsappMessage)
    button.target = '_blank'
    button.rel = 'noopener noreferrer'
    button.setAttribute('aria-label', `Quero saber mais sobre ${service.name}`)

    card.append(media, title, description, price, button)
    grid.appendChild(card)

    const option = document.createElement('option')
    option.value = service.name
    option.textContent = service.name
    serviceSelect.appendChild(option)
  })
}

function renderImages() {
  const hero = document.querySelector('.photo-main')
  const about = document.querySelector('.portrait')
  if (hero) setBackgroundImage(hero, config.images.hero)
  if (about) setBackgroundImage(about, config.images.about)

  const gallery = document.querySelector('#space-gallery')
  if (!gallery || !config.images.gallery?.length) return

  gallery.innerHTML = ''
  config.images.gallery.forEach((image, index) => {
    const item = document.createElement('div')
    item.className = 'gallery-item'
    item.style.backgroundImage = `url('${image}')`
    item.setAttribute('role', 'img')
    item.setAttribute('aria-label', `Foto real do espaço Paula Duarte Estética ${index + 1}`)
    gallery.appendChild(item)
  })
}

function setupBookingForm() {
  const form = document.querySelector('#booking-form')
  if (!form) return

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const data = new FormData(form)
    const name = data.get('name')
    const phone = data.get('phone')
    const service = data.get('service')
    const day = data.get('day')
    const period = data.get('period')
    const message = data.get('message')

    const whatsappMessage = `Olá, Paula! Vi seu site e gostaria de solicitar um agendamento.\n\nNome: ${name}\nWhatsApp: ${phone}\nServiço de interesse: ${service}\nPreferência de dia: ${day}\nPeríodo: ${period}\nMensagem: ${message || 'Não informada'}\n\nEntendo que a data e o horário serão confirmados pela equipe.`

    window.open(whatsappLink(whatsappMessage), '_blank', 'noopener,noreferrer')
  })
}

function setupContactInfo() {
  const route = document.querySelector('#route-link')
  const instagramLinks = document.querySelectorAll('[data-instagram-link]')
  const hours = document.querySelector('#opening-hours')

  if (route) {
    route.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.mapsQuery)}`
  }
  instagramLinks.forEach((instagram) => {
    instagram.href = config.instagram
  })
  if (hours) {
    hours.textContent = config.openingHours
  }
}

function setupRevealAnimations() {
  const elements = document.querySelectorAll('.reveal')
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'))
    return
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.12 })

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${Math.min(index * 70, 420)}ms`)
    observer.observe(element)
  })
}

function setupHeaderScroll() {
  const header = document.querySelector('.site-header')
  if (!header) return

  const syncHeader = () => {
    header.classList.toggle('scrolled', window.scrollY > 24)
  }

  syncHeader()
  window.addEventListener('scroll', syncHeader, { passive: true })
}

setupMenu()
renderServices()
renderImages()
setupWhatsAppLinks()
setupBookingForm()
setupContactInfo()
setupHeaderScroll()
setupRevealAnimations()
