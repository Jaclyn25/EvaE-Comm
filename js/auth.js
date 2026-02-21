const STORAGE_KEYS = {
    CURRENT_USER: 'currentUser',
    USERS: 'users',
};

const REDIRECT_DELAY_MS = 1800;

/**
 * @returns {Object|null} { name, email, isLoggedIn } or null
 */
function getCurrentUser() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
        if (!raw) return null;
        const user = JSON.parse(raw);
        return user && user.isLoggedIn === true ? user : null;
    } catch {
        return null;
    }
}

/**
 * @returns {boolean}
 */
function isAuthenticated() {
    return getCurrentUser() !== null;
}

/**
 * @param {Object} user { name, email }
 */
function setCurrentUser(user) {
    if (user) {
        const payload = { ...user, isLoggedIn: true };
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(payload));
    } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    dispatchAuthChange();
}

function getUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.USERS);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Register: save user, set currentUser (name, email, isLoggedIn: true), show success, redirect to Home.
 * Prevents duplicate email.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, error?: string }}
 */
function registerUser(name, email, password) {
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedName || trimmedName.length < 2) {
        return { success: false, error: 'Name must be at least 2 characters' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters' };
    }

    const users = getUsers();
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
        return { success: false, error: 'Email already registered' };
    }

    const newUser = {
        id: Date.now(),
        name: trimmedName,
        email: trimmedEmail,
        password: btoa(password),
    };
    users.push(newUser);
    setUsers(users);

    setCurrentUser({ name: trimmedName, email: trimmedEmail });
    showSuccessMessageAndRedirect('Account created! Redirecting...', 'index.html');
    return { success: true };
}

/**
 * Login: validate credentials, set currentUser, redirect to Home.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, error?: string }}
 */
function loginUser(email, password) {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
    }
    if (!password) {
        return { success: false, error: 'Password is required' };
    }

    const users = getUsers();
    const user = users.find(
        (u) => u.email.toLowerCase() === trimmedEmail && atob(u.password) === password
    );
    if (!user) {
        return { success: false, error: 'Invalid email or password' };
    }

    setCurrentUser({ name: user.name, email: user.email });
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get('returnUrl');
    const returnUrl = encoded ? decodeURIComponent(encoded) : '';
    const redirectTo = returnUrl ? (returnUrl.startsWith('http') ? returnUrl : window.location.origin + (returnUrl.startsWith('/') ? '' : '/') + returnUrl) : 'index.html';
    showSuccessMessageAndRedirect('Welcome back! Redirecting...', redirectTo);
    return { success: true };
}

/**
 * Logout: clear currentUser, optional confirmation animation, then redirect to Home.
 */
function logoutUser() {
    const btn = document.getElementById('logoutBtn');
    if (btn) {
        btn.classList.add('logout-confirming');
        setTimeout(() => {
            btn.classList.remove('logout-confirming');
            setCurrentUser(null);
            applyPageTransition(() => {
                window.location.href = 'index.html';
            });
        }, 400);
    } else {
        setCurrentUser(null);
        applyPageTransition(() => {
            window.location.href = 'index.html';
        });
    }
}

function dispatchAuthChange() {
    window.dispatchEvent(new CustomEvent('authChange', { detail: { user: getCurrentUser() } }));
}

function showSuccessMessageAndRedirect(message, url) {
    const toast = document.createElement('div');
    toast.className = 'auth-success-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
            applyPageTransition(() => {
                window.location.href = url;
            });
        }, 300);
    }, REDIRECT_DELAY_MS);
}

function applyPageTransition(callback) {
    document.body.classList.add('page-transition-out');
    setTimeout(callback, 280);
}

/**
 * Auth UI: navbar slot + form handlers (event listeners only).
 */
class AuthUI {
    constructor() {
        this.currentUser = getCurrentUser();
        this.init();
    }

    init() {
        this.renderNavAuthSlot();
        this.bindAuthChange();
        if (document.getElementById('registerForm')) this.initRegisterForm();
        if (document.getElementById('loginForm')) this.initLoginForm();
        this.bindLogoutButtons();
    }

    bindAuthChange() {
        window.addEventListener('authChange', () => {
            this.currentUser = getCurrentUser();
            this.renderNavAuthSlot();
        });
    }

    renderNavAuthSlot() {
        const slot = document.getElementById('navAuthSlot');
        if (!slot) return; /* no navbar on login/register pages */

        slot.classList.add('nav-auth-transition');
        if (this.currentUser) {
            slot.innerHTML = `
                <span class="user-name" id="userName">${escapeHtml(this.currentUser.name)}</span>
                <button type="button" class="logout-btn" id="logoutBtn" aria-label="Logout">
                    <span class="logout-text">Logout</span>
                    <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                        <path d="M9 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4m7 14h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2m7 14h2m-7-14h2"/>
                    </svg>
                </button>
            `;
            this.bindLogoutButtons();
        } else {
            slot.innerHTML = `
                <a href="login.html" class="login-link nav-link" id="loginNavLink" aria-label="Login">
                    <svg class="login-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                    </svg>
                    <span class="login-link-text">Login</span>
                </a>
            `;
        }
    }

    bindLogoutButtons() {
        document.querySelectorAll('#logoutBtn').forEach((btn) => {
            btn.removeEventListener('click', this._handleLogout);
            this._handleLogout = () => logoutUser();
            btn.addEventListener('click', this._handleLogout);
        });
    }

    initRegisterForm() {
        const form = document.getElementById('registerForm');
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmInput = document.getElementById('registerConfirmPassword');

        const showError = (id, msg) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = msg;
                el.classList.add('show');
                el.parentElement?.classList.add('error');
            }
        };
        const hideError = (id) => {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('show');
                el.parentElement?.classList.remove('error');
            }
        };

        [nameInput, emailInput, passwordInput, confirmInput].forEach((input) => {
            if (!input) return;
            input.addEventListener('focus', () => input.parentElement?.classList.add('focused'));
            input.addEventListener('blur', () => input.parentElement?.classList.remove('focused'));
        });

        nameInput?.addEventListener('blur', () => {
            if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
                showError('nameError', 'Name must be at least 2 characters');
            } else {
                hideError('nameError');
            }
        });
        emailInput?.addEventListener('blur', () => {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
                showError('emailError', 'Please enter a valid email address');
            } else {
                hideError('emailError');
            }
        });
        passwordInput?.addEventListener('blur', () => {
            if (!passwordInput.value || passwordInput.value.length < 6) {
                showError('passwordError', 'Password must be at least 6 characters');
            } else {
                hideError('passwordError');
            }
        });
        confirmInput?.addEventListener('blur', () => {
            if (passwordInput?.value !== confirmInput?.value) {
                showError('confirmPasswordError', 'Passwords do not match');
            } else {
                hideError('confirmPasswordError');
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            hideError('nameError');
            hideError('emailError');
            hideError('passwordError');
            hideError('confirmPasswordError');

            const name = nameInput?.value?.trim() || '';
            const email = emailInput?.value?.trim() || '';
            const password = passwordInput?.value || '';
            const confirm = confirmInput?.value || '';

            if (name.length < 2) {
                showError('nameError', 'Name must be at least 2 characters');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('emailError', 'Please enter a valid email address');
                return;
            }
            if (password.length < 6) {
                showError('passwordError', 'Password must be at least 6 characters');
                return;
            }
            if (password !== confirm) {
                showError('confirmPasswordError', 'Passwords do not match');
                return;
            }

            const result = registerUser(name, email, password);
            if (!result.success) {
                if (result.error?.toLowerCase().includes('email')) {
                    showError('emailError', result.error);
                } else {
                    showError('nameError', result.error);
                }
                return;
            }
            const submitBtn = form.querySelector('.auth-submit-btn');
            if (submitBtn) {
                submitBtn.classList.add('submitting');
                setTimeout(() => submitBtn.classList.remove('submitting'), 400);
            }
        });
    }

    initLoginForm() {
        const form = document.getElementById('loginForm');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');

        const showError = (id, msg) => {
            const el = document.getElementById(id);
            if (el) {
                el.textContent = msg;
                el.classList.add('show');
            }
        };
        const hideError = (id) => {
            const el = document.getElementById(id);
            if (el) el.classList.remove('show');
        };

        emailInput?.addEventListener('focus', () => emailInput.parentElement?.classList.add('focused'));
        emailInput?.addEventListener('blur', () => emailInput.parentElement?.classList.remove('focused'));
        passwordInput?.addEventListener('focus', () => passwordInput.parentElement?.classList.add('focused'));
        passwordInput?.addEventListener('blur', () => passwordInput.parentElement?.classList.remove('focused'));

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            hideError('emailError');
            hideError('passwordError');

            const email = emailInput?.value?.trim() || '';
            const password = passwordInput?.value || '';

            const result = loginUser(email, password);
            if (!result.success) {
                if (result.error?.toLowerCase().includes('email')) {
                    showError('emailError', result.error);
                } else {
                    showError('passwordError', result.error);
                }
                return;
            }
            const submitBtn = form.querySelector('.auth-submit-btn');
            if (submitBtn) {
                submitBtn.classList.add('submitting');
                setTimeout(() => submitBtn.classList.remove('submitting'), 400);
            }
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export {
    getCurrentUser,
    isAuthenticated,
    registerUser,
    loginUser,
    logoutUser,
};
export default AuthUI;
