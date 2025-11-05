// Blog Articles Data
const blogArticles = [
    {
        id: 1,
        title: "Les bienfaits du massage suédois",
        excerpt: "Découvrez comment le massage suédois peut améliorer votre circulation et réduire votre stress quotidien.",
        category: "massage",
        tags: ["massage", "relaxation", "circulation"],
        date: "2024-11-01",
        icon: "fa-spa"
    },
    {
        id: 2,
        title: "L'aromathérapie pour mieux dormir",
        excerpt: "Les huiles essentielles de lavande et de camomille peuvent transformer vos nuits. Voici comment les utiliser.",
        category: "aromatherapy",
        tags: ["aromathérapie", "sommeil", "huiles essentielles"],
        date: "2024-10-28",
        icon: "fa-seedling"
    },
    {
        id: 3,
        title: "5 exercices de respiration anti-stress",
        excerpt: "Apprenez des techniques simples de respiration pour gérer votre stress au quotidien.",
        category: "wellness",
        tags: ["bien-être", "stress", "respiration"],
        date: "2024-10-25",
        icon: "fa-wind"
    },
    {
        id: 4,
        title: "Alimentation et bien-être : le lien essentiel",
        excerpt: "Une alimentation équilibrée est la clé d'un corps et d'un esprit sains. Nos conseils nutrition.",
        category: "nutrition",
        tags: ["nutrition", "santé", "équilibre"],
        date: "2024-10-20",
        icon: "fa-apple-alt"
    },
    {
        id: 5,
        title: "La réflexologie plantaire expliquée",
        excerpt: "Comprendre les zones réflexes des pieds et leurs bienfaits sur l'ensemble du corps.",
        category: "massage",
        tags: ["réflexologie", "pieds", "thérapie"],
        date: "2024-10-15",
        icon: "fa-shoe-prints"
    }
];

// Display blog posts
function displayBlogPosts(posts) {
    const container = document.getElementById('blogPosts');
    if (!container) return;

    container.innerHTML = posts.map(post => `
        <article class="blog-post-card" data-category="${post.category}">
            <div class="post-image">
                <i class="fas ${post.icon}"></i>
            </div>
            <div class="post-content">
                <div class="post-meta">
                    <span><i class="fas fa-calendar"></i> ${formatBlogDate(post.date)}</span>
                    <span><i class="fas fa-folder"></i> ${getCategoryName(post.category)}</span>
                </div>
                <h2 class="post-title">${post.title}</h2>
                <p class="post-excerpt">${post.excerpt}</p>
                <div class="post-tags">
                    ${post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="#" class="btn btn-primary">Lire la suite <i class="fas fa-arrow-right"></i></a>
            </div>
        </article>
    `).join('');
}

// Filter by category
document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.category;

        document.querySelectorAll('.category-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const filtered = category === 'all' ? blogArticles : blogArticles.filter(post => post.category === category);
        displayBlogPosts(filtered);
    });
});

// Search functionality
document.getElementById('blogSearch')?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = blogArticles.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
    );
    displayBlogPosts(filtered);
});

// Newsletter form
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input').value;
    localStorage.setItem('newsletter-subscribed', email);
    showNotification('Merci ! Vous êtes inscrit à notre newsletter.');
    e.target.reset();
});

function getCategoryName(cat) {
    const names = {
        'massage': 'Massages',
        'aromatherapy': 'Aromathérapie',
        'wellness': 'Bien-être',
        'nutrition': 'Nutrition'
    };
    return names[cat] || cat;
}

function formatBlogDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = message;
    notification.classList.add('show');
    if (type === 'error') notification.style.background = '#e74c3c';
    else notification.style.background = 'var(--primary-color)';
    setTimeout(() => notification.classList.remove('show'), 4000);
}

// Initialize
if (document.getElementById('blogPosts')) {
    displayBlogPosts(blogArticles);
}
