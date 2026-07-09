const ACTIVE_SWATCH_CLASS = 'is-swatch-active'
const LOADING_CLASS = 'is-btn-loading'
const ERROR_VISIBLE_CLASS = 'is-error-visible'
const CART_URL = '/cart'

const changeMainImage = (imageSrc, mainImageEl) => {
  if (!mainImageEl || !imageSrc) return
  mainImageEl.src = imageSrc
}

const activateSwatch = (swatchEl) => {
  if (!swatchEl) return
  swatchEl.classList.add(ACTIVE_SWATCH_CLASS)
}

const deactivateAllSwatches = (swatchEls) => {
  if (!swatchEls.length) return
  swatchEls.forEach((swatchEl) => {
    swatchEl.classList.remove(ACTIVE_SWATCH_CLASS)
  })
}

const updateColorName = (colorNameEl, colorName) => {
  if (!colorNameEl || !colorName) return
  colorNameEl.textContent = colorName
}

const updateVariantId = (variantIdEl, variantId) => {
  if (!variantIdEl || !variantId) return
  variantIdEl.value = variantId
}

const showError = (errorEl, message) => {
  if (!errorEl) return
  errorEl.textContent = message
  errorEl.classList.add(ERROR_VISIBLE_CLASS)
}

const hideError = (errorEl) => {
  if (!errorEl) return
  errorEl.classList.remove(ERROR_VISIBLE_CLASS)
}

const setLoadingState = (btnEl, isLoading) => {
  if (!btnEl) return
  if (isLoading) {
    btnEl.classList.add(LOADING_CLASS)
    btnEl.setAttribute('disabled', 'disabled')
  } else {
    btnEl.classList.remove(LOADING_CLASS)
    btnEl.removeAttribute('disabled')
  }
}

const redirectToCart = () => {
  window.location = CART_URL
}

const submitCartForm = (variantId, addToCartBtnEl, errorEl) => {
  if (!variantId) return

  hideError(errorEl)
  setLoadingState(addToCartBtnEl, true)

  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ id: parseInt(variantId), quantity: 1 })
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        showError(errorEl, data.description || 'Có lỗi xảy ra, vui lòng thử lại.')
        setLoadingState(addToCartBtnEl, false)
        return
      }
      redirectToCart()
    })
    .catch(() => {
      showError(errorEl, 'Có lỗi xảy ra, vui lòng thử lại.')
      setLoadingState(addToCartBtnEl, false)
    })
}

const initAddToCart = (el) => {
  const productFormEl = el.querySelector('.js-product-form')
  const addToCartBtnEl = el.querySelector('.js-add-to-cart')
  const variantIdEl = el.querySelector('.js-variant-id')
  const errorEl = el.querySelector('.js-error-message')

  if (!productFormEl) return

  productFormEl.addEventListener('submit', (e) => {
    e.preventDefault()
    const variantId = variantIdEl ? variantIdEl.value : null
    submitCartForm(variantId, addToCartBtnEl, errorEl)
  })
}

const initColorSwatches = (el) => {
  const colorSwatches = Array.prototype.slice.call(el.querySelectorAll('.js-color-swatch'))
  const colorNameEl = el.querySelector('.js-color-name')
  const variantIdEl = el.querySelector('.js-variant-id')
  const mainImageEl = el.querySelector('.js-main-image')

  if (!colorSwatches.length) return
  colorSwatches.forEach((colorSwatch) => {
    colorSwatch.addEventListener('click', () => {
      const imageSrc = colorSwatch.dataset.imageSrc
      const colorName = colorSwatch.dataset.colorName
      const variantId = colorSwatch.dataset.variantId

      deactivateAllSwatches(colorSwatches)
      activateSwatch(colorSwatch)
      updateColorName(colorNameEl, colorName)
      updateVariantId(variantIdEl, variantId)
      changeMainImage(imageSrc, mainImageEl)
    })
  })
}

const createSwiper = (swiperEl) => {
  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    pagination: {
      el: swiperEl.querySelector('.swiper-pagination'),
      type: 'progressbar',
    },
    breakpoints: {
      768: {
        enabled: false
      }
    }
  })
}

const initSwiper = (el) => {
  const swiperEl = el.querySelector('.js-product-swiper')
  if (!swiperEl) return
  if (typeof Swiper === 'undefined') return
  createSwiper(swiperEl)
}

document.addEventListener('DOMContentLoaded', () => {
  const productEl = document.querySelector('.js-product-main-new')
  if (!productEl) return

  initColorSwatches(productEl)
  initAddToCart(productEl)
  initSwiper(productEl)
})
