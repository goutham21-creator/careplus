/* 
 * CarePlus Hospital - Main Script
 * Handles global interactions like navigation
 * Phase 3: Enhanced with role-based access and improved navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    // Phase 3: Import auth utilities
    import('./auth.js').then(authModule => {
        const { getCurrentUser, isAuthenticated, logout } = authModule;
        
        // Phase 3: Add logout functionality to header if user is logged in
        const user = getCurrentUser();
        if (user) {
            const header = document.querySelector('header .nav-links');
            if (header) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.textContent = `Logout (${user.role})`;
                logoutBtn.style.cursor = 'pointer';
                logoutBtn.style.color = '#ff3b30';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to logout?')) {
                        logout();
                    }
                });
                header.appendChild(logoutBtn);
            }
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Phase 3: Fix Active Link Highlighting (Only current page)
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a:not([href="#"])');

    links.forEach(link => {
        // Get the filename from href
        const linkPath = link.getAttribute('href');
        const linkFile = linkPath.split('/').pop();
        const currentFile = currentPath.split('/').pop() || 'index.html';

        // Only highlight if it's an exact match
        if (linkFile === currentFile || (currentFile === '' && linkFile === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
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

    // Phase 3: Enhanced Date Input - Set minimum date to today, disable past dates
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(dateInput => {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.addEventListener('change', (e) => {
            const selectedDate = new Date(e.target.value);
            const todayDate = new Date(today);
            if (selectedDate < todayDate) {
                alert('Please select today or a future date.');
                e.target.value = '';
            }
        });
    });

    // Form Handling
    const appointmentForm = document.querySelector('form');
    // Check if we are on the appointment page (basic check)
    const isAppointmentPage = window.location.pathname.includes('appointment.html');

    if (isAppointmentPage && appointmentForm) {
        // Phase 3: Import auth utilities
        import('./auth.js').then(async (authModule) => {
            const { getCurrentUser, isAuthenticated, showNotification } = authModule;

            // Check authentication (optional - allow guests to book)
            const user = getCurrentUser();
            if (user) {
                // If authenticated patient, prefill name if available
                const nameInput = appointmentForm.querySelector('.form-control[type="text"]');
                if (nameInput && !nameInput.value) {
                    nameInput.value = user.name || '';
                }
            }

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
                        status: 'Pending', // Phase 3: Add status
                        userId: user?.uid || null, // Phase 3: Link to authenticated user if available
                        createdAt: serverTimestamp()
                    };

                    // Add to Firestore
                    const docRef = await addDoc(collection(db, "appointments"), appointmentData);

                    // Phase 3: Show success notification
                    showNotification('Appointment Booked Successfully! Confirmation sent via email.', 'success');
                    appointmentForm.reset();

                } catch (error) {
                    console.error("Error booking appointment: ", error);
                    showNotification('Failed to book appointment. Please try again.', 'error');
                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            });
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
