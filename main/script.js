// Основной JavaScript файл для Синхро-Безопасность

// ===== ДЕБАГ ИНФОРМАЦИЯ =====
console.log('Скрипт Синхро-Безопасность загружен');

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ ДЛЯ РАБОТЫ С ЗАЯВКАМИ =====

// Сохранение демо-заявки (из contacts.html)
function saveDemoRequest(formData) {
    try {
        // Получаем существующие заявки
        let requests = JSON.parse(localStorage.getItem('sync_demo_requests') || '[]');
        
        // Добавляем timestamp
        formData.timestamp = new Date().toISOString();
        formData.created_at = formData.timestamp;
        formData.type = 'demo';
        
        // Добавляем новую заявку
        requests.push(formData);
        
        // Сохраняем обратно
        localStorage.setItem('sync_demo_requests', JSON.stringify(requests));
        
        console.log('Демо-заявка сохранена:', formData);
        console.log('Всего демо-заявок:', requests.length);
        
        return { success: true, count: requests.length };
    } catch (error) {
        console.error('Ошибка сохранения демо-заявки:', error);
        return { success: false, error: error.message };
    }
}

// Сохранение обращения в поддержку (из support.html)
function saveSupportRequest(formData) {
    try {
        // Получаем существующие заявки
        let requests = JSON.parse(localStorage.getItem('sync_support_requests') || '[]');
        
        // Добавляем timestamp
        formData.timestamp = new Date().toISOString();
        formData.created_at = formData.timestamp;
        formData.type = 'support';
        
        // Добавляем новую заявку
        requests.push(formData);
        
        // Сохраняем обратно
        localStorage.setItem('sync_support_requests', JSON.stringify(requests));
        
        console.log('Обращение в поддержку сохранено:', formData);
        console.log('Всего обращений:', requests.length);
        
        return { success: true, count: requests.length };
    } catch (error) {
        console.error('Ошибка сохранения обращения:', error);
        return { success: false, error: error.message };
    }
}

// Проверка, есть ли сохраненные заявки
function hasSavedRequests() {
    const demoRequests = JSON.parse(localStorage.getItem('sync_demo_requests') || '[]');
    const supportRequests = JSON.parse(localStorage.getItem('sync_support_requests') || '[]');
    
    return demoRequests.length > 0 || supportRequests.length > 0;
}

// Получение статистики заявок
function getRequestsStatistics() {
    const demoRequests = JSON.parse(localStorage.getItem('sync_demo_requests') || '[]');
    const supportRequests = JSON.parse(localStorage.getItem('sync_support_requests') || '[]');
    
    const today = new Date().toDateString();
    let todayCount = 0;
    
    [...demoRequests, ...supportRequests].forEach(request => {
        const requestDate = new Date(request.timestamp || request.created_at).toDateString();
        if (requestDate === today) {
            todayCount++;
        }
    });
    
    return {
        total: demoRequests.length + supportRequests.length,
        demo: demoRequests.length,
        support: supportRequests.length,
        today: todayCount
    };
}

// Функция экранирования HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функция показа уведомления
function showNotification(message, type = 'info') {
    // Удаляем старые уведомления
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Стили уведомления
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Кнопка закрытия
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        font-size: 1.2rem;
        margin-left: 15px;
        opacity: 0.8;
    `;
    
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Автоматическое скрытие
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ===== ОСНОВНОЙ КОД =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM полностью загружен');
    
    // ===== ПРОВЕРКА ЭЛЕМЕНТОВ =====
    console.log('Кнопка бокового меню:', document.getElementById('sideMenuBtn'));
    console.log('Боковое меню:', document.getElementById('sideMenu'));
    console.log('Основная навигация:', document.getElementById('mainNav'));
    
    // ===== БОКОВОЕ МЕНЮ =====
    const sideMenuBtn = document.getElementById('sideMenuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeSideMenu = document.getElementById('closeSideMenu');
    
    if (sideMenuBtn && sideMenu) {
        console.log('Элементы бокового меню найдены');
        
        // Создаём перекрытие фона
        const menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        document.body.appendChild(menuOverlay);
        
        // Открытие бокового меню
        sideMenuBtn.addEventListener('click', function() {
            console.log('Открытие бокового меню');
            sideMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Закрытие бокового меню
        const closeMenu = function() {
            console.log('Закрытие бокового меню');
            sideMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeSideMenu) {
            closeSideMenu.addEventListener('click', closeMenu);
        }
        
        menuOverlay.addEventListener('click', closeMenu);
        
        // Закрытие при клике на ссылку в меню
        document.querySelectorAll('.side-menu-nav a').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });
    } else {
        console.error('Элементы бокового меню не найдены!');
    }
    
    // ===== ФОРМА ДЕМОНСТРАЦИИ (contacts.html) =====
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        console.log('Форма демонстрации найдена');
        
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Отправка формы демо');
            
            // Собираем данные формы
            const formData = {
                full_name: document.getElementById('full_name')?.value || '',
                company: document.getElementById('company')?.value || '',
                position: document.getElementById('position')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                email: document.getElementById('email')?.value || '',
                users_count: document.getElementById('users_count')?.value || '',
                system_type: document.getElementById('system_type')?.value || '',
                message: document.getElementById('message')?.value || ''
            };
            
            // Валидация
            const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!formData.full_name.trim()) {
                showNotification('Пожалуйста, введите ваше имя', 'error');
                return;
            }
            
            if (!formData.company.trim()) {
                showNotification('Пожалуйста, введите название компании', 'error');
                return;
            }
            
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            if (!emailRegex.test(formData.email)) {
                showNotification('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            // Сохраняем заявку
            const result = saveDemoRequest(formData);
            
            if (result.success) {
                showNotification(`Заявка на демонстрацию сохранена! Всего заявок: ${result.count}`, 'success');
                demoForm.reset();
                
                // Показываем модальное окно успеха если есть
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.style.display = 'flex';
                }
            } else {
                showNotification(`Ошибка сохранения: ${result.error}`, 'error');
            }
        });
    }
    
    // ===== ФОРМА ПОДДЕРЖКИ (support.html) =====
    const supportForm = document.getElementById('supportForm');
    if (supportForm) {
        console.log('Форма поддержки найдена');
        
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Отправка формы поддержки');
            
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name')?.value || '',
                company: document.getElementById('company')?.value || '',
                phone: document.getElementById('phone')?.value || '',
                email: document.getElementById('email')?.value || '',
                system_type: document.getElementById('system_type')?.value || '',
                problem_description: document.getElementById('problem_description')?.value || ''
            };
            
            // Валидация
            const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!formData.name.trim()) {
                showNotification('Пожалуйста, введите ваше имя', 'error');
                return;
            }
            
            if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            if (!emailRegex.test(formData.email)) {
                showNotification('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            if (!formData.problem_description.trim()) {
                showNotification('Пожалуйста, опишите проблему', 'error');
                return;
            }
            
            // Сохраняем заявку
            const result = saveSupportRequest(formData);
            
            if (result.success) {
                showNotification(`Обращение в поддержку сохранено! Всего обращений: ${result.count}`, 'success');
                supportForm.reset();
                
                // Показываем модальное окно успеха если есть
                const successModal = document.getElementById('successModal');
                if (successModal) {
                    successModal.style.display = 'flex';
                }
            } else {
                showNotification(`Ошибка сохранения: ${result.error}`, 'error');
            }
        });
    }
    
    // ===== СТАРАЯ ФОРМА ОБРАТНОЙ СВЯЗИ (для совместимости) =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm && !demoForm && !supportForm) {
        console.log('Старая форма обратной связи найдена');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Отправка старой формы');
            
            // Валидация формы
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            
            // Простая валидация телефона
            const phoneRegex = /^(\+7|8)[\s(]?\d{3}[)\s]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/;
            if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
                showNotification('Пожалуйста, введите корректный номер телефона', 'error');
                return;
            }
            
            // Простая валидация email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Пожалуйста, введите корректный email адрес', 'error');
                return;
            }
            
            if (!name.trim() || !company.trim()) {
                showNotification('Пожалуйста, заполните все обязательные поля', 'error');
                return;
            }
            
            // Сохраняем данные в localStorage
            const formData = {
                name: name,
                company: company,
                phone: phone,
                email: email,
                position: document.getElementById('position') ? document.getElementById('position').value : '',
                users: document.getElementById('users') ? document.getElementById('users').value : '',
                system: document.getElementById('system') ? document.getElementById('system').value : '',
                message: document.getElementById('message') ? document.getElementById('message').value : '',
                timestamp: new Date().toISOString()
            };
            
            console.log('Данные формы:', formData);
            
            // Сохраняем в localStorage
            try {
                let submissions = JSON.parse(localStorage.getItem('syncsecurity_submissions') || '[]');
                submissions.push(formData);
                localStorage.setItem('syncsecurity_submissions', JSON.stringify(submissions));
                console.log('Данные сохранены в localStorage');
            } catch (error) {
                console.error('Ошибка сохранения в localStorage:', error);
            }
            
            // Показываем модальное окно успеха
            const successModal = document.getElementById('successModal');
            if (successModal) {
                successModal.style.display = 'flex';
                console.log('Показано модальное окно успеха');
            } else {
                showNotification('Спасибо за заявку! Мы свяжемся с вами в ближайшее время.', 'success');
            }
            
            // Очищаем форму
            contactForm.reset();
        });
    }
    
    // Закрытие модального окна успеха
    const closeSuccessModal = document.getElementById('closeSuccessModal');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');
    const successModal = document.getElementById('successModal');
    
    if (closeSuccessModal) {
        closeSuccessModal.addEventListener('click', function() {
            if (successModal) {
                successModal.style.display = 'none';
                console.log('Модальное окно закрыто');
            }
        });
    }
    
    if (closeSuccessBtn) {
        closeSuccessBtn.addEventListener('click', function() {
            if (successModal) {
                successModal.style.display = 'none';
                console.log('Модальное окно закрыто (кнопкой)');
            }
        });
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (successModal && e.target === successModal) {
            successModal.style.display = 'none';
            console.log('Модальное окно закрыто (клик вне окна)');
        }
    });
    
    // ===== ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРЕЙ =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Пропускаем якорь "#" без имени
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                console.log('Прокрутка к якорю:', href);
                
                // Закрываем боковое меню если открыто
                if (sideMenu && sideMenu.classList.contains('active')) {
                    sideMenu.classList.remove('active');
                    const overlay = document.querySelector('.menu-overlay');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                const headerHeight = document.querySelector('.main-header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                console.log('Анимация добавлена для:', entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми карточками
    document.querySelectorAll('.feature-card, .stat-item, .client-logo').forEach(function(element) {
        observer.observe(element);
    });
    
    // ===== ТАБЛИЦА ТРЕБОВАНИЙ (для requirements.html) =====
    const requirementsTable = document.querySelector('.requirements-table');
    if (requirementsTable) {
        console.log('Таблица требований найдена');
        
        // Добавляем эффект при наведении
        requirementsTable.addEventListener('mouseover', function(e) {
            if (e.target.tagName === 'TD') {
                e.target.parentNode.style.backgroundColor = 'rgba(243, 156, 18, 0.1)';
            }
        });
        
        requirementsTable.addEventListener('mouseout', function(e) {
            if (e.target.tagName === 'TD') {
                const row = e.target.parentNode;
                if (row.rowIndex % 2 === 0) {
                    row.style.backgroundColor = 'var(--oil-light)';
                } else {
                    row.style.backgroundColor = 'transparent';
                }
            }
        });
    }
    
    // ===== ОБРАБОТКА ФОРМЫ КОНТАКТОВ =====
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        // Обработка email с выбором домена
        const emailName = document.getElementById('emailName');
        const emailDomain = document.getElementById('emailDomain');
        const customDomain = document.getElementById('customDomain');
        const otherDomain = document.getElementById('otherDomain');
        const emailField = document.getElementById('email');
        
        if (emailName && emailDomain && emailField) {
            // Обновление скрытого поля email
            function updateEmail() {
                let domain = emailDomain.value;
                if (domain === 'other' && otherDomain) {
                    domain = otherDomain.value;
                }
                if (emailName.value && domain) {
                    emailField.value = emailName.value + '@' + domain;
                } else {
                    emailField.value = '';
                }
            }
            
            emailName.addEventListener('input', updateEmail);
            
            if (emailDomain) {
                emailDomain.addEventListener('change', function() {
                    if (this.value === 'other' && customDomain) {
                        customDomain.style.display = 'block';
                    } else {
                        if (customDomain) customDomain.style.display = 'none';
                        updateEmail();
                    }
                });
            }
            
            if (otherDomain) {
                otherDomain.addEventListener('input', updateEmail);
            }
        }
        
        // Обработка чекбокса согласия
        const privacyCheck = document.getElementById('privacyCheck');
        const privacyLink = document.getElementById('privacyLink');
        const privacyModal = document.getElementById('privacyModal');
        const closePrivacyModal = document.getElementById('closePrivacyModal');
        const acceptPrivacyBtn = document.getElementById('acceptPrivacyBtn');
        
        if (privacyLink && privacyModal) {
            // Открытие модального окна с политикой
            privacyLink.addEventListener('click', function(e) {
                e.preventDefault();
                privacyModal.style.display = 'flex';
            });
            
            if (closePrivacyModal) {
                closePrivacyModal.addEventListener('click', function() {
                    privacyModal.style.display = 'none';
                });
            }
            
            if (acceptPrivacyBtn) {
                acceptPrivacyBtn.addEventListener('click', function() {
                    if (privacyCheck) privacyCheck.checked = true;
                    privacyModal.style.display = 'none';
                });
            }
            
            // Закрытие при клике вне окна
            window.addEventListener('click', function(e) {
                if (e.target === privacyModal) {
                    privacyModal.style.display = 'none';
                }
            });
        }
    }
    
    // Вызов функции при загрузке
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // ===== ОБРАБОТКА МОДАЛЬНЫХ ОКОН =====
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (contactModal) {
                contactModal.style.display = 'none';
                console.log('Контактное модальное окно закрыто');
            }
        });
    }
    
    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(e) {
        if (contactModal && e.target === contactModal) {
            contactModal.style.display = 'none';
            console.log('Контактное модальное окно закрыто (клик вне окна)');
        }
    });
    
    // ===== ДИНАМИЧЕСКОЕ ОБНОВЛЕНИЕ ГОДА В ПОДВАЛЕ =====
    const currentYear = new Date().getFullYear();
    const yearElements = document.querySelectorAll('.current-year');
    yearElements.forEach(function(el) {
        el.textContent = currentYear;
    });
    console.log('Год обновлен:', currentYear);
    
    // ===== ПОДСВЕТКА АКТИВНОЙ СТРАНИЦЫ В НАВИГАЦИИ =====
    function updateActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        console.log('Текущая страница:', currentPage);
        
        // Основная навигация
        document.querySelectorAll('.main-nav a').forEach(function(link) {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (linkHref === 'index.html' && currentPage === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Боковое меню
        document.querySelectorAll('.side-menu-nav a').forEach(function(link) {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || 
                (currentPage === '' && linkHref === 'index.html') ||
                (linkHref === 'index.html' && currentPage === '')) {
                link.style.color = 'var(--oil-gold)';
                link.style.fontWeight = 'bold';
            } else {
                link.style.color = '';
                link.style.fontWeight = '';
            }
        });
    }
    
    // Вызываем при загрузке
    updateActiveNav();
    
    // ===== КНОПКА "НАВЕРХ" =====
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-top-btn';
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Наверх');
    scrollToTopBtn.setAttribute('title', 'Наверх');
    document.body.appendChild(scrollToTopBtn);
    console.log('Кнопка "Наверх" создана');
    
    scrollToTopBtn.addEventListener('click', function() {
        console.log('Прокрутка наверх');
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });
    
    // ===== ЗАГРУЗКА ИЗОБРАЖЕНИЙ С ОШИБКОЙ =====
    document.querySelectorAll('img').forEach(function(img) {
        img.addEventListener('error', function() {
            console.warn('Ошибка загрузки изображения:', this.src);
            this.style.display = 'none';
        });
    });
    
    // ===== ИНИЦИАЛИЗАЦИЯ ВСЕХ ФОРМ =====
    document.querySelectorAll('form').forEach(function(form, index) {
        console.log('Форма #' + index + ' найдена:', form.id || 'без ID');
    });
    
    // ===== СБОР СТАТИСТИКИ ПОСЕЩЕНИЙ =====
    try {
        let visits = JSON.parse(localStorage.getItem('syncsecurity_visits') || '[]');
        const visitData = {
            page: window.location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };
        visits.push(visitData);
        if (visits.length > 100) {
            visits = visits.slice(-50); // Храним только последние 50 посещений
        }
        localStorage.setItem('syncsecurity_visits', JSON.stringify(visits));
        console.log('Статистика посещений сохранена');
    } catch (error) {
        console.error('Ошибка сохранения статистики:', error);
    }
    
    // ===== ДОБАВЛЯЕМ CSS ДЛЯ УВЕДОМЛЕНИЙ =====
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: var(--oil-blue);
            color: white;
            border: none;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: all 0.3s;
        }
        
        .scroll-top-btn:hover {
            background: var(--oil-dark);
            transform: translateY(-3px);
        }
        
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999;
            display: none;
        }
        
        .menu-overlay.active {
            display: block;
        }
    `;
    document.head.appendChild(notificationStyles);
    
    console.log('Все скрипты инициализированы успешно');
    
    // ===== ПОКАЗЫВАЕМ СТАТИСТИКУ В КОНСОЛИ =====
    const stats = getRequestsStatistics();
    console.log('📊 Статистика заявок:', stats);
});

// ===== ГЛОБАЛЬНЫЕ ФУНКЦИИ =====
function openContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'flex';
        console.log('Контактное модальное окно открыто');
    }
}

function closeContactModal() {
    const modal = document.getElementById('contactModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('Контактное модальное окно закрыто');
    }
}

// ===== ОБРАБОТЧИК ОШИБОК =====
window.addEventListener('error', function(e) {
    console.error('Глобальная ошибка:', e.message, 'в', e.filename, 'строка', e.lineno);
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Необработанное обещание:', e.reason);
});

// ===== ЭКСПОРТ ГЛОБАЛЬНЫХ ФУНКЦИЙ =====
if (typeof window !== 'undefined') {
    window.saveDemoRequest = saveDemoRequest;
    window.saveSupportRequest = saveSupportRequest;
    window.getRequestsStatistics = getRequestsStatistics;
    window.showNotification = showNotification;
}

console.log('Скрипт Синхро-Безопасность полностью загружен и готов к работе');
