// Personalization & Customizer Manager
// Allows customizing names, letter messages, photos, and generating shareable URL links.

class BirthdayCustomizer {
    constructor() {
        this.defaults = {
            didiName: 'My Dear Priyanka Didi',
            senderName: 'Your Loving Brother Rahul',
            birthdayWish: 'To the sweetest, most caring, and inspiring sister in the entire world. Thank you for always guiding me, supporting my dreams, making me laugh, and being my superhero. May this year bring you boundless happiness, peace, success, and all the love you deserve!',
            customLetterHeading: 'To My Dearest Priyanka Didi ❤️',
            card1Title: 'The Purest Heart',
            card1Desc: 'Always smiling and spreading joy to everyone around.',
            card2Title: 'Partner in Crime',
            card2Desc: 'From childhood secrets to endless laughter.',
            card3Title: 'My Guiding Light',
            card3Desc: 'Best advisor and my eternal source of strength.',
            card4Title: 'The Birthday Queen',
            card4Desc: 'Wishing you the most magical year ahead! 👑'
        };

        this.data = { ...this.defaults };
    }

    init() {
        this.loadFromStorageOrUrl();
        this.applyToDOM();
        this.bindEvents();
    }

    loadFromStorageOrUrl() {
        // First check URL query params
        const params = new URLSearchParams(window.location.search);
        let hasUrlParam = false;

        if (params.has('name')) {
            this.data.didiName = params.get('name');
            hasUrlParam = true;
        }
        if (params.has('from')) {
            this.data.senderName = params.get('from');
            hasUrlParam = true;
        }
        if (params.has('msg')) {
            this.data.birthdayWish = params.get('msg');
            hasUrlParam = true;
        }

        // If no URL param, check localStorage
        if (!hasUrlParam) {
            const saved = localStorage.getItem('didi_birthday_custom_data');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    this.data = { ...this.data, ...parsed };
                } catch (e) {
                    console.error('Error parsing stored birthday data', e);
                }
            }
        }
    }

    saveToStorage() {
        localStorage.setItem('didi_birthday_custom_data', JSON.stringify(this.data));
    }

    applyToDOM() {
        // Update Didi Name
        document.querySelectorAll('.js-didi-name').forEach(el => {
            el.textContent = this.data.didiName;
        });

        // Update Sender Name
        document.querySelectorAll('.js-sender-name').forEach(el => {
            el.textContent = this.data.senderName;
        });

        // Update Letter Content
        const letterSalutation = document.getElementById('letter-salutation-text');
        if (letterSalutation) letterSalutation.textContent = `Dearest ${this.data.didiName},`;

        const letterBody = document.getElementById('letter-body-text');
        if (letterBody) {
            letterBody.innerHTML = `<p>${this.data.birthdayWish.replace(/\n/g, '</p><p>')}</p>`;
        }

        // Fill form fields if modal exists
        const nameInput = document.getElementById('input-didi-name');
        const fromInput = document.getElementById('input-sender-name');
        const msgInput = document.getElementById('input-birthday-msg');

        if (nameInput) nameInput.value = this.data.didiName;
        if (fromInput) fromInput.value = this.data.senderName;
        if (msgInput) msgInput.value = this.data.birthdayWish;
    }

    generateShareableUrl() {
        const url = new URL(window.location.origin + window.location.pathname);
        url.searchParams.set('name', this.data.didiName);
        url.searchParams.set('from', this.data.senderName);
        url.searchParams.set('msg', this.data.birthdayWish);
        return url.toString();
    }

    bindEvents() {
        const modal = document.getElementById('customizer-modal');
        const openBtn = document.getElementById('btn-open-customizer');
        const closeBtn = document.getElementById('btn-close-customizer');
        const form = document.getElementById('customizer-form');
        const copyLinkBtn = document.getElementById('btn-copy-link');

        if (openBtn && modal) {
            openBtn.addEventListener('click', () => {
                modal.classList.add('active');
            });
        }

        if (closeBtn && modal) {
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('active');
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) modal.classList.remove('active');
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.data.didiName = document.getElementById('input-didi-name').value.trim() || 'Didi';
                this.data.senderName = document.getElementById('input-sender-name').value.trim() || 'Your Brother';
                this.data.birthdayWish = document.getElementById('input-birthday-msg').value.trim() || this.defaults.birthdayWish;

                this.saveToStorage();
                this.applyToDOM();

                if (modal) modal.classList.remove('active');

                // Burst celebration confetti!
                if (window.confettiEngine) {
                    window.confettiEngine.burst(window.innerWidth / 2, window.innerHeight / 2, 80);
                }
                alert('Personalized wishes saved successfully! ✨');
            });
        }

        if (copyLinkBtn) {
            copyLinkBtn.addEventListener('click', () => {
                const link = this.generateShareableUrl();
                navigator.clipboard.writeText(link).then(() => {
                    copyLinkBtn.textContent = 'Link Copied! 📋✨';
                    setTimeout(() => {
                        copyLinkBtn.textContent = 'Copy Shareable Link 🔗';
                    }, 2500);
                }).catch(err => {
                    prompt('Copy this link to share with Didi:', link);
                });
            });
        }

        // Custom Photo upload handler for cards
        const photoUpload = document.getElementById('input-custom-photo');
        if (photoUpload) {
            photoUpload.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const targetCardImg = document.getElementById('polaroid-img-1');
                        if (targetCardImg) {
                            targetCardImg.src = event.target.result;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
}

window.customizer = new BirthdayCustomizer();
