/**
 * SIGAAC - Dashboard Admin JavaScript
 * Sistema Integrado de Gestão e Apoio à Associação do Câncer
 */

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initNavigation();
    initAnimations();
});

/* ---------- Sidebar Toggle (Mobile) ---------- */
function initSidebar() {
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    if (!menuBtn || !sidebar || !overlay) return;

    menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    });

    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ---------- Navigation Active State ---------- */
function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar__nav-item');

    navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            // Remove active from all
            navItems.forEach((nav) => nav.classList.remove('active'));
            // Set clicked as active
            item.classList.add('active');

            // Close sidebar on mobile
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebar-overlay');
            if (sidebar && window.innerWidth <= 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/* ---------- Entrance Animations ---------- */
function initAnimations() {
    // Animate stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.08}s`;
    });

    // Animate consulta items
    const consultaItems = document.querySelectorAll('.consulta-item');
    consultaItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = `fadeInUp 0.4s ease forwards`;
        item.style.animationDelay = `${0.3 + index * 0.08}s`;
    });

    // Animate atividade items
    const atividadeItems = document.querySelectorAll('.atividade-item');
    atividadeItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = `fadeInUp 0.4s ease forwards`;
        item.style.animationDelay = `${0.35 + index * 0.08}s`;
    });
}
