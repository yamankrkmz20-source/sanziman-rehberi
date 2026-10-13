document.addEventListener('DOMContentLoaded', function() {
    const launcher = document.querySelector('.assistant-launcher');
    const panel = document.getElementById('site-assistant-panel');
    const closeButton = document.querySelector('.assistant-close');
    const form = document.querySelector('.assistant-form');
    const input = document.getElementById('assistant-query');
    const messages = document.getElementById('assistant-messages');
    const suggestions = document.querySelectorAll('[data-assistant-query]');
    const stage = document.getElementById('section-stage');
    if (!launcher || !panel || !closeButton || !form || !input || !messages || !stage) return;

    const sections = Array.from(stage.children).filter(element => element.tagName === 'SECTION' && element.id);
    const navLinks = document.querySelectorAll('.nav-link');

    function normalize(value) {
        return value.toLocaleLowerCase('tr-TR')
            .replace(/[ç]/g, 'c')
            .replace(/[ğ]/g, 'g')
            .replace(/[ıİ]/g, 'i')
            .replace(/[ö]/g, 'o')
            .replace(/[ş]/g, 's')
            .replace(/[ü]/g, 'u')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    function addMessage(text, isUser) {
        const message = document.createElement('p');
        message.className = `assistant-message${isUser ? ' assistant-message-user' : ''}`;
        message.textContent = text;
        messages.append(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function showSection(sectionId) {
        const selected = sections.find(section => section.id === sectionId);
        if (!selected) return;
        sections.forEach(section => {
            section.hidden = section !== selected;
        });
        navLinks.forEach(link => {
            if (link.hash === `#${sectionId}`) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        stage.scrollTop = 0;
    }

    function addAction(label, action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'assistant-action';
        button.textContent = label;
        button.addEventListener('click', function() {
            action();
            launcher.setAttribute('aria-expanded', 'false');
            panel.setAttribute('aria-hidden', 'true');
            panel.hidden = true;
            launcher.focus();
        });
        messages.append(button);
        messages.scrollTop = messages.scrollHeight;
    }

    function submitQuery(rawQuery) {
        const query = rawQuery.trim();
        if (!query) return;
        addMessage(query, true);

        const normalizedQuery = normalize(query);
        const code = query.toUpperCase().match(/\bP\d{4}\b/);
        if (code) {
            addMessage(`${code[0]} kodu için Arıza Kodları bölümündeki eşleşmeleri açabilirim. Kod açıklaması tek başına parça değişimi veya revizyon teşhisi değildir.`, false);
            addAction('Arıza kodlarında ara', function() {
                const search = document.querySelector('.fault-search');
                if (search) {
                    search.value = code[0];
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                }
                showSection('ariza-kodlari');
            });
            return;
        }

        const brandButtons = Array.from(document.querySelectorAll('.brands-list .brand-toggle'));
        const matchedBrand = brandButtons
            .map(button => ({ button, name: button.textContent.trim() }))
            .filter(brand => normalize(brand.name).length >= 3 && normalizedQuery.includes(normalize(brand.name)))
            .sort((first, second) => normalize(second.name).length - normalize(first.name).length)[0];
        if (matchedBrand) {
            addMessage(`${matchedBrand.name} marka modellerini ve doğrulanmış yakıt gruplarını açabilirim.`, false);
            addAction(`${matchedBrand.name} modellerini aç`, function() {
                const search = document.getElementById('brand-search');
                if (search) {
                    search.value = matchedBrand.name;
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                }
                showSection('markalar');
                if (matchedBrand.button.getAttribute('aria-expanded') !== 'true') matchedBrand.button.click();
            });
            return;
        }

        const guideTerms = [
            { terms: ['yag', 'bakim', 'degisim araligi'], title: 'Şanzıman Yağı Ne Zaman Değişir?' },
            { terms: ['yari otomatik', 'tam otomatik', 'otomatik fark'], title: 'Otomatik ve Yarı Otomatik Şanzıman Farkları' },
            { terms: ['ne ise yarar', 'gorevi', 'sanziman nedir'], title: 'Şanzıman Ne İşe Yarar?' },
            { terms: ['belirti', 'ariza nasil anlasilir', 'ariza belirtisi'], title: 'Şanzıman Arızası Nasıl Anlaşılır?' },
            { terms: ['cvt nasil calisir', 'cvt calisma'], title: 'CVT Şanzıman Nasıl Çalışır?' },
            { terms: ['cift kavrama', 'dsg nasil calisir', 'dct nasil calisir'], title: 'Çift Kavramalı Şanzıman Nasıl Çalışır?' }
        ];
        const guide = guideTerms.find(item => item.terms.some(term => normalizedQuery.includes(term)));
        if (guide) {
            addMessage(`Rehberlerde “${guide.title}” açıklamasını buldum.`, false);
            addAction('İlgili rehberi aç', function() {
                showSection('blog');
                const card = Array.from(document.querySelectorAll('.blog-card'))
                    .find(element => normalize(element.querySelector('h3')?.textContent || '') === normalize(guide.title));
                const readMore = card?.querySelector('.read-more');
                if (readMore && readMore.getAttribute('aria-expanded') !== 'true') readMore.click();
            });
            return;
        }

        const faultTerms = ['titreme', 'silkeleme', 'vuruntu', 'kayma', 'gecis', 'vites secmeme', 'acil mod', 'ugultu', 'isinma', 'cvt', 'dsg', 'dct', 'sanziman ariza', 'ariza rehberi'];
        if (faultTerms.some(term => normalizedQuery.includes(term))) {
            addMessage('Belirtiyi ve şanzıman türünü arıza rehberinde arayabilirim. Sonuçlar olası nedenleri ve kontrol sırasını gösterir; kesin teşhis yerine geçmez.', false);
            addAction('Şanzıman arızalarında ara', function() {
                const search = document.getElementById('transmission-fault-search');
                const type = document.getElementById('transmission-fault-type');
                let typeQuery = '';
                if (normalizedQuery.includes('ecvt') || normalizedQuery.includes('e cvt')) typeQuery = 'ecvt';
                else if (normalizedQuery.includes('cvt')) typeQuery = 'kayis zincirli cvt';
                else if (normalizedQuery.includes('dq200')) typeQuery = 'dq200';
                else if (normalizedQuery.includes('dq250') || normalizedQuery.includes('dq381')) typeQuery = 'dq250';
                else if (['dct', 'edc', 'pdk', 'tct', 'powershift'].some(term => normalizedQuery.includes(term))) typeQuery = 'diger cift kavramali';
                if (type && typeQuery) {
                    const option = Array.from(type.options).find(item => normalize(item.textContent).includes(typeQuery));
                    if (option) {
                        type.value = option.value;
                        type.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
                if (search) {
                    const symptom = ['titreme', 'silkeleme', 'vuruntu', 'kayma', 'gecis', 'ugultu', 'isinma']
                        .find(term => normalizedQuery.includes(term));
                    const hasSpecificType = Boolean(typeQuery);
                    search.value = symptom || (hasSpecificType ? '' : query);
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                }
                showSection('sanziman-arizalari');
            });
            return;
        }

        const sectionIntents = [
            { terms: ['ana sayfa', 'anasayfa', 'baslangic'], id: 'home', label: 'Ana Sayfa' },
            { terms: ['rehber', 'yazi', 'konu anlat'], id: 'blog', label: 'Rehberler' },
            { terms: ['konular', 'sanziman turleri', 'kategori'], id: 'kategoriler', label: 'Konular' },
            { terms: ['ariza kodu', 'obd', 'dtc', 'hata kodu'], id: 'ariza-kodlari', label: 'Arıza Kodları' },
            { terms: ['marka', 'model', 'arac'], id: 'markalar', label: 'Araç Markaları' }
        ];
        const section = sectionIntents.find(item => item.terms.some(term => normalizedQuery.includes(term)));
        if (section) {
            addMessage(`${section.label} bölümünü açabilirim.`, false);
            addAction(`${section.label} bölümüne git`, function() {
                showSection(section.id);
            });
            return;
        }

        addMessage('Aradığını tam eşleştiremedim. Bir şanzıman türü veya belirti (ör. “CVT uğultu”), arıza kodu (ör. “P0716”), marka/model (ör. “Audi”) ya da bakım konusu yazabilirsin.', false);
    }

    function setOpen(isOpen) {
        launcher.setAttribute('aria-expanded', String(isOpen));
        panel.setAttribute('aria-hidden', String(!isOpen));
        panel.hidden = !isOpen;
        if (isOpen) input.focus();
    }

    launcher.addEventListener('click', function() {
        setOpen(launcher.getAttribute('aria-expanded') !== 'true');
    });
    closeButton.addEventListener('click', function() {
        setOpen(false);
        launcher.focus();
    });
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        submitQuery(input.value);
        input.value = '';
    });
    suggestions.forEach(button => {
        button.addEventListener('click', function() {
            submitQuery(button.getAttribute('data-assistant-query') || '');
        });
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panel.hidden) {
            setOpen(false);
            launcher.focus();
        }
    });

    addMessage('Merhaba! Sitede aradığın bölüm veya konuyu yaz; sana doğrudan bağlantısını bulayım.', false);
});
