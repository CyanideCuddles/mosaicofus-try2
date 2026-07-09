document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasGsap = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';
    let lenis = null;

    if (hasGsap && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    // 1. Initialize Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.35,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 0.9,
            smoothTouch: false,
            touchMultiplier: 1.7,
            infinite: false,
        });

        if (hasScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
        }

        if (hasGsap) {
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);
        }
    }

    // 2. Scroll Progress
    const scrollProgress = document.querySelector('.scroll-progress');
    const updateScrollProgress = () => {
        if (!scrollProgress) return;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
        scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
    };

    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);

    // 2. Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const cursorPulse = document.querySelector('.cursor-pulse');
    const cursorTargets = 'a, button, .atelier-card, .team-member, .experience-card, .process-step, .momentum-item, .hero-heading, .hero-body, .manifesto-quote, .story-copy, .section-title, .card-title, .team-name';

    if (window.matchMedia('(pointer: fine)').matches && cursor) {
        document.body.classList.add('cursor-ready');
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let pulseX = mouseX;
        let pulseY = mouseY;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursor.classList.add('visible');
            if (cursorPulse) cursorPulse.classList.add('visible');
        }, { passive: true });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('visible');
            if (cursorPulse) cursorPulse.classList.remove('visible');
        });

        document.addEventListener('mouseover', (event) => {
            if (event.target.closest(cursorTargets)) {
                cursor.classList.add('hover');
            }
        });

        document.addEventListener('mouseout', (event) => {
            if (event.target.closest(cursorTargets)) {
                cursor.classList.remove('hover');
            }
        });

        const renderCursor = () => {
            cursorX += (mouseX - cursorX) * 0.16;
            cursorY += (mouseY - cursorY) * 0.16;
            pulseX += (mouseX - pulseX) * 0.34;
            pulseY += (mouseY - pulseY) * 0.34;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            if (cursorPulse) {
                cursorPulse.style.transform = `translate3d(${pulseX}px, ${pulseY}px, 0) translate(-50%, -50%)`;
            }
            requestAnimationFrame(renderCursor);
        };

        renderCursor();
    }

    // 3. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    const updateNavbar = () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    // 4. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    const closeMobileMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        if (lenis) lenis.start();
    };

    const openMobileMenu = () => {
        if (!hamburger || !mobileMenu) return;
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('active');
        document.body.classList.add('menu-open');
        if (lenis) lenis.stop();
    };

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // 5. Pointer-aware glow, tilt, and magnetic UI
    if (window.matchMedia('(pointer: fine)').matches) {
        const reactiveCards = document.querySelectorAll('.atelier-card, .team-member, .experience-card, .process-step, .momentum-item');
        reactiveCards.forEach(card => {
            card.addEventListener('pointermove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const xPercent = (x / rect.width) * 100;
                const yPercent = (y / rect.height) * 100;
                const rotateY = ((x / rect.width) - 0.5) * 7;
                const rotateX = -((y / rect.height) - 0.5) * 7;

                card.style.setProperty('--spot-x', `${xPercent}%`);
                card.style.setProperty('--spot-y', `${yPercent}%`);

                if (hasGsap) {
                    gsap.to(card, {
                        rotateX,
                        rotateY,
                        transformPerspective: 900,
                        duration: 0.45,
                        ease: 'power3.out'
                    });
                }
            });

            card.addEventListener('pointerleave', () => {
                if (hasGsap) {
                    gsap.to(card, {
                        rotateX: 0,
                        rotateY: 0,
                        x: 0,
                        y: 0,
                        duration: 0.7,
                        ease: 'elastic.out(1, 0.45)'
                    });
                } else {
                    card.style.transform = '';
                }
            });
        });

        document.querySelectorAll('.btn-primary, .btn-secondary, .btn-text, .nav-link, .logo, .hamburger').forEach(target => {
            target.addEventListener('pointermove', (event) => {
                if (!hasGsap) return;
                const rect = target.getBoundingClientRect();
                const x = event.clientX - (rect.left + rect.width / 2);
                const y = event.clientY - (rect.top + rect.height / 2);
                gsap.to(target, { x: x * 0.18, y: y * 0.22, duration: 0.38, ease: 'power3.out' });
            });

            target.addEventListener('pointerleave', () => {
                if (hasGsap) gsap.to(target, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
            });
        });
    }

    if (!hasGsap) {
        const loader = document.querySelector('.page-loader');
        if (loader) loader.style.display = 'none';
        document.querySelectorAll('.fade-up, .fade-up-scroll, .reveal-text, .stagger-card').forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
        return;
    }

    // 6. GSAP Animations
    const loader = document.querySelector('.page-loader');
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (loader) {
        tl.to(loader, {
            opacity: 0,
            duration: 0.9,
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
            }
        }, "+=0.15");
    }

    // Text Splitting Utility
    const splitText = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            const text = el.innerText.trim();
            const words = text.split(/\s+/);
            el.innerHTML = '';
            words.forEach((word, i) => {
                const wordWrap = document.createElement('span');
                wordWrap.className = 'split-word';
                wordWrap.style.overflow = 'hidden';

                const wordInner = document.createElement('span');
                wordInner.className = 'split-char';
                wordInner.innerText = word + (i < words.length - 1 ? '\u00A0' : '');

                wordWrap.appendChild(wordInner);
                el.appendChild(wordWrap);
            });
        });
    };

    // Apply text splitting
    splitText('.hero-heading');
    splitText('.manifesto-quote');
    splitText('.section-title');

    // Hero Animations
    tl.from('.hero-heading .split-char', {
        yPercent: 120,
        rotateZ: 8,
        opacity: 0,
        duration: 1.2,
        stagger: 0.04,
        ease: "power4.out"
    }, "-=0.35")
        .to('.fade-up', {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.12,
            ease: "power3.out"
        }, "-=0.85");

    gsap.fromTo('.hero-orbit',
        { opacity: 0, scale: 0.94, rotate: -10 },
        { opacity: 0.7, scale: 1, rotate: 0, duration: 1.6, ease: 'power3.out' },
        "-=1"
    );

    if (!hasScrollTrigger) return;

    gsap.to('.ambient-shard', {
        yPercent: -18,
        rotate: 16,
        ease: 'none',
        stagger: 0.08,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.2
        }
    });

    gsap.to('.hero-orbit', {
        yPercent: 14,
        rotate: 18,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.1
        }
    });

    // Advanced Text Reveals
    document.querySelectorAll('.manifesto-quote, .section-title').forEach(quote => {
        const chars = quote.querySelectorAll('.split-char');
        if (chars.length) {
            gsap.fromTo(chars,
                { yPercent: 110, rotateZ: 5, opacity: 0 },
                {
                    yPercent: 0,
                    rotateZ: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.02,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: quote,
                        start: "top 85%",
                        once: true
                    }
                }
            );
        }
    });

    // Gold Divider Animation
    document.querySelectorAll('.gold-divider').forEach(divider => {
        gsap.fromTo(divider,
            { scaleY: 0 },
            {
                scaleY: 1,
                duration: 1.35,
                ease: "power3.inOut",
                scrollTrigger: {
                    trigger: divider,
                    start: "top 82%",
                    once: true
                }
            }
        );
    });

    // Image Parallax
    document.querySelectorAll('.parallax-container').forEach(container => {
        const img = container.querySelector('.img-parallax');
        if (img) {
            gsap.fromTo(img,
                { yPercent: -10 },
                {
                    yPercent: 10,
                    ease: "none",
                    scrollTrigger: {
                        trigger: container,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1.2
                    }
                }
            );
        }
    });

    // Fade Up Elements on Scroll
    document.querySelectorAll('.fade-up-scroll').forEach(el => {
        gsap.to(el, {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 86%",
                once: true
            }
        });
    });

    // Scroll Velocity Skewing
    if (hasGsap && hasScrollTrigger) {
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".fade-up, .stagger-card, .momentum-item", "skewY", "deg"),
            clamp = gsap.utils.clamp(-4, 4);

        ScrollTrigger.create({
            onUpdate: (self) => {
                let skew = clamp(self.getVelocity() / -400);
                if (Math.abs(skew) > Math.abs(proxy.skew)) {
                    proxy.skew = skew;
                    gsap.to(proxy, {
                        skew: 0,
                        duration: 0.8,
                        ease: "power3",
                        overwrite: true,
                        onUpdate: () => skewSetter(proxy.skew)
                    });
                }
            }
        });
    }

    // Card Staggers with scale effect
    document.querySelectorAll('.ateliers-grid, .team-grid, .experience-rail, .process-timeline').forEach(grid => {
        const cards = grid.querySelectorAll('.stagger-card');
        if (!cards.length) return;

        gsap.fromTo(cards,
            { y: 64, opacity: 0, scale: 0.95 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.15,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: grid,
                    start: "top 82%",
                    once: true
                }
            }
        );
    });
});
