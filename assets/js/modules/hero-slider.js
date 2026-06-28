const heroSlides = [
    {
        desktop: "assets/images/hero/slide1.webp",
        mobile: "assets/images/hero/slide1.webp",
        link: "#products",
        alt: "New Collection 2025",
    },
    {
        desktop: "assets/images/hero/slide2.webp",
        mobile: "assets/images/hero/slide2.webp",
        link: "#products",
        alt: "Premium Laptops",
    },
    {
        desktop: "assets/images/hero/slide3.webp",
        mobile: "assets/images/hero/slide3.webp",
        link: "#products",
        alt: "Latest Smartphones",
    },
    {
        desktop: "assets/images/hero/slide4.webp",
        mobile: "assets/images/hero/slide4.webp",
        link: "#products",
        alt: "Premium Audio",
    },
    {
        desktop: "assets/images/hero/slide5.webp",
        mobile: "assets/images/hero/slide5.webp",
        link: "#products",
        alt: "Premium Audio",
    },

];

export function initHeroSlider() {
    const container = document.getElementById("hero-slider");

    if (!container) return;

    container.innerHTML = heroSlides
        .map(
            (slide) => `
        <div class="swiper-slide">
            <a href="${slide.link}">
                <picture>
                    <source
                        media="(max-width: 1280px)"
                        srcset="${slide.mobile}">
                    <source
                        media="(min-width: 1281px)"
                        srcset="${slide.desktop}">
                    <img
                        src="${slide.desktop}"
                        alt="${slide.alt}"
                        loading="eager">
                </picture>
            </a>
        </div>
    `
        )
        .join("");

    // eslint-disable-next-line no-undef
    new Swiper(".hero-swiper", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".hero-pagination",
            clickable: true,
        },
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
    });
}