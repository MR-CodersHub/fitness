// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Sticky Navbar Background & Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-reveal').forEach(el => observer.observe(el));

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// BMI Calculator
const bmiForm = document.getElementById('bmiForm');
const bmiResult = document.getElementById('bmi-result');

if (bmiForm) {
    bmiForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value) / 100; // convert cm to m

        if (weight > 0 && height > 0) {
            const bmi = (weight / (height * height)).toFixed(1);
            let category = '';

            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 24.9) category = 'Normal weight';
            else if (bmi < 29.9) category = 'Overweight';
            else category = 'Obese';

            bmiResult.textContent = `Your BMI: ${bmi} (${category})`;
            bmiResult.style.color = category === 'Normal weight' ? '#4CAF50' : '#D32F2F';
        } else {
            bmiResult.textContent = 'Please enter valid values.';
        }
    });
}

// Login Dropdown Toggle
const dropdownBtn = document.getElementById('user-dropdown-btn');
const dropdownMenu = document.querySelector('.dropdown-menu');

if (dropdownBtn && dropdownMenu) {
    dropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        dropdownMenu.classList.toggle('show');
    });

    // Close on selection
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Global Data Persistence Logic
const SpartanData = {
    saveBooking: (booking) => {
        const bookings = JSON.parse(localStorage.getItem('spartan_bookings') || '[]');
        bookings.push({ ...booking, id: Date.now(), status: 'Confirmed' });
        localStorage.setItem('spartan_bookings', JSON.stringify(bookings));
    },
    getBookings: () => JSON.parse(localStorage.getItem('spartan_bookings') || '[]'),

    saveUser: (user) => {
        localStorage.setItem('spartan_user', JSON.stringify(user));
    },
    getUser: () => JSON.parse(localStorage.getItem('spartan_user') || 'null'),

    addActivity: (activity) => {
        const activities = JSON.parse(localStorage.getItem('spartan_activities') || '[]');
        activities.unshift({ ...activity, timestamp: new Date().toISOString() });
        localStorage.setItem('spartan_activities', JSON.stringify(activities.slice(0, 10))); // Keep last 10
    }
};

// Handle Booking Form Submission
const bookingFormSubmit = document.getElementById('bookingForm');
if (bookingFormSubmit) {
    bookingFormSubmit.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = {
            name: bookingFormSubmit.querySelector('input[type="text"]').value,
            email: bookingFormSubmit.querySelector('input[type="email"]').value,
            program: bookingFormSubmit.querySelector('select:first-of-type').value,
            date: bookingFormSubmit.querySelector('input[type="date"]').value,
            time: bookingFormSubmit.querySelectorAll('select')[1].value
        };
        SpartanData.saveBooking(formData);
        SpartanData.addActivity({ type: 'Booking', message: `Booked ${formData.program} for ${formData.date}` });
        alert('Booking confirmed! Check your dashboard.');
        window.location.href = 'user-dashboard.html';
    });
}

// Handle Contact Form Submission
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Simulate submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        setTimeout(() => {
            alert('Your message has been submitted successfully! We will get back to you soon.');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;

            // Add activity for dashboard
            if (typeof SpartanData !== 'undefined') {
                SpartanData.addActivity({
                    type: 'Contact',
                    message: `Message sent: ${document.getElementById('contactSubject').value}`
                });
            }
        }, 1000);
    });
}
