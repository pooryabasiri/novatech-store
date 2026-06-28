const COUNTER_DURATION = 2000;

export function animateCounter(element) {
    const target = parseFloat(element.dataset.target);

    const isDecimal =
        element.classList.contains("hero-stat-decimal") ||
        target % 1 !== 0;

    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / COUNTER_DURATION, 1);

        const eased = 1 - Math.pow(1 - progress, 3);

        const value = target * eased;

        if (isDecimal && target < 10) {
            element.textContent = value.toFixed(1);
        } else {
            element.textContent = Math.floor(value).toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent =
                isDecimal && target < 10
                    ? target.toFixed(1)
                    : Math.floor(target).toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

export function initRevealAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("revealed");

                if (
                    entry.target.classList.contains("stat-number") ||
                    entry.target.classList.contains("hero-stat-value")
                ) {
                    animateCounter(entry.target);
                }

                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px",
        }
    );

    document
        .querySelectorAll(".reveal")
        .forEach((el) => observer.observe(el));

    document
        .querySelectorAll(".stat-number[data-target]")
        .forEach((el) => observer.observe(el));

    document
        .querySelectorAll(".hero-stat-value[data-target]")
        .forEach((el) => observer.observe(el));
}