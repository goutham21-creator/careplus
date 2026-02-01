/* 
 * CarePlus Hospital - Main Script
 * Handles global interactions like navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Highlight Active Link
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        if (link.href.includes(currentPath)) {
            link.classList.add('active');
        }
    });

    // Doctor Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const doctorCards = document.querySelectorAll('.doctor-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                doctorCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    // Form Handling
    const appointmentForm = document.querySelector('form');
    // Check if we are on the appointment page (basic check)
    const isAppointmentPage = window.location.pathname.includes('appointment.html');

    if (isAppointmentPage && appointmentForm) {
        // Firebase Appointment Submission
        appointmentForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = appointmentForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Loading State
            submitBtn.textContent = 'Booking...';
            submitBtn.disabled = true;

            try {
                // Dynamic Import of Firebase Services
                const { db } = await import('./firebase.js');
                const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

                // Gather Data from Inputs
                // Note: Using querySelector with attributes for stability
                const inputs = appointmentForm.querySelectorAll('.form-control');
                // Mapping based on DOM order: Name, Phone, Dept, Doctor, Date
                const appointmentData = {
                    patientName: inputs[0].value,
                    phone: inputs[1].value,
                    department: inputs[2].value,
                    doctor: inputs[3].value,
                    preferredDate: inputs[4].value,
                    createdAt: serverTimestamp()
                };

                // Add to Firestore
                await addDoc(collection(db, "appointments"), appointmentData);

                // Success
                alert('Appointment Booked Successfully! We will contact you shortly.');
                appointmentForm.reset();

            } catch (error) {
                console.error("Error booking appointment: ", error);
                alert('Something went wrong. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    } else if (window.location.pathname.includes('contact.html') && document.querySelector('form')) {
        // Contact Form Submission (Firebase)
        const contactForm = document.querySelector('form');
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            try {
                // Dynamic Import
                const { db } = await import('./firebase.js');
                const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

                const inputs = contactForm.querySelectorAll('.form-control');
                // Mapping: Name, Email, Message
                const messageData = {
                    name: inputs[0].value,
                    email: inputs[1].value,
                    message: inputs[2].value,
                    createdAt: serverTimestamp()
                };

                await addDoc(collection(db, "contactMessages"), messageData);

                alert('Thank you! Your message has been sent successfully. We will contact you shortly.');
                contactForm.reset();

            } catch (error) {
                console.error("Error sending message: ", error);
                alert('Something went wrong. Please try again.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    } else {
        // Generic Mock Form Submission (Fallback)
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;

                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    alert('Thank you! Your message has been sent successfully. We will contact you shortly.');
                    form.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            });
        });
    }

    // Admin Auth Feature (Hidden Trigger: Ctrl + Shift + L)
    document.addEventListener('keydown', async (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'L') {
            const email = prompt("Admin Login: Enter Email");
            const password = prompt("Admin Login: Enter Password");

            if (email && password) {
                try {
                    // Dynamic Imports
                    const { auth, db } = await import('./firebase.js');
                    const { signInWithEmailAndPassword, signOut } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                    const { collection, getDocs, query, limit, orderBy } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

                    const userCredential = await signInWithEmailAndPassword(auth, email, password);

                    if (userCredential.user.email === "admin@careplus.com") {
                        alert("Admin Login Successful!");
                        console.log("Logged in as Admin:", userCredential.user.email);

                        // Fetch recent appointments to verify access
                        const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"), limit(5));
                        const querySnapshot = await getDocs(q);

                        let report = "Recent Appointments (Admin View):\n";
                        if (querySnapshot.empty) {
                            report += "No appointments found.";
                        } else {
                            querySnapshot.forEach((doc) => {
                                const data = doc.data();
                                report += `- ${data.patientName} (${data.department}) - ${data.preferredDate}\n`;
                            });
                        }

                        alert(report);

                    } else {
                        alert("Unauthorized Access: You are not an admin.");
                        await signOut(auth);
                    }

                } catch (error) {
                    console.error("Admin Login Error:", error);
                    alert("Login Failed: " + error.message);
                }
            }
        }
    });
});
