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
    const stopWords = new Set([
        'acaba', 'ama', 'bir', 'bu', 'da', 'de', 'diye', 'icin', 'ile', 'mi', 'mu', 'ne',
        'nasil', 'neden', 'nerede', 'olan', 'olarak', 'olur', 've', 'veya', 'yap', 'yapar',
        'yapiyor', 'yaparim', 'nedir', 'demek', 'anlami', 'hakkinda', 'sorun', 'sorunu'
    ]);
    const synonyms = [
        ['titreme', 'titriyor', 'silkeleme', 'sarsinti', 'titresim'],
        ['vuruntu', 'sertlik', 'sert', 'darbe'],
        ['kayma', 'kacirma'],
        ['gecikme', 'gecikiyor', 'gecis', 'gecmiyor'],
        ['yag', 'atf', 'sivi'],
        ['bakim', 'servis'],
        ['degisim', 'degisir', 'degistirme', 'degistirilmeli'],
        ['zaman', 'aralik', 'periyodik'],
        ['ariza', 'hata', 'sorun', 'uyari'],
        ['guc', 'performans', 'hizlanma', 'cekis'],
        ['ses', 'ugultu', 'gurultu'],
        ['isitma', 'isinma', 'sicaklik', 'hararet']
    ];

    function normalize(value) {
        return value.toLocaleLowerCase('tr-TR')
            .replace(/ı/g, 'i')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    function tokenize(value) {
        return normalize(value).split(/\s+/).filter(token => token.length > 1 && !stopWords.has(token));
    }

    function tokensMatch(first, second) {
        if (first === second) return true;
        return synonyms.some(group => group.includes(first) && group.includes(second));
    }

    function scoreText(queryTokens, text) {
        const textTokens = tokenize(text);
        if (!queryTokens.length || !textTokens.length) return 0;
        let matched = 0;
        queryTokens.forEach(token => {
            if (textTokens.some(candidate => tokensMatch(token, candidate))) matched += 1;
        });
        return matched / queryTokens.length;
    }

    function addMessage(text, isUser) {
        const message = document.createElement('p');
        message.className = `assistant-message${isUser ? ' assistant-message-user' : ''}`;
        message.textContent = text;
        messages.append(message);
        messages.scrollTop = messages.scrollHeight;
    }

    function addAction(label, action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'assistant-action';
        button.textContent = label;
        button.addEventListener('click', function() {
            action();
            setOpen(false);
            launcher.focus();
        });
        messages.append(button);
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

    function makeKnowledgeBase() {
        const documents = [];
        document.querySelectorAll('.blog-card').forEach(card => {
            const title = card.querySelector('h3')?.textContent.trim();
            if (!title) return;
            const summary = Array.from(card.children)
                .find(child => child.tagName === 'P')?.textContent.trim();
            const details = card.querySelector('.blog-detail');
            const parts = details
                ? Array.from(details.querySelectorAll('p')).map(paragraph => paragraph.textContent.trim()).filter(Boolean)
                : [];
            const subheadings = details
                ? Array.from(details.querySelectorAll('h4')).map(heading => heading.textContent.trim())
                : [];
            documents.push({
                kind: 'blog',
                sectionId: 'blog',
                element: card,
                title,
                content: [summary, ...subheadings, ...parts].filter(Boolean).join(' '),
                parts: [...subheadings, ...parts].filter(Boolean)
            });
        });

        document.querySelectorAll('.fault-table tbody tr').forEach(row => {
            const cells = Array.from(row.children);
            const code = cells[0]?.textContent.trim();
            const meaning = cells[1]?.textContent.trim();
            const checks = cells[2]?.textContent.trim();
            if (!code || !meaning) return;
            documents.push({
                kind: 'code',
                sectionId: 'ariza-kodlari',
                title: `${code} — ${meaning}`,
                code,
                content: [meaning, checks].filter(Boolean).join(' '),
                parts: [meaning, checks].filter(Boolean)
            });
        });

        document.querySelectorAll('.transmission-fault-card').forEach(card => {
            const type = card.querySelector('h3')?.textContent.trim() || '';
            const examples = card.querySelector('.transmission-fault-examples')?.textContent.trim() || '';
            card.querySelectorAll('.transmission-fault-item').forEach(item => {
                const symptom = item.querySelector('h4')?.textContent.trim().replace(/^\d+\.\s*/, '');
                if (!symptom) return;
                const parts = Array.from(item.querySelectorAll('p')).map(paragraph => paragraph.textContent.trim()).filter(Boolean);
                documents.push({
                    kind: 'fault',
                    sectionId: 'sanziman-arizalari',
                    element: card,
                    type,
                    symptom,
                    title: `${type} — ${symptom}`,
                    content: [examples, ...parts].join(' '),
                    parts
                });
            });
        });

        document.querySelectorAll('.kategori-item').forEach(item => {
            const title = item.querySelector('h3')?.textContent.trim();
            const content = item.textContent.trim();
            if (!title) return;
            documents.push({
                kind: 'category',
                sectionId: 'kategoriler',
                title,
                content,
                parts: [content]
            });
        });
        return documents;
    }

    function rankDocuments(query, documents) {
        const queryTokens = tokenize(query);
        return documents.map(document => {
            const titleScore = scoreText(queryTokens, document.title);
            const contentScore = scoreText(queryTokens, document.content);
            const phraseScore = normalize(document.title).includes(normalize(query)) ? 1 : 0;
            return {
                document,
                score: titleScore * 0.65 + contentScore * 0.3 + phraseScore * 0.05,
                coverage: Math.max(titleScore, contentScore)
            };
        }).filter(result => result.coverage > 0)
            .sort((first, second) => second.score - first.score);
    }

    function bestAnswerParts(query, document, limit = 2) {
        const queryTokens = tokenize(query);
        return document.parts
            .map(part => ({ part, score: scoreText(queryTokens, part) }))
            .filter(result => result.score > 0)
            .sort((first, second) => second.score - first.score)
            .slice(0, limit)
            .map(result => result.part);
    }

    function findBrand(query) {
        const normalizedQuery = normalize(query);
        return Array.from(document.querySelectorAll('.brands-list .brand-toggle'))
            .map(button => ({ button, name: button.textContent.replace(/[+\-−]\s*$/, '').trim() }))
            .filter(brand => normalize(brand.name).length >= 3 && normalizedQuery.includes(normalize(brand.name)))
            .sort((first, second) => normalize(second.name).length - normalize(first.name).length)[0];
    }

    function openDocument(doc) {
        if (doc.kind === 'blog') {
            showSection(doc.sectionId);
            const readMore = doc.element.querySelector('.read-more');
            if (readMore?.getAttribute('aria-expanded') !== 'true') readMore?.click();
            doc.element.scrollIntoView({ block: 'start', behavior: 'smooth' });
            return;
        }
        if (doc.kind === 'code') {
            const search = document.querySelector('.fault-search');
            if (search) {
                search.value = doc.code;
                search.dispatchEvent(new Event('input', { bubbles: true }));
            }
        } else if (doc.kind === 'fault') {
            const type = document.getElementById('transmission-fault-type');
            const option = type && Array.from(type.options).find(item => normalize(item.textContent) === normalize(doc.type));
            if (type && option) {
                type.value = option.value;
                type.dispatchEvent(new Event('change', { bubbles: true }));
            }
            const search = document.getElementById('transmission-fault-search');
            if (search) {
                search.value = doc.symptom;
                search.dispatchEvent(new Event('input', { bubbles: true }));
            }
        }
        showSection(doc.sectionId);
        stage.scrollTop = 0;
    }

    function answerQuery(rawQuery) {
        const query = rawQuery.trim();
        if (!query) return;
        addMessage(query, true);

        const code = query.toUpperCase().match(/\bP\d{4}\b/);
        const documents = makeKnowledgeBase();
        if (code) {
            const codeResult = documents.find(item => item.kind === 'code' && item.code === code[0]);
            if (codeResult) {
                addMessage(`${codeResult.code}: ${codeResult.parts[0]} ${codeResult.parts[1] || ''} Kodun açıklaması tek başına arızalı parçayı kesinleştirmez.`, false);
                addAction('Kod bilgisini ve kontrolleri aç', function() {
                    openDocument(codeResult);
                });
                return;
            }
        }

        const normalizedQuery = normalize(query);
        const brand = findBrand(query);
        const asksAboutModels = ['marka', 'model', 'arac'].some(term => normalizedQuery.includes(term));
        if (brand && asksAboutModels) {
            addMessage(`${brand.name} için sitedeki Türkiye kaynaklı model ve yakıt bilgilerini açabilirim. Yakıtı doğrulanmayan modeller ayrıca gösterilir.`, false);
            addAction(`${brand.name} modellerini aç`, function() {
                const search = document.getElementById('brand-search');
                if (search) {
                    search.value = brand.name;
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                }
                showSection('markalar');
                if (brand.button.getAttribute('aria-expanded') !== 'true') brand.button.click();
            });
            return;
        }

        const ranked = rankDocuments(query, documents);
        const best = ranked[0];
        if (best && best.coverage >= 0.34) {
            const answerParts = bestAnswerParts(query, best.document, best.document.kind === 'fault' ? 3 : 2);
            if (best.document.kind === 'fault') {
                addMessage(`${best.document.type} — ${best.document.symptom}\n${answerParts.join('\n')}\n\nBunlar olası nedenlerdir; kesin teşhis için araç ve şanzıman koduna uygun kontrol gerekir.`, false);
            } else if (best.document.kind === 'code') {
                addMessage(`${best.document.code}: ${best.document.parts[0]} ${best.document.parts[1] || ''} Kodun açıklaması tek başına arızalı parçayı kesinleştirmez.`, false);
            } else {
                addMessage(`${best.document.title}\n${answerParts.join('\n') || best.document.content}`, false);
            }
            addAction('Kaynak bilgiyi sitede aç', function() {
                openDocument(best.document);
            });
            return;
        }

        if (brand) {
            addMessage(`${brand.name} marka sayfasını açabilirim. Belirli bir model arıyorsan marka ve “modeller” kelimesiyle birlikte yaz.`, false);
            addAction(`${brand.name} markasını bul`, function() {
                const search = document.getElementById('brand-search');
                if (search) {
                    search.value = brand.name;
                    search.dispatchEvent(new Event('input', { bubbles: true }));
                }
                showSection('markalar');
            });
            return;
        }

        addMessage('Bu soruya sitedeki içeriklerde yeterli eşleşme bulamadım. Örneğin “CVT nedir?”, “DSG titreme neden olur?”, bir arıza kodu (P0716) veya marka-model sorabilirsin.', false);
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
        answerQuery(input.value);
        input.value = '';
    });
    suggestions.forEach(button => {
        button.addEventListener('click', function() {
            answerQuery(button.getAttribute('data-assistant-query') || '');
        });
    });
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !panel.hidden) {
            setOpen(false);
            launcher.focus();
        }
    });

    addMessage('Merhaba! Şanzımanla ilgili sorunu kendi cümlelerinle yaz. Sitedeki rehberlerden yanıt bulup kaynağını açabilirim.', false);
});
