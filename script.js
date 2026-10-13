// Hamburger menü toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            navMenu.classList.toggle('active', !isExpanded);
            hamburger.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', String(!isExpanded));
        });
    }

    const sectionStage = document.getElementById('section-stage');
    const sections = sectionStage
        ? Array.from(sectionStage.children).filter(child => child.tagName === 'SECTION' && child.id)
        : [];
    const navLinks = document.querySelectorAll('.nav-link');

    function showSection(sectionId) {
        const selectedSection = sections.find(section => section.id === sectionId);
        if (!selectedSection) return;

        sections.forEach(section => {
            section.hidden = section !== selectedSection;
        });
        navLinks.forEach(link => {
            const isCurrent = link.hash === `#${sectionId}`;
            if (isCurrent) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
        if (sectionStage) sectionStage.scrollTop = 0;
    }

    // Nav linke tıklanınca seçili bölümü göster ve mobil menüyü kapat
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const sectionId = link.hash.slice(1);
            if (sections.some(section => section.id === sectionId)) {
                event.preventDefault();
                showSection(sectionId);
            }
            if (navMenu) navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            }
        });
    });

    const initialSection = sections.find(section => section.id === window.location.hash.slice(1))
        || sections.find(section => section.id === 'home');
    if (initialSection) showSection(initialSection.id);

    // CTA butonuyla rehberler bölümünü aç
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', function() {
            showSection('blog');
        });
    }

    const faultSearch = document.querySelector('.fault-search');
    if (faultSearch) {
        const faultRows = Array.from(document.querySelectorAll('.fault-table tbody tr'));
        const faultCount = document.querySelector('.fault-count');
        const faultEmpty = document.querySelector('.fault-empty');
        const recommendedChecks = [
            {
                test: code => code === 'P0700',
                text: 'TCM (şanzıman kontrol modülü) dâhil tüm modülleri taratıp ek arıza kodlarını okuyun. P0700 tek başına parça değişimi gerektirmez.'
            },
            {
                test: code => ['P0701', 'P0702', 'P0880', 'P0882', 'P0883', 'P0613'].includes(code),
                text: 'Akü/şarj voltajı, sigortalar, şaseler, TCM soketleri ve kablo tesisatını kontrol ettirin. Besleme ve iletişim sağlamsa yazılım/TCM üretici prosedürüyle test edilir.'
            },
            {
                test: code => /^P070[5-9]$/.test(code),
                text: 'Vites konum şalteri/sensörü, soket ve kabloları; P-R-N-D canlı verisinin kol konumuyla eşleşmesini kontrol ettirin. Ayar veya devre onarımı gerekebilir; şalter ancak testte arızalıysa değiştirilir.'
            },
            {
                test: code => /^P071[0-4]$/.test(code),
                text: 'Şanzıman yağı sıcaklık sensörü ve tesisatını, soğuk motorda canlı veriyi ve doğru yağ seviyesini kontrol ettirin. Sensör/kablo onarımı, gerçek aşırı ısınma varsa soğutucu ve yağ akışının incelenmesi gerekebilir.'
            },
            {
                test: code => /^P071[5-8]$/.test(code) || /^P072[0-3]$/.test(code),
                text: 'Giriş/çıkış devir sensörü sinyali, soket-kablo, sensör ucu ve tetik çarkını osiloskop/canlı veriyle kontrol ettirin. Devre onarımı veya doğrulanırsa sensör değişimi düşünülebilir.'
            },
            {
                test: code => code === 'P0218',
                text: 'Aracı zorlamayı bırakıp yağ seviyesi/kaçak, soğutucu hatları ve radyatör/ısı eşanjörü akışını kontrol ettirin. Doğru prosedürle sıcaklık ve basınç doğrulanmadan yalnızca yağ değişimi yeterli olmayabilir.'
            },
            {
                test: code => /^P073[0-6]$/.test(code),
                text: 'Önce doğru yağ seviyesi/özelliği, kaçaklar, motor ve şanzıman devir verileri ile kayma değerleri kontrol edilir. Hidrolik basınç/valf gövdesi ve kavramalar test edilir; revizyon ancak iç mekanik hasar doğrulanırsa.'
            },
            {
                test: code => /^P074[0-4]$/.test(code),
                text: 'Tork konvertörü kilitleme (TCC) devresi, kablo/soket, solenoid ve canlı kayma verisi test edilir. Konvertör veya valf gövdesi onarımı ancak üretici testleri arızayı doğrularsa; türbin/konvertör revizyonu doğrudan koddan çıkarılamaz.'
            },
            {
                test: code => ['P0745', 'P0746', 'P0747', 'P0748', 'P0796', 'P0962'].includes(code),
                text: 'İlgili basınç kontrol solenoidinin devresi, bobin direnci, soket ve hat basıncı kontrol edilir. Kablo/solenoid/valf gövdesi onarımı ölçüm sonucuna göre seçilir; doğrudan şanzıman revizyonu kararı verilmez.'
            },
            {
                test: code => ['P0750', 'P0751', 'P0752', 'P0753', 'P0754', 'P0755', 'P0756', 'P0757', 'P0758', 'P0760', 'P0765', 'P0770', 'P0973'].includes(code),
                text: 'Vites solenoidi devresi, kablo/soket, bobin direnci ve solenoid komut-canlı verisi kontrol edilir. Devre onarımı veya testte arızalı çıkan solenoid/valf gövdesi onarımı gerekebilir.'
            },
            {
                test: code => code === 'P0780',
                text: 'Arıza anındaki vites/devir verisi, yağ seviyesi/kalitesi, adaptasyon ve solenoid/hidrolik basınç kontrol edilir. Yazılım/adaptasyon yalnızca üretici prosedürü uygunsa; mekanik onarım test sonucuna göre.'
            },
            {
                test: code => ['P0840', 'P0841', 'P0842', 'P0843'].includes(code),
                text: 'Basınç sensörü devresi ve referans voltajı ölçülür; tarayıcı verisi mekanik manometreyle karşılaştırılır. Sensör, tesisat veya gerçek basınç sorunu ayırt edilmeden parça değiştirilmez.'
            },
            {
                test: code => ['P0867', 'P0868', 'P0869'].includes(code),
                text: 'Üretici prosedürüyle yağ seviyesi/kaçak, filtre, hat basıncı ve pompa-basınç regülatörü kontrol edilir. Düşük/yüksek basıncın nedeni ölçülmeden revizyon kararı verilmez.'
            },
            {
                test: code => code === 'P0894',
                text: 'Kayma değeri ve yağ basıncı; doğru yağ seviyesi, kaçak ve kavrama adaptasyonuyla birlikte incelenir. Kavrama/türbin/şanzıman revizyonu ancak iç kaçak veya mekanik aşınma testle kanıtlanırsa değerlendirilir.'
            },
            {
                test: code => code === 'P0897',
                text: 'Yağın doğru spesifikasyonda olup olmadığı, seviye, koku/kirlilik ve soğutucu kontaminasyonu kontrol edilir. Üretici bakım prosedürüne göre işlem yapılır; teşhis olmadan makineyle basınçlı flush uygulanmaz.'
            }
        ];

        faultRows.forEach(row => {
            const code = row.querySelector('th').textContent.trim();
            const advice = recommendedChecks.find(item => item.test(code));
            const cell = document.createElement('td');
            cell.textContent = advice
                ? advice.text
                : 'Marka/model servis prosedürüne göre ek kodlar, yağ seviyesi ve elektrik devreleri kontrol ettirilmelidir. Parça değişimi veya revizyon test sonucu olmadan önerilmez.';
            row.append(cell);
        });

        function filterFaultCodes() {
            const query = faultSearch.value.trim().toLocaleLowerCase('tr-TR');
            let visibleCount = 0;

            faultRows.forEach(row => {
                const matches = row.textContent.toLocaleLowerCase('tr-TR').includes(query);
                row.hidden = !matches;
                if (matches) visibleCount += 1;
            });

            faultCount.textContent = `${visibleCount} arıza kodu listeleniyor`;
            faultEmpty.hidden = visibleCount !== 0;
        }

        faultSearch.addEventListener('input', filterFaultCodes);
        filterFaultCodes();
    }

    const brandSearch = document.querySelector('.brands-search');
    if (brandSearch) {
        const brandsList = document.querySelector('.brands-list');
        const brandItems = Array.from(brandsList.querySelectorAll('li'))
            .sort((first, second) => first.textContent.localeCompare(second.textContent, 'en', { sensitivity: 'base' }));
        const brandsCount = document.querySelector('.brands-count');
        const brandsEmpty = document.querySelector('.brands-empty');

        const turkeyModels = {
            'Abarth': { models: ['500e'], url: 'https://www.abarth.com.tr/' },
            'Alfa Romeo': { models: ['Junior', 'Tonale', 'Giulia', 'Stelvio'], url: 'https://www.alfaromeo.com.tr/' },
            'Audi': { models: ['A3', 'A5', 'A6', 'A6 e-tron', 'Q3', 'Q4 e-tron', 'Q5', 'Q6 e-tron', 'Q7', 'Q8', 'e-tron GT'], url: 'https://www.audi.com.tr/tr/web/tr/modeller.html' },
            'BMW': { models: ['1 Serisi', '2 Serisi', '3 Serisi', '4 Serisi', '5 Serisi', '6 Serisi', '7 Serisi', '8 Serisi', 'X1', 'X2', 'X3', 'X5', 'X6', 'X7', 'XM', 'iX1', 'iX2', 'iX', 'i4', 'i5', 'i7'], url: 'https://www.bmw.com.tr/tr/all-models.html' },
            'BYD': { models: ['Dolphin', 'Atto 3', 'Seal', 'Seal U DM-i', 'Sealion 7'], url: 'https://www.byd.com/tr' },
            'Chery': { models: ['Tiggo 7 Pro Max', 'Tiggo 8 Pro Max'], url: 'https://www.cherytr.com/modeller/' },
            'Citroën': { models: ['C3', 'C3 Aircross', 'C4', 'C4 X', 'C5 Aircross'], url: 'https://www.citroen.com.tr/' },
            'Cupra': { models: ['Leon', 'Formentor', 'Ateca', 'Born', 'Tavascan'], url: 'https://www.cupraofficial.com.tr/' },
            'Dacia': { models: ['Sandero', 'Sandero Stepway', 'Jogger', 'Duster', 'Bigster'], url: 'https://www.dacia.com.tr/' },
            'DS Automobiles': { models: ['DS 3', 'DS 4', 'DS 7', 'DS 9'], url: 'https://www.dsautomobiles.com.tr/' },
            'Fiat': { models: ['500e', '600e'], url: 'https://www.fiat.com.tr/' },
            'Ford': { models: ['Puma', 'Kuga', 'Explorer', 'Capri', 'Mustang Mach-E'], url: 'https://www.ford.com.tr/' },
            'Honda': { models: ['Civic', 'HR-V', 'ZR-V', 'CR-V'], url: 'https://www.honda.com.tr/otomobil' },
            'Hyundai': { models: ['i10', 'i20', 'Bayon', 'Kona', 'Tucson', 'Ioniq 5', 'Ioniq 6'], url: 'https://www.hyundai.com/tr/tr' },
            'Jaecoo': { models: ['J7'], url: 'https://www.jaecoo.com.tr/' },
            'Jeep': { models: ['Avenger', 'Compass', 'Wrangler', 'Grand Cherokee'], url: 'https://www.jeep.com.tr/' },
            'Kia': { models: ['Picanto', 'Stonic', 'XCeed', 'Sportage', 'Niro', 'EV3', 'EV6', 'EV9'], url: 'https://www.kia.com/tr/modeller/tum-kia-modelleri.html' },
            'KGM': { models: ['Tivoli', 'Korando', 'Torres', 'Rexton'], url: 'https://www.kg-mobility.com.tr/' },
            'Lexus': { models: ['LBX', 'UX', 'NX', 'RX', 'RZ', 'ES', 'LS', 'LC'], url: 'https://www.lexus.com.tr/' },
            'Lynk & Co': { models: ['01', '02'], url: 'https://www.lynkco.com.tr/' },
            'Maserati': { models: ['Grecale', 'GranTurismo', 'GranCabrio', 'MC20'], url: 'https://www.maserati.com/tr/tr' },
            'Mazda': { models: ['Mazda3', 'CX-30', 'CX-5', 'MX-5'], url: 'https://www.mazda.com.tr/' },
            'Mercedes-Benz': { models: ['A-Serisi', 'C-Serisi', 'E-Serisi', 'S-Serisi', 'CLA', 'CLE', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Serisi', 'EQA', 'EQB', 'EQE', 'EQS', 'EQS SUV'], url: 'https://www.mercedes-benz.com.tr/passengercars/models.html' },
            'MG': { models: ['ZS', 'HS', 'MG4', 'Cyberster'], url: 'https://www.mg-turkey.com/tr/' },
            'Mini': { models: ['Cooper', 'Countryman', 'Aceman'], url: 'https://www.mini.com.tr/' },
            'Nissan': { models: ['Juke', 'Qashqai', 'X-Trail', 'Ariya'], url: 'https://www.nissan.com.tr/' },
            'Omoda': { models: ['Omoda 5', 'Omoda 7'], url: 'https://www.omodajaecoo.com.tr/' },
            'Opel': { models: ['Corsa', 'Astra', 'Mokka', 'Frontera', 'Grandland'], url: 'https://www.opel.com.tr/opelinizi-secin/araclar.html' },
            'Peugeot': { models: ['208', '2008', '308', '408', '3008', '5008'], url: 'https://www.peugeot.com.tr/modeller/peugeot-nuzu-secin.html' },
            'Porsche': { models: ['718', '911', 'Taycan', 'Panamera', 'Macan', 'Cayenne'], url: 'https://www.porsche.com/turkey/' },
            'Renault': { models: ['Clio', 'Captur', 'Megane E-Tech', 'Symbioz', 'Austral', 'Rafale', 'Scenic E-Tech'], url: 'https://www.renault.com.tr/' },
            'SEAT': { models: ['Ibiza', 'Arona', 'Leon'], url: 'https://www.seat.com.tr/' },
            'Škoda': { models: ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq', 'Enyaq', 'Elroq'], url: 'https://www.skoda.com.tr/' },
            'Subaru': { models: ['Crosstrek', 'Forester', 'Outback', 'Solterra'], url: 'https://www.subaru.com.tr/' },
            'Suzuki': { models: ['Swift', 'Vitara', 'S-Cross', 'Jimny'], url: 'https://www.suzuki.com.tr/' },
            'Tesla': { models: ['Model 3', 'Model Y'], url: 'https://www.tesla.com/tr_tr' },
            'TOGG': { models: ['T10X', 'T10F'], url: 'https://www.togg.com.tr/' },
            'Toyota': { models: ['Yaris', 'Yaris Cross', 'Corolla', 'Corolla Cross', 'C-HR', 'RAV4', 'Land Cruiser'], url: 'https://www.toyota.com.tr/' },
            'Volkswagen': { models: ['Polo', 'Golf', 'T-Cross', 'Taigo', 'T-Roc', 'Tiguan', 'Tayron', 'Touareg', 'ID.4', 'ID.7'], url: 'https://www.volkswagen.com.tr/' },
            'Volvo': { models: ['EX30', 'EX40', 'EC40', 'EX90', 'XC60', 'XC90'], url: 'https://www.volvocars.com/tr/' }
        };
        const combustionOnlyModels = {
            'Abarth': [],
            'Alfa Romeo': ['Junior', 'Tonale', 'Giulia', 'Stelvio'],
            'Audi': ['A3', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'Q8'],
            'BMW': ['1 Serisi', '2 Serisi', '3 Serisi', '4 Serisi', '5 Serisi', '6 Serisi', '7 Serisi', '8 Serisi', 'X1', 'X2', 'X3', 'X5', 'X6', 'X7'],
            'BYD': [],
            'Chery': ['Tiggo 7 Pro Max', 'Tiggo 8 Pro Max'],
            'Citroën': ['C3', 'C3 Aircross', 'C4', 'C4 X', 'C5 Aircross'],
            'Cupra': ['Leon', 'Formentor', 'Ateca'],
            'Dacia': ['Sandero', 'Sandero Stepway', 'Jogger', 'Duster', 'Bigster'],
            'DS Automobiles': ['DS 4', 'DS 7'],
            'Fiat': [],
            'Ford': ['Puma', 'Kuga'],
            'Honda': ['Civic'],
            'Hyundai': ['i10', 'i20', 'Bayon', 'Kona', 'Tucson'],
            'Jaecoo': ['J7'],
            'Jeep': ['Avenger', 'Compass', 'Wrangler'],
            'Kia': ['Picanto', 'Stonic', 'XCeed', 'Sportage'],
            'KGM': ['Tivoli', 'Korando', 'Torres', 'Rexton'],
            'Lexus': [],
            'Lynk & Co': [],
            'Maserati': ['Grecale', 'GranTurismo', 'GranCabrio', 'MC20'],
            'Mazda': ['Mazda3', 'CX-30', 'CX-5', 'MX-5'],
            'Mercedes-Benz': ['A-Serisi', 'C-Serisi', 'E-Serisi', 'S-Serisi', 'CLA', 'CLE', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'G-Serisi'],
            'MG': ['ZS', 'HS'],
            'Mini': ['Cooper', 'Countryman'],
            'Nissan': ['Juke'],
            'Omoda': ['Omoda 5', 'Omoda 7'],
            'Opel': ['Corsa', 'Astra', 'Mokka'],
            'Peugeot': ['208', '2008', '308', '408', '3008', '5008'],
            'Porsche': ['718', '911', 'Panamera', 'Cayenne'],
            'Renault': ['Clio', 'Captur'],
            'SEAT': ['Ibiza', 'Arona', 'Leon'],
            'Škoda': ['Fabia', 'Scala', 'Octavia', 'Superb', 'Kamiq', 'Karoq', 'Kodiaq'],
            'Subaru': ['Outback'],
            'Suzuki': ['Jimny'],
            'Tesla': [],
            'TOGG': [],
            'Toyota': ['Corolla', 'Land Cruiser'],
            'Volkswagen': ['Polo', 'Golf', 'T-Cross', 'Taigo', 'T-Roc', 'Tiguan', 'Tayron', 'Touareg'],
            'Volvo': []
        };
        function createFuelColumn(title, models, extraClass = '') {
            const column = document.createElement('section');
            column.className = `fuel-type-column ${extraClass}`.trim();
            const heading = document.createElement('h4');
            heading.textContent = title;
            const list = document.createElement('ul');
            models.forEach(model => {
                const item = document.createElement('li');
                const titleRow = document.createElement('div');
                titleRow.className = 'fuel-model-title';
                const modelHeading = document.createElement('h5');
                modelHeading.textContent = model.model;
                titleRow.append(modelHeading);
                if (model.url) {
                    const sourceLink = document.createElement('a');
                    sourceLink.href = model.url;
                    sourceLink.target = '_blank';
                    sourceLink.rel = 'noopener noreferrer';
                    sourceLink.textContent = 'Kaynak';
                    sourceLink.setAttribute('aria-label', `${model.model} model ailesi kaynağı`);
                    titleRow.append(sourceLink);
                }
                const engineList = document.createElement('ul');
                (model.engines || model.details || []).forEach(engine => {
                    const engineItem = document.createElement('li');
                    engineItem.textContent = engine;
                    engineList.append(engineItem);
                });
                item.append(titleRow);
                if (engineList.childElementCount > 0) item.append(engineList);
                list.append(item);
            });
            column.append(heading, list);
            return column;
        }

        function createBrandFuelOverview(groups, note, sources = []) {
            const overview = document.createElement('div');
            overview.className = 'brand-fuel-overview';
            const columns = document.createElement('div');
            columns.className = 'fuel-type-columns';
            const primaryGroups = [
                { key: 'benzin', title: 'Benzinli motorlar ve modeller' },
                { key: 'dizel', title: 'Dizel motorlar ve modeller' }
            ].filter(group => Array.isArray(groups[group.key]) && groups[group.key].length > 0);
            if (primaryGroups.length === 1) columns.classList.add('fuel-type-columns-single');
            primaryGroups.forEach(group => columns.append(createFuelColumn(group.title, groups[group.key])));
            if (primaryGroups.length > 0) overview.append(columns);

            const otherGroups = [
                { key: 'hibrit', title: 'Hibrit modeller (mild/full/PHEV)' },
                { key: 'elektrikli', title: 'Tam elektrikli modeller' },
                { key: 'lpg', title: 'LPG’li modeller' },
                { key: 'dogrulanamadi', title: 'Türkiye kaynağında adı geçen modeller (yakıtı doğrulanmadı)' }
            ].filter(group => Array.isArray(groups[group.key]) && groups[group.key].length > 0);
            if (otherGroups.length > 0) {
                const otherColumns = document.createElement('div');
                otherColumns.className = 'fuel-type-columns fuel-type-columns-other';
                otherGroups.forEach(group => {
                    otherColumns.append(createFuelColumn(group.title, groups[group.key], 'fuel-type-column-other'));
                });
                overview.append(otherColumns);
            }

            const noteElement = document.createElement('p');
            noteElement.className = 'fuel-data-note';
            noteElement.textContent = note;
            overview.append(noteElement);

            if (sources.length > 0) {
                const sourceDetails = document.createElement('details');
                sourceDetails.className = 'fuel-data-sources';
                const summary = document.createElement('summary');
                summary.textContent = 'Model kaynakları';
                const sourceList = document.createElement('ul');
                sources.forEach(source => {
                    const item = document.createElement('li');
                    const link = document.createElement('a');
                    link.href = source.url;
                    link.target = '_blank';
                    link.rel = 'noopener noreferrer';
                    link.textContent = source.label;
                    item.append(link);
                    sourceList.append(item);
                });
                sourceDetails.append(summary, sourceList);
                overview.append(sourceDetails);
            }

            return overview;
        }

        const brandFuelHistory = { ...(window.vehicleModelHistory || {}) };
        const brandFuelDataNote = 'Yakıt grupları yalnızca Türkiye kaynaklarında desteklenen seçenekleri gösterir. Türkiye marka sayfasında adı geçip yakıtı veya versiyonu doğrulanmayan modeller ayrı tutulur. Tarihsel model ve nesil kapsamı eksik olabilir; motor gücü ve şanzıman eşleşmesini model yılı ve VIN ile üretici/ithalatçı kaynağından doğrulayın.';

        Object.entries(turkeyModels).forEach(([brandName, brandInfo]) => {
            const history = brandFuelHistory[brandName] || { groups: {}, sources: [] };
            const groups = history.groups || {};
            const listedModels = new Set(
                Object.values(groups).flat().map(model => model.model.toLocaleLowerCase('tr-TR'))
            );
            const unverifiedModels = brandInfo.models
                .filter(model => !listedModels.has(model.toLocaleLowerCase('tr-TR')))
                .map(model => ({
                    model,
                    details: ['Türkiye marka model sayfasında adı yer alıyor; yakıt/versiyon eşleşmesi kaynakta doğrulanmadı.']
                }));
            if (unverifiedModels.length > 0) {
                groups.dogrulanamadi = [...(groups.dogrulanamadi || []), ...unverifiedModels];
            }
            history.groups = groups;
            history.sources = history.sources || [];
            if (brandInfo.url && !history.sources.some(source => source.url === brandInfo.url)) {
                history.sources.push({ label: `${brandName} Türkiye — modeller`, url: brandInfo.url });
            }
            brandFuelHistory[brandName] = history;
        });

        const combustionTransmissionFamilies = {
            'Abarth': 'Benzinli otomatik seçeneği listelenmedi; yalnızca elektrikli model bulunuyordu.',
            'Alfa Romeo': 'Benzinli/dizel otomatiklerde TCT çift kavramalı veya ZF 8 ileri otomatik; kesin kutu tipi motor seçeneğine bağlıdır.',
            'Audi': 'Benzinli/dizel modellerde S tronic çift kavramalı veya bazı versiyonlarda Tiptronic otomatik; DQ/AL kodu motorla doğrulanmalıdır.',
            'BMW': 'Kompakt benzinli modellerde 7 ileri Steptronic DCT; büyük benzinli/dizel modellerde genellikle 8 ileri Steptronic. ZF 8HP olasılığı, tam kutu kodu değildir.',
            'BYD': 'Listelenen Türkiye modellerinde yalnızca elektrikli veya hibrit seçenekler bulunduğundan benzinli/dizel model gösterilmiyor.',
            'Chery': 'Benzinli otomatiklerde DCT veya CVT ailesi; kesin kutu kodu motor ve versiyonla değişir.',
            'Citroën': 'Benzinli/dizel otomatiklerde EAT6/EAT8 tork konvertörlü otomatik; kesin kutu kodu motorla teyit edilmelidir.',
            'Cupra': 'Benzinli/dizel versiyonlarda DSG çift kavramalı otomatik; kesin DQ alt kodu motor ve torka bağlıdır.',
            'Dacia': 'Benzinli otomatik seçeneği varsa EDC çift kavramalı aile; model ve motor bazında teyit edilmelidir.',
            'DS Automobiles': 'Benzinli/dizel otomatik versiyonlarda EAT ailesi tork konvertörlü otomatik; kesin kod versiyona bağlıdır.',
            'Fiat': 'Listelenen Türkiye modellerinde yalnızca elektrikli seçenekler bulunduğundan benzinli/dizel model gösterilmiyor.',
            'Ford': 'Benzinli/dizel otomatiklerde modele göre tork konvertörlü otomatik veya çift kavramalı PowerShift ailesi.',
            'Honda': 'Benzinli otomatik versiyonda CVT; kutu iç kodu motor ve üretim yılıyla teyit edilmelidir.',
            'Hyundai': 'Benzinli/dizel otomatiklerde 6AT tork konvertörlü, 7DCT çift kavramalı veya IVT/CVT; kesin tür modele bağlıdır.',
            'Jaecoo': 'Benzinli otomatik versiyonlarda DCT çift kavramalı aile; alt kod motor ve model yılıyla doğrulanmalıdır.',
            'Jeep': 'Benzinli/dizel otomatiklerde 8 ileri tork konvertörlü otomatik veya modele özgü DCT; kesin kutu kodu versiyona bağlıdır.',
            'Kia': 'Benzinli/dizel otomatiklerde DCT, 6AT veya CVT; model-motor eşleşmesi kontrol edilmelidir.',
            'KGM': 'Benzinli/dizel otomatiklerde çoğunlukla 6 ileri tork konvertörlü otomatik; kesin kutu tipi motora bağlıdır.',
            'Lexus': 'Listelenen Türkiye gamında benzinli/dizel hibrit olmayan model doğrulanamadığı için model gösterilmiyor.',
            'Lynk & Co': 'Listelenen Türkiye modellerinde yalnızca hibrit veya elektrikli seçenekler bulunduğundan benzinli/dizel model gösterilmiyor.',
            'Maserati': 'Benzinli otomatik modellerde çoğunlukla ZF 8 ileri otomatik (8HP ailesi); alt kod motor/üretim yılıyla doğrulanmalıdır.',
            'Mazda': 'Benzinli otomatiklerde Skyactiv-Drive 6 ileri tork konvertörlü otomatik ailesi.',
            'Mercedes-Benz': 'Benzinli/dizel otomatiklerde kompaktlarda 7G-DCT; diğer birçok modelde 9G-TRONIC. Tam 724/725 kodu motor ve VIN ile doğrulanmalıdır.',
            'MG': 'Benzinli otomatiklerde modele göre 6AT, CVT veya DCT; kesin kutu kodu motor ve üretim serisine bağlıdır.',
            'Mini': 'Benzinli otomatik Cooper/Countryman versiyonlarında Steptronic DCT veya otomatik aile; kesin alt kod varyanta bağlıdır.',
            'Nissan': 'Benzinli Juke otomatikte Xtronic CVT ailesi; Jatco iç kodu motor ve üretim yılıyla doğrulanmalıdır.',
            'Omoda': 'Benzinli otomatik modellerde DCT çift kavramalı aile; alt kod motor ve üretim serisiyle doğrulanmalıdır.',
            'Opel': 'Benzinli/dizel otomatiklerde AT6/AT8 tork konvertörlü otomatik; kesin aile motor ve modele göre değişir.',
            'Peugeot': 'Benzinli/dizel otomatiklerde EAT6/EAT8 tork konvertörlü otomatik; iç kod motor ve versiyonla doğrulanmalıdır.',
            'Porsche': 'Benzinli modellerde PDK çift kavramalı veya bazı SUV versiyonlarında Tiptronic otomatik.',
            'Renault': 'Benzinli otomatik versiyonlarda EDC çift kavramalı aile; kesin alt kod motor ve model yılına bağlıdır.',
            'SEAT': 'Benzinli/dizel otomatiklerde DSG çift kavramalı aile; DQ alt kodu motorla teyit edilmelidir.',
            'Škoda': 'Benzinli/dizel otomatiklerde DSG çift kavramalı aile; DQ alt kodu motor ve torkla doğrulanmalıdır.',
            'Subaru': 'Benzinli Outback otomatikte Lineartronic CVT ailesi; iç kod motor ve üretim yılıyla doğrulanmalıdır.',
            'Suzuki': 'Benzinli Jimny otomatikte 4 ileri tork konvertörlü otomatik.',
            'Tesla': 'Listelenen modeller tamamen elektrikli olduğundan benzinli/dizel model gösterilmiyor.',
            'TOGG': 'Listelenen modeller tamamen elektrikli olduğundan benzinli/dizel model gösterilmiyor.',
            'Toyota': 'Benzinli Corolla otomatikte Multidrive S CVT; K313/K120 gibi iç kodlar araç özelinde doğrulanmalıdır.',
            'Volkswagen': 'Benzinli/dizel modellerde DSG çift kavramalı otomatik; DQ alt kodu motor ve torka göre değişir.',
            'Volvo': 'Listelenen güncel Türkiye gamında yalnızca elektrikli/hibrit seçenekler bulunduğundan benzinli/dizel model gösterilmiyor.'
        };
        const modelTransmissions = {
            'Abarth': {
                '500e': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik çok vitesli otomatik şanzımanı yoktur.'
            },
            'BYD': {
                'Dolphin': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'Atto 3': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'Seal': 'Tam elektrikli versiyon; sabit oranlı elektrikli redüksiyon kullanır.',
                'Seal U DM-i': 'Plug-in hibrit model; benzinli motor ile elektrik motorlarının birlikte çalıştığı hibrit aktarma sistemi kullanır. Mod ve motor çalışma koşullarına göre güç aktarımı değişebilir.',
                'Sealion 7': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Fiat': {
                '500e': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır.',
                '600e': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır.'
            },
            'Ford': {
                'Explorer': 'Tam elektrikli versiyon; sabit oranlı elektrikli redüksiyon kullanır.',
                'Capri': 'Tam elektrikli versiyon; sabit oranlı elektrikli redüksiyon kullanır.',
                'Mustang Mach-E': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Toyota': {
                'Corolla': '1.5 benzinli otomatik versiyon: Multidrive S CVT. 1.8 Hybrid: e-CVT güç bölüştürücülü hibrit aktarma; kayışlı CVT değildir.',
                'C-HR': 'Türkiye’de sunulan 1.8 Hybrid versiyon: e-CVT güç bölüştürücülü hibrit aktarma.',
                'Yaris': '1.5 Hybrid versiyon: e-CVT güç bölüştürücülü hibrit aktarma.',
                'Yaris Cross': '1.5 Hybrid versiyon: e-CVT güç bölüştürücülü hibrit aktarma.',
                'Corolla Cross': '1.8 Hybrid versiyon: e-CVT güç bölüştürücülü hibrit aktarma.',
                'RAV4': '2.5 Hybrid versiyon: e-CVT güç bölüştürücülü hibrit aktarma. Türkiye’de güncel versiyonun satış durumunu resmî model sayfasından teyit edin.'
            },
            'Renault': {
                'Clio': 'Güncel Türkiye otomatik motor-şanzıman kombinasyonu model yılına ve siparişe açık versiyona göre değişebilir; kesin türü resmî teknik föyden kontrol edin.',
                'Captur': 'Motor seçeneğine göre çift kavramalı EDC veya E-Tech full hybrid multimode otomatik aktarma sunulabilir. Güncel Türkiye versiyonunu sipariş öncesi teyit edin.',
                'Megane E-Tech': 'Tam elektrikli modeldir; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'Scenic E-Tech': 'Tam elektrikli modeldir; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik çok vitesli otomatik şanzımanı yoktur.'
            },
            'Volkswagen': {
                'Polo': '1.0 TSI otomatik versiyonlarda 7 ileri DSG çift kavramalı şanzıman.',
                'Golf': '1.5 TSI/eTSI otomatik versiyonlarda 7 ileri DSG çift kavramalı şanzıman.',
                'T-Roc': '1.5 TSI otomatik versiyonlarda 7 ileri DSG çift kavramalı şanzıman.',
                'Tiguan': '1.5 eTSI otomatik versiyonlarda 7 ileri DSG çift kavramalı şanzıman.',
                'ID.4': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'ID.7': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Škoda': {
                'Kamiq': '1.0 TSI otomatik versiyonlarda DSG çift kavramalı şanzıman.',
                'Octavia': '1.5 TSI/eTSI otomatik versiyonlarda DSG çift kavramalı şanzıman.',
                'Superb': 'Otomatik TSI/TDI versiyonlarda DSG çift kavramalı şanzıman.',
                'Kodiaq': 'Otomatik TSI/TDI versiyonlarda DSG çift kavramalı şanzıman.',
                'Enyaq': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'Elroq': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Hyundai': {
                'i10': '1.2 MPI otomatik versiyon: 4 ileri tork konvertörlü otomatik.',
                'i20': 'Otomatik 1.0 T-GDi versiyonlarda 7 ileri DCT çift kavramalı şanzıman; güncel motor seçeneğini teyit edin.',
                'Tucson': 'Benzinli otomatik versiyonlarda DCT bulunabilir; hibrit versiyonlarda farklı, tork konvertörlü otomatik aktarım kullanılır. Motor tipini kontrol edin.',
                'Kona': 'Benzinli versiyonlarda DCT, elektrikli versiyonlarda tek oranlı elektrikli redüksiyon kullanılır; Türkiye’de satıştaki güncel motoru kontrol edin.',
                'Ioniq 5': 'Tam elektrikli modeldir; sabit oranlı tek kademeli elektrikli redüksiyon kullanır.',
                'Ioniq 6': 'Tam elektrikli modeldir; sabit oranlı tek kademeli elektrikli redüksiyon kullanır.'
            },
            'Honda': {
                'Civic': '1.5 VTEC Turbo otomatik versiyon: CVT sürekli değişken oranlı şanzıman.',
                'HR-V': 'e:HEV hibrit sistem: e-CVT elektrikli-hibrit güç aktarımı; kayışlı CVT değildir.',
                'CR-V': 'e:HEV hibrit sistem: e-CVT elektrikli-hibrit güç aktarımı; kayışlı CVT değildir.'
            },
            'Kia': {
                'Sportage': '1.6 T-GDi otomatik versiyonlarda DCT çift kavramalı şanzıman; hibrit seçenek varsa aktarma tipi farklı olabilir.',
                'Niro': 'Hybrid versiyonlarda 6 ileri DCT çift kavramalı; tamamen elektrikli versiyonda tek oranlı redüksiyon.',
                'EV3': 'Tam elektrikli modeldir; sabit oranlı tek kademeli elektrikli redüksiyon kullanır.',
                'EV6': 'Tam elektrikli modeldir; sabit oranlı elektrikli redüksiyon kullanır.',
                'EV9': 'Tam elektrikli modeldir; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Peugeot': {
                '208': '48V Hybrid versiyonda 6 ileri e-DCS çift kavramalı otomatik; elektrikli E-208’de tek oranlı elektrikli redüksiyon.',
                '2008': '48V Hybrid versiyonda 6 ileri e-DCS çift kavramalı otomatik; elektrikli E-2008’de tek oranlı elektrikli redüksiyon.',
                '3008': 'Hybrid versiyonlarda 6 ileri e-DCS çift kavramalı otomatik; elektrikli E-3008’de tek oranlı elektrikli redüksiyon.',
                '5008': 'Hybrid versiyonlarda 6 ileri e-DCS çift kavramalı otomatik; elektrikli E-5008’de tek oranlı elektrikli redüksiyon.'
            },
            'Opel': {
                'Corsa': '48V Hybrid otomatik versiyonlarda 6 ileri e-DCT çift kavramalı; elektrikli Corsa’da tek oranlı elektrikli redüksiyon.',
                'Astra': '48V Hybrid otomatik versiyonlarda 6 ileri e-DCT çift kavramalı; elektrikli Astra’da tek oranlı elektrikli redüksiyon.',
                'Mokka': '48V Hybrid otomatik versiyonlarda 6 ileri e-DCT çift kavramalı; elektrikli Mokka’da tek oranlı elektrikli redüksiyon.'
            },
            'Tesla': {
                'Model 3': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik vitesli otomatik şanzımanı yoktur.',
                'Model Y': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik vitesli otomatik şanzımanı yoktur.'
            },
            'TOGG': {
                'T10X': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik vitesli otomatik şanzımanı yoktur.',
                'T10F': 'Tam elektrikli model; sabit oranlı tek kademeli elektrikli redüksiyon kullanır, klasik vitesli otomatik şanzımanı yoktur.'
            },
            'Volvo': {
                'EX30': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'EX40': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'EC40': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.',
                'EX90': 'Tam elektrikli model; sabit oranlı elektrikli redüksiyon kullanır.'
            },
            'Dacia': {
                'Duster': 'Hybrid otomatik versiyonda multimode hibrit şanzıman kullanılır; Dacia bunu DCT olarak adlandırmaz.',
                'Jogger': 'Hybrid otomatik versiyonda multimode hibrit şanzıman kullanılır; Dacia bunu DCT olarak adlandırmaz.',
                'Sandero': 'Güncel Türkiye otomatik motor-şanzıman eşleşmesi resmî teknik föyden doğrulanmalı; farklı model yıllarında seçenekler değişebilir.'
            },
            'BMW': {
                '1 Serisi': [
                    { version: '120 (1.5 litre benzinli, 48V mild-hybrid)', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' },
                    { version: 'M135 xDrive (2.0 litre benzinli)', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' }
                ],
                '2 Serisi': [
                    { version: '2 Serisi Gran Coupé benzinli otomatik versiyonlar', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' },
                    { version: '2 Serisi Coupé otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik; kesin alt tip motor ve model yılına göre kontrol edilmelidir.' },
                    { version: '2 Serisi Active Tourer otomatik versiyonlar', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' }
                ],
                '3 Serisi': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                '4 Serisi': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                '5 Serisi': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                '7 Serisi': [
                    { version: 'Benzinli ve dizel versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                '8 Serisi': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü); Türkiye’de güncel satış durumu model yılına göre teyit edilmelidir.' }
                ],
                'X1': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' }
                ],
                'X2': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '7 ileri Steptronic çift kavramalı otomatik (DCT).' }
                ],
                'X3': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                'X5': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                'X6': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                'X7': [
                    { version: 'Benzinli ve dizel otomatik versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                'XM': [
                    { version: 'Plug-in hybrid versiyonlar', transmission: '8 ileri Steptronic otomatik (tork konvertörlü).' }
                ],
                'iX1': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }],
                'iX2': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }],
                'iX': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }],
                'i4': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }],
                'i5': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }],
                'i7': [{ version: 'Tam elektrikli', transmission: 'Sabit oranlı elektrikli aktarma; klasik çok vitesli otomatik şanzıman yoktur.' }]
            },
            'Mercedes-Benz': {
                'A-Serisi': 'Otomatik versiyonlarda çift kavramalı otomatik şanzıman ailesi kullanılır; motor/versiyona göre dişli sayısı ve tipi teyit edilmelidir.',
                'CLA': 'Otomatik versiyonlarda çift kavramalı otomatik şanzıman ailesi kullanılır; motor/versiyona göre teyit edilmelidir.',
                'GLA': 'Otomatik versiyonlarda çift kavramalı otomatik şanzıman ailesi kullanılır; motor/versiyona göre teyit edilmelidir.',
                'GLB': 'Otomatik versiyonlarda çift kavramalı otomatik şanzıman ailesi kullanılır; motor/versiyona göre teyit edilmelidir.',
                'C-Serisi': 'Birçok otomatik içten yanmalı/hibrit versiyonda 9G-TRONIC tork konvertörlü otomatik şanzıman kullanılır.',
                'E-Serisi': 'Birçok otomatik içten yanmalı/hibrit versiyonda 9G-TRONIC tork konvertörlü otomatik şanzıman kullanılır.',
                'GLC': 'Birçok otomatik içten yanmalı/hibrit versiyonda 9G-TRONIC tork konvertörlü otomatik şanzıman kullanılır.',
                'GLE': 'Birçok otomatik içten yanmalı/hibrit versiyonda 9G-TRONIC tork konvertörlü otomatik şanzıman kullanılır.',
                'GLS': 'Birçok otomatik içten yanmalı/hibrit versiyonda 9G-TRONIC tork konvertörlü otomatik şanzıman kullanılır.',
                'EQA': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'EQB': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'EQE': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'EQS': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'EQS SUV': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.'
            },
            'Audi': {
                'A3': 'Türkiye’de sunulan birçok otomatik versiyonda S tronic çift kavramalı şanzıman kullanılır; tam eşleşme motor koduna göre teyit edilmeli.',
                'Q3': 'Türkiye’de sunulan birçok otomatik versiyonda S tronic çift kavramalı şanzıman kullanılır; tam eşleşme motor koduna göre teyit edilmeli.',
                'Q4 e-tron': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'Q6 e-tron': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'A6 e-tron': 'Tam elektrikli model; sabit oranlı elektrikli aktarma kullanır, klasik çok vitesli otomatik şanzımanı yoktur.',
                'e-tron GT': 'Tam elektrikli model; bazı versiyonlarda iki kademeli elektrikli aktarım bulunabilir. Klasik çift kavramalı otomatik değildir.'
            }
        };
        const unavailableMessage = '2000 sonrası Türkiye’de düzenli satışı veya ithalatı kaynakla doğrulanmış model bilgisi şu an listelenemedi. Bu, markanın hiç araç getirmediği anlamına gelmez; tekil/özel ithalatlar kapsam dışıdır.';
        const typicalTransmissions = {
            'Abarth': 'Elektrikli 500e gibi modellerde tek oranlı elektrikli aktarma; benzinli sportif türevlerde çift kavramalı otomatik görülebilir.',
            'Alfa Romeo': 'Benzinli/dizel otomatik versiyonlarda çift kavramalı TCT veya tork konvertörlü 8 ileri otomatik; hibrit ve elektrikli türevlerde farklı aktarma olabilir.',
            'Audi': 'İçten yanmalı/hibrit versiyonlarda S tronic çift kavramalı veya bazı motorlarda Tiptronic tork konvertörlü; e-tron elektriklilerde tek oranlı elektrikli aktarma.',
            'BMW': 'Kompakt içten yanmalı modellerde 7 ileri çift kavramalı Steptronic; daha büyük motor/ailelerde çoğunlukla 8 ileri Steptronic tork konvertörlü; i modellerde tek oranlı elektrikli aktarma.',
            'BYD': 'Tam elektrikli versiyonlarda tek oranlı elektrikli aktarma; DM-i plug-in hibritte BYD hibrit güç aktarım sistemi. Model/çekiş versiyonuna göre değişir.',
            'Chery': 'Motor ve pazara göre çift kavramalı DCT veya CVT otomatik seçenekler bulunabilir.',
            'Citroën': 'Hibrit versiyonlarda e-DCS çift kavramalı; bazı benzinli/dizel versiyonlarda EAT tork konvertörlü otomatik; elektriklilerde tek oranlı aktarma.',
            'Cupra': 'Benzinli/dizel otomatik versiyonlarda DSG çift kavramalı; elektrikli Born/Tavascan modellerinde tek oranlı elektrikli aktarma.',
            'Dacia': 'EDC çift kavramalı otomatik veya hibrit multimode otomatik sunulabilir; motor seçeneği ve model yılına göre değişir.',
            'DS Automobiles': 'Hibrit versiyonlarda e-DCS çift kavramalı, bazı diğer versiyonlarda EAT tork konvertörlü otomatik; elektriklilerde tek oranlı aktarma.',
            'Fiat': 'Benzinli/hibrit versiyonlarda çift kavramalı otomatik; elektrikli modellerde tek oranlı elektrikli aktarma.',
            'Ford': 'Modele göre çok vitesli tork konvertörlü otomatik veya çift kavramalı otomatik; elektrikli modellerde tek oranlı aktarma.',
            'Honda': 'Benzinli versiyonlarda CVT; e:HEV hibritlerde e-CVT güç aktarımı. Hibrit e-CVT, kayışlı CVT ile aynı değildir.',
            'Hyundai': 'Modele/motora göre DCT çift kavramalı, tork konvertörlü otomatik veya IVT/CVT; elektriklilerde tek oranlı aktarma.',
            'Jaecoo': 'Otomatik benzinli versiyonlarda genellikle çift kavramalı DCT ailesi; motor ve model yılına göre Türkiye teknik föyünden doğrulanmalı.',
            'Jeep': 'Modele göre tork konvertörlü otomatik, çift kavramalı hibrit otomatik veya elektrikli tek oranlı aktarma.',
            'Kia': 'Modele/motora göre DCT çift kavramalı, tork konvertörlü otomatik veya CVT; elektrikli EV modellerinde tek oranlı aktarma.',
            'KGM': 'İçten yanmalı otomatik versiyonlarda çoğunlukla tork konvertörlü 6 ileri otomatik; elektrikli versiyonlarda tek oranlı aktarma.',
            'Lexus': 'Hibrit versiyonlarda e-CVT güç bölüştürücülü aktarma; benzinli bazı modellerde çok vitesli otomatik; elektrikli RZ’de tek oranlı aktarma.',
            'Lynk & Co': 'Plug-in hybrid/benzinli sürümlerde çift kavramalı otomatik; tam elektrikli modelde tek oranlı aktarma.',
            'Maserati': 'İçten yanmalı modellerde çoğunlukla 8 ileri tork konvertörlü otomatik; elektrikli Folgore versiyonlarda elektrikli aktarma.',
            'Mazda': 'Benzinli/dizel otomatik versiyonlarda çoğunlukla 6 ileri tork konvertörlü otomatik; elektrikli versiyonlarda tek oranlı aktarma.',
            'Mercedes-Benz': 'Kompakt motor ailesinde çift kavramalı otomatik; büyük motorlu içten yanmalı/hibritlerde 9G-TRONIC; EQ elektriklilerde tek oranlı aktarma.',
            'MG': 'Modele göre CVT, çift kavramalı veya çok vitesli otomatik; elektrikli modellerde tek oranlı aktarma.',
            'Mini': 'Benzinli otomatik versiyonlarda çift kavramalı ya da Steptronic otomatik; elektrikli versiyonlarda tek oranlı aktarma.',
            'Nissan': 'Benzinli versiyonlarda Xtronic CVT veya modele özgü otomatik; e-POWER ve tam elektrikli modellerin aktarması farklıdır.',
            'Omoda': 'Benzinli otomatik modellerde çoğunlukla çift kavramalı DCT; motor seçeneği ve yeni model yılında değişebilir.',
            'Opel': '48V hibrit versiyonlarda e-DCT çift kavramalı; bazı benzinli/dizel versiyonlarda tork konvertörlü otomatik; elektriklilerde tek oranlı aktarma.',
            'Peugeot': '48V Hybrid versiyonlarda e-DCS çift kavramalı; bazı diğer motor seçeneklerinde EAT tork konvertörlü otomatik; elektriklilerde tek oranlı aktarma.',
            'Porsche': 'Benzinli modellerde PDK çift kavramalı veya bazı modellerde Tiptronic tork konvertörlü; elektriklilerde tek oranlı, Taycan’da arka aksta iki kademeli aktarma.',
            'Renault': 'Benzinli otomatiklerde EDC çift kavramalı; E-Tech full hybrid’de multimode hibrit otomatik; elektriklilerde tek oranlı aktarma.',
            'SEAT': 'Otomatik benzinli/dizel versiyonlarda DSG çift kavramalı şanzıman.',
            'Škoda': 'Otomatik benzinli/dizel versiyonlarda DSG çift kavramalı; Enyaq/Elroq elektriklilerde tek oranlı aktarma.',
            'Subaru': 'Benzinli otomatiklerde Lineartronic CVT; tam elektrikli Solterra’da tek oranlı elektrikli aktarma.',
            'Suzuki': 'Modele göre 6 ileri tork konvertörlü otomatik veya CVT; hibrit sistemde farklı aktarma olabilir.',
            'Tesla': 'Tam elektrikli modellerde sabit oranlı tek kademeli elektrikli redüksiyon; klasik çok vitesli otomatik şanzıman yoktur.',
            'TOGG': 'Tam elektrikli modellerde sabit oranlı tek kademeli elektrikli redüksiyon; klasik çok vitesli otomatik şanzıman yoktur.',
            'Toyota': 'Benzinli otomatiklerde Multidrive S CVT; hibritlerde e-CVT güç bölüştürücülü aktarma. e-CVT kayışlı CVT değildir.',
            'Volkswagen': 'Benzinli/dizel otomatik versiyonlarda DSG çift kavramalı; ID elektriklilerde tek oranlı elektrikli aktarma.',
            'Volvo': 'Benzinli/hibrit versiyonlarda motora bağlı Geartronic otomatik; tam elektriklilerde tek oranlı aktarma.'
        };
        const gearboxFamilies = {
            'Abarth': 'Elektrikli redüksiyon veya benzinli DCT; iç kutu kodu versiyona özgüdür.',
            'Alfa Romeo': 'TCT / ZF 8HP aileleri; motor ve versiyona göre değişir.',
            'Audi': 'S tronic (DQ ailesi) / Tiptronic; kesin kod motor ve çekişe bağlıdır.',
            'BMW': '7 ileri DCT veya ZF 8HP ailesi; kesin kod motor/şanzıman varyantına bağlıdır.',
            'BYD': 'Elektrikli redüksiyon / DM-i hibrit DHT ailesi.',
            'Chery': 'DCT veya CVT; kesin üretici kutu kodu versiyona özgüdür.',
            'Citroën': 'e-DCS / EAT ailesi; kesin iç kutu kodu motor seçimine bağlıdır.',
            'Cupra': 'DSG (VAG DQ ailesi) veya elektrikli redüksiyon.',
            'Dacia': 'EDC veya multimode hibrit; kesin kod motor ve model yılına bağlıdır.',
            'DS Automobiles': 'e-DCS / EAT aileleri; kesin kod versiyona özgüdür.',
            'Fiat': 'DCT veya elektrikli redüksiyon.',
            'Ford': 'Modele göre 8F/10R otomatik ailesi, DCT veya elektrikli redüksiyon.',
            'Honda': 'CVT / e-CVT; transaks kodu motor ve hibrit sistemine bağlıdır.',
            'Hyundai': 'DCT / IVT-CVT / tork konvertörlü otomatik; kesin kod motor seçimine bağlıdır.',
            'Jaecoo': 'DCT ailesi; kesin kutu kodu Türkiye motor versiyonuna bağlıdır.',
            'Jeep': 'ZF 8HP ailesi veya modele özgü DCT / elektrikli redüksiyon.',
            'Kia': 'DCT / CVT / tork konvertörlü otomatik; kesin kod motor seçimine bağlıdır.',
            'KGM': 'Aisin 6 ileri otomatik ailesi; kesin kutu kodu motor ve pazara bağlıdır.',
            'Lexus': 'Toyota/Lexus e-CVT transaks ailesi veya çok vitesli otomatik.',
            'Lynk & Co': 'DCT / plug-in hibrit DHT ailesi; kesin kod versiyona bağlıdır.',
            'Maserati': 'ZF 8HP ailesi veya elektrikli aktarma.',
            'Mazda': 'Skyactiv-Drive 6 ileri otomatik ailesi; tam kutu kodu motor/şasiye bağlıdır.',
            'Mercedes-Benz': '7G-DCT / 9G-TRONIC (722.x ailesi) veya elektrikli aktarma.',
            'MG': 'CVT / DCT / otomatik transaks; kesin kod model ve motor seçimine bağlıdır.',
            'Mini': 'Steptronic DCT veya elektrikli aktarma; kesin kod varyanta bağlıdır.',
            'Nissan': 'Xtronic CVT / e-POWER redüksiyon / elektrikli aktarma.',
            'Omoda': 'DCT ailesi; kesin kutu kodu motor ve üretim serisine bağlıdır.',
            'Opel': 'e-DCT / ATN otomatik aileleri veya elektrikli redüksiyon.',
            'Peugeot': 'e-DCS / EAT ailesi veya elektrikli redüksiyon.',
            'Porsche': 'PDK / Tiptronic veya elektrikli aktarma.',
            'Renault': 'EDC / multimode hibrit veya elektrikli redüksiyon.',
            'SEAT': 'DSG (VAG DQ ailesi); kesin alt kod motor ve torka bağlıdır.',
            'Škoda': 'DSG (VAG DQ ailesi) veya elektrikli redüksiyon.',
            'Subaru': 'Lineartronic CVT veya elektrikli redüksiyon.',
            'Suzuki': 'CVT / 6AT aileleri; model versiyonuna bağlıdır.',
            'Tesla': 'Tek oranlı elektrikli redüksiyon; klasik şanzıman kodu bulunmaz.',
            'TOGG': 'Tek oranlı elektrikli redüksiyon; klasik şanzıman kodu bulunmaz.',
            'Toyota': 'K120 ailesi CVT veya P-serisi e-CVT hibrit transaks; tam kod modele göre değişir.',
            'Volkswagen': 'DSG (DQ ailesi) veya elektrikli redüksiyon; tam DQ kodu motora bağlıdır.',
            'Volvo': 'Geartronic / Aisin otomatik ailesi veya elektrikli redüksiyon.'
        };
        const transmissionNotice = 'Benzinli/dizel versiyonlara ait otomatik şanzıman bilgisi bu model yılı için ayrıca doğrulanmalıdır.';
        const excludedFuelPattern = /hybrid|hibrit|mhev|phev|plug-in|48v|electric|elektrik|e-tron|e-power|ioniq/i;

        function getCombustionInfo(brandName, model) {
            const modelInfo = modelTransmissions[brandName] && modelTransmissions[brandName][model];
            if (Array.isArray(modelInfo)) {
                const options = modelInfo.filter(option => !excludedFuelPattern.test(`${option.version} ${option.transmission}`));
                return options.length > 0 ? options : null;
            }
            return modelInfo && !excludedFuelPattern.test(modelInfo) ? modelInfo : null;
        }

        function getGearboxFamily(brandName, info) {
            const transmissions = Array.isArray(info)
                ? info.map(option => option.transmission).join(' ')
                : info || combustionTransmissionFamilies[brandName] || '';

            if (/sabit oranlı|tek oranlı|tek kademeli elektrikli|elektrikli redüksiyon/i.test(transmissions)
                && !/DCT|DSG|CVT|e-CVT|EDC|Tiptronic|Steptronic|9G-TRONIC|EAT/i.test(transmissions)) {
                return 'Tek oranlı elektrikli redüksiyon; klasik çok vitesli kutu kodu bulunmaz.';
            }
            if (brandName === 'BMW' && /8 ileri Steptronic/i.test(transmissions)) {
                return 'Olası aile: ZF 8HP. BMW Türkiye model listesi bu araçtaki kesin 8HP alt kodunu doğrulamıyor.';
            }
            if (brandName === 'BMW' && /7 ileri Steptronic çift kavramalı/i.test(transmissions)) {
                return 'BMW 7 ileri Steptronic DCT. İç üretici/kutu kodu doğrulanmadı; 7DCT300 gibi kodları bu araca kesin atamıyorum.';
            }
            if (/DSG/i.test(transmissions) && ['Volkswagen', 'Škoda', 'Cupra', 'SEAT'].includes(brandName)) {
                return 'VAG DSG / DQ ailesi. DQ200, DQ381 gibi olası kodlar motor/versiyonla doğrulanmadı; kesin kod değildir.';
            }
            if (/ZF 8HP/i.test(transmissions)) {
                return 'Olası aile: ZF 8HP. Bu model/motor eşleşmesinde kesin 8HP alt kodu doğrulanmadı.';
            }
            if (/Multidrive S/i.test(transmissions)) {
                if (/e-CVT/i.test(transmissions)) {
                    return '1.5 benzinli Multidrive S CVT + 1.8 Hybrid e-CVT. K313/K120 veya P-serisi iç kodlar bu araç varyantlarında doğrulanmadı.';
                }
                return 'Toyota Multidrive S CVT. K313/K120 gibi iç kodlar bu Türkiye motor versiyonunda doğrulanmadı.';
            }
            if (/e-CVT/i.test(transmissions)) {
                return 'e-CVT hibrit transaks; P610/P710 gibi iç kodlar bu araçta doğrulanmadı. Kayışlı CVT değildir.';
            }
            if (/9G-TRONIC/i.test(transmissions)) {
                return 'Mercedes 9G-TRONIC adı geçiyor; 725.x gibi kesin kutu kodu bu motor/üretim yılı için doğrulanmadı.';
            }
            if (/e-DCS|e-DCT/i.test(transmissions)) {
                return 'e-DCS/e-DCT çift kavramalı aile; tam üretici kutu kodu motor ve versiyonla doğrulanmalıdır.';
            }
            if (/CVT|Xtronic|Lineartronic/i.test(transmissions)) {
                return 'CVT ailesi; üretici iç kodu motor ve model yılına göre değişir.';
            }

            return combustionTransmissionFamilies[brandName] || 'Tam kutu kodu motor/şanzıman etiketi veya VIN ile doğrulanmalıdır.';
        }

        brandItems.forEach(item => {
            const brandName = item.textContent.trim();
            const toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'brand-toggle';
            toggle.textContent = brandName;
            toggle.setAttribute('aria-expanded', 'false');

            const details = document.createElement('div');
            details.className = 'brand-models';
            details.hidden = true;

            const heading = document.createElement('h3');
            heading.textContent = `${brandName} — 2000 sonrası model ve yakıt grupları`;
            details.append(heading);

            const brandInfo = turkeyModels[brandName];
            const fuelHistory = brandFuelHistory[brandName];
            if (fuelHistory) {
                item.classList.add('brand-fuel-item');
                details.append(createBrandFuelOverview(
                    fuelHistory.groups,
                    fuelHistory.note || brandFuelDataNote,
                    fuelHistory.sources || []
                ));
            } else if (brandInfo && brandInfo.models.length > 0) {
                const eligibleModels = brandInfo.models.filter(model => (combustionOnlyModels[brandName] || []).includes(model));
                if (eligibleModels.length === 0) {
                    const message = document.createElement('p');
                    message.textContent = 'Bu markanın listelenen Türkiye modelleri yalnızca elektrikli/hibrit seçeneklerden oluşuyor veya benzinli/dizel versiyonu doğrulanamadı.';
                    details.append(message);
                } else {
                const modelList = document.createElement('ul');
                eligibleModels.forEach(model => {
                    const modelItem = document.createElement('li');
                    modelItem.className = 'model-entry';

                    const modelButton = document.createElement('button');
                    modelButton.type = 'button';
                    modelButton.className = 'model-toggle';
                    modelButton.textContent = model;
                    modelButton.setAttribute('aria-expanded', 'false');

                    const transmissionDetails = document.createElement('div');
                    transmissionDetails.className = 'model-transmission';
                    transmissionDetails.hidden = true;
                    transmissionDetails.setAttribute('aria-live', 'polite');

                    const isAudiElectric = brandName === 'Audi' && /e-tron/i.test(model);
                    const transmissionTitle = document.createElement('h4');
                    transmissionTitle.textContent = `${model} — ${isAudiElectric ? 'elektrikli aktarma' : 'otomatik şanzıman (yaklaşık)'}`;
                    const verifiedInfo = getCombustionInfo(brandName, model);
                    const gearboxCode = document.createElement('p');
                    gearboxCode.className = 'gearbox-code';
                    gearboxCode.textContent = isAudiElectric
                        ? 'Tam elektrikli aktarma; klasik çok vitesli otomatik şanzıman bulunmaz.'
                        : `Şanzıman adı / olası kod ailesi: ${getGearboxFamily(brandName, verifiedInfo)}`;
                    const caveat = document.createElement('p');
                    caveat.className = 'transmission-caveat';
                    caveat.textContent = isAudiElectric
                        ? 'Elektrikli aktarma ayrıntısı model, çekiş seçeneği ve üretim yılına göre değişebilir; araç bilgilerini resmî teknik kaynakta doğrulayın.'
                        : 'Olası aileler kesin kutu kodu anlamına gelmez; model bazında doğrulanmamış kod tahminlerini kesin bilgi gibi kullanmayın. Tam kod şanzıman etiketi/VIN ve motor koduyla yetkili kaynakta doğrulanmalıdır.';
                    transmissionDetails.append(transmissionTitle, gearboxCode, caveat);

                    if (Array.isArray(verifiedInfo)) {
                        const optionsList = document.createElement('ul');
                        optionsList.className = 'transmission-options';

                        verifiedInfo.forEach(option => {
                            const optionItem = document.createElement('li');
                            const version = document.createElement('strong');
                            version.textContent = option.version;
                            const description = document.createElement('p');
                            description.textContent = option.transmission;
                            optionItem.append(version, description);
                            optionsList.append(optionItem);
                        });

                        transmissionDetails.append(optionsList);
                    } else {
                        const transmissionText = document.createElement('p');
                        const typicalInfo = combustionTransmissionFamilies[brandName];
                        transmissionText.textContent = isAudiElectric
                            ? 'Elektrik motoru ve aktarma ayrıntısı model, çekiş seçeneği ve üretim yılına göre değişebilir.'
                            : verifiedInfo || typicalInfo || transmissionNotice;
                        transmissionDetails.append(transmissionText);
                    }

                    modelButton.addEventListener('click', function() {
                        const isExpanded = modelButton.getAttribute('aria-expanded') === 'true';
                        modelButton.setAttribute('aria-expanded', String(!isExpanded));
                        transmissionDetails.hidden = isExpanded;
                    });

                    modelItem.append(modelButton, transmissionDetails);
                    modelList.append(modelItem);
                });
                details.append(modelList);
                }
            } else {
                const message = document.createElement('p');
                message.textContent = unavailableMessage;
                details.append(message);
            }

            item.replaceChildren(toggle, details);
            brandsList.append(item);

            toggle.addEventListener('click', function() {
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                details.hidden = isExpanded;
                brandsList.classList.toggle(
                    'brands-list-wide',
                    brandsList.querySelector('.brand-fuel-item .brand-toggle[aria-expanded="true"]') !== null
                );
            });
        });

        function filterBrands() {
            const query = brandSearch.value.trim().toLocaleLowerCase('tr-TR');
            let visibleCount = 0;

            brandItems.forEach(item => {
                const brandButton = item.querySelector('.brand-toggle');
                const matches = brandButton.textContent.toLocaleLowerCase('tr-TR').includes(query);
                item.hidden = !matches;
                if (!matches && brandButton.getAttribute('aria-expanded') === 'true') {
                    brandButton.setAttribute('aria-expanded', 'false');
                    brandButton.nextElementSibling.hidden = true;
                }
                if (matches) visibleCount += 1;
            });
            brandsList.classList.toggle(
                'brands-list-wide',
                brandsList.querySelector('.brand-fuel-item .brand-toggle[aria-expanded="true"]') !== null
            );

            brandsCount.textContent = `${visibleCount} marka listeleniyor`;
            brandsEmpty.hidden = visibleCount !== 0;
        }

        brandSearch.addEventListener('input', filterBrands);
        filterBrands();
    }

    const readMoreButtons = document.querySelectorAll('.read-more');
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detail = document.getElementById(button.getAttribute('aria-controls'));
            if (!detail) return;

            const isExpanded = button.getAttribute('aria-expanded') === 'true';
            if (!isExpanded) {
                readMoreButtons.forEach(otherButton => {
                    if (otherButton === button) return;
                    const otherDetail = document.getElementById(otherButton.getAttribute('aria-controls'));
                    if (!otherDetail) return;

                    otherDetail.hidden = true;
                    otherButton.setAttribute('aria-expanded', 'false');
                    otherButton.textContent = 'Devamını Oku';
                });
            }

            detail.hidden = isExpanded;
            button.setAttribute('aria-expanded', String(!isExpanded));
            button.textContent = isExpanded ? 'Devamını Oku' : 'Daha Az Göster';
        });
    });

    // Scroll sırasında navbar animasyonu
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            // Aşağı scroll
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else {
            // Yukarı scroll
            navbar.style.boxShadow = 'none';
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });

    // AOS (Animate On Scroll) benzeri efekt
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Blog kartlarını observe et
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    const kategoriItems = document.querySelectorAll('.kategori-item');
    kategoriItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const guideList = document.getElementById('transmission-faults-list');
    const guideSearch = document.getElementById('transmission-fault-search');
    const guideType = document.getElementById('transmission-fault-type');
    const guideCount = document.querySelector('.transmission-faults-count');
    if (!guideList || !guideSearch || !guideType || !guideCount) return;

    const guides = [
        {
            type: 'Kuru çift kavramalı DSG (VAG DQ200)',
            examples: 'Bazı Volkswagen Golf, Polo, T-Roc; SEAT, Škoda ve Audi modellerinin belirli motor/yıl seçenekleri.',
            faults: [
                {
                    title: 'Kalkışta titreme veya silkeleme',
                    symptoms: 'Özellikle dur-kalkta, geri viteste veya düşük hızda silkelenme.',
                    causes: 'Kavrama aşınması/kirlenmesi, kavrama adaptasyon değerleri veya motor-takoz kaynaklı titreşim benzer belirti oluşturabilir.',
                    checks: 'Önce motor teklemesi ve takozlar dışlanır; DSG verileri, kavrama toleransları ve adaptasyon üretici prosedürüyle kontrol edilir. Kavrama ancak ölçümle doğrulanırsa değerlendirilir.'
                },
                {
                    title: 'Vites seçmeme, yanıp sönen vites göstergesi veya acil mod',
                    symptoms: 'İleri/geri vitesin geç devreye girmesi, bazı viteslerin kaybolması ya da uyarı lambası.',
                    causes: 'Mekatronik kumanda/basınç sorunu, besleme veya tesisat problemi, kavrama ya da sensör arızası olasılıkları vardır.',
                    checks: 'Şanzıman kontrol ünitesini üretici uyumlu cihazla tarayın; voltaj, soket/tesisat, canlı basınç ve seçilen vites verilerini kontrol edin. Kodun tam tanımı kutu kodu ve yazılımla doğrulanmalıdır.'
                }
            ]
        },
        {
            type: 'Islak çift kavramalı DSG (VAG DQ250/DQ381 ve benzerleri)',
            examples: 'Bazı Golf GTI/TDI, Passat, Tiguan, Audi, SEAT ve Škoda versiyonları; kesin alt kod motora/yıla bağlıdır.',
            faults: [
                {
                    title: 'Vites geçişinde vuruntu, gecikme veya kayma',
                    symptoms: 'Düşük ya da yüksek viteslerde sert geçiş, devir yükselirken hızlanmanın gecikmesi.',
                    causes: 'Yanlış/eskimiş yağ veya seviye, adaptasyon, kavrama aşınması, hidrolik kumanda ya da mekatronik arızaları araştırılır.',
                    checks: 'Önce şanzıman koduna uygun yağ prosedürü ve seviye, kaçaklar, kontrol ünitesi kayıtları ve kavrama kayma verisi incelenir. Yağ türü/seviye kontrolü modele özel sıcaklık ve ölçüm yöntemiyle yapılır.'
                },
                {
                    title: 'Acil mod veya belirli viteslerin devre dışı kalması',
                    symptoms: 'Vites göstergesi uyarısı, sınırlı vites seçimi veya güç aktarımının kesilmesi.',
                    causes: 'Sensör/tesisat, besleme, mekatronik hidrolik kumanda veya mekanik kavrama/dişli sorunu olabilir.',
                    checks: 'Tüm modüllerdeki üreticiye özgü kodlar, canlı sensör değerleri ve kablo/soketler kontrol edilir. P0716, Ross-Tech tarafından 02E bağlamında giriş hızı sensörü/tesisat sorunu için belgelenmiştir; tek başına revizyon gerekçesi değildir.'
                }
            ]
        },
        {
            type: 'Diğer çift kavramalı şanzımanlar (DCT, EDC, PDK, TCT, PowerShift)',
            examples: 'Renault EDC, Alfa Romeo TCT, Porsche PDK, bazı BMW DCT ve Ford PowerShift uygulamaları. Kuru/ıslak tasarım ve üretici kodu değişir.',
            faults: [
                {
                    title: 'Kalkışta titreme ve düşük hızda kararsızlık',
                    symptoms: 'Kavrama kavrama noktasında sarsıntı, park manevrasında vuruntu veya ısınınca kötüleşen kalkış.',
                    causes: 'Kavrama aşınması/adaptasyonu, yağ-kumanda sorunları (ıslak tipte) veya motor/takoz kaynaklı titreşim.',
                    checks: 'Önce şanzımanın kuru/ıslak tipi ve kodu teyit edilir. Üretici taraması, kavrama aşınma/adaptasyon değerleri, varsa yağ seviyesi ve motor çalışma düzgünlüğü birlikte değerlendirilir.'
                },
                {
                    title: 'Vites geçişinin kesilmesi veya koruma modu',
                    symptoms: 'Vites seçiminin kaybolması, uyarı mesajı veya sıcaklıkla artan geçiş gecikmesi.',
                    causes: 'Aktüatör/mekatronik, sensör-kablo, besleme, kavrama veya uygun olmayan yağ/ısınma kaynaklı olabilir.',
                    checks: 'Üreticiye özgü arıza kayıtları ve canlı değerler okunur; şarj voltajı, soketler, sıcaklık ve kavrama komutları test edilir. Başka markanın kod/onarım prosedürü uygulanmamalıdır.'
                }
            ]
        },
        {
            type: 'Tork konvertörlü otomatik (ZF 8HP, EAT/AT, 7G/9G ve benzerleri)',
            examples: 'BMW/Maserati/Jeep ZF 8HP olasılıkları; Mercedes 7G/9G; Peugeot-Citroën EAT ve diğer klasik otomatikler. Kodlar araç bazında teyit edilir.',
            faults: [
                {
                    title: 'Vites geçişinde sertlik, gecikme veya devir kaçırma',
                    symptoms: 'D-R geçişinin gecikmesi, vites değişiminde vuruntu ya da hızlanırken devir yükselmesi.',
                    causes: 'Yağ seviyesi/özelliği ve kaçak, solenoid/valf gövdesi basıncı, adaptasyon veya iç kavrama aşınması olasılıkları.',
                    checks: 'Doğru şanzıman koduna uygun yağ ve sıcaklık prosedürüyle seviye, hata kayıtları, giriş/çıkış devirleri ve basınç kontrol edilir. Yağ değişimi/flush işlemi kutu üreticisinin talimatı olmadan yapılmamalıdır.'
                },
                {
                    title: 'Sabit hızda titreme veya konvertör kilitleme sorunu',
                    symptoms: 'Hafif gazda sabit hızda titreşim ya da kilitleme sırasında motor devrinde dalgalanma.',
                    causes: 'Motor kaynaklı tekleme, uygun olmayan/bozulmuş yağ, konvertör kilitleme kavraması veya hidrolik kumanda incelenir.',
                    checks: 'Önce motor teklemesi dışlanır; TCC komutu ile gerçek kayma devri, yağ durumu ve üretici testleri karşılaştırılır. Konvertör/türbin onarımı yalnızca doğrulayıcı testlerden sonra seçilir.'
                }
            ]
        },
        {
            type: 'Kayış/zincirli CVT (Xtronic, Lineartronic, Multidrive S ve benzerleri)',
            examples: 'Nissan Xtronic, Subaru Lineartronic ve bazı Toyota/Honda benzinli CVT uygulamaları; üretici iç kodu ve tasarım farklıdır.',
            faults: [
                {
                    title: 'Hızlanmada devir yükselmesi, uğultu veya titreme',
                    symptoms: 'Motor devri artarken hızın beklenen biçimde artmaması, uğultu veya kalkışta sarsıntı.',
                    causes: 'Yanlış/eskimiş CVT yağı, seviye/ısı sorunu, hidrolik basınç, kasnak-kayış/zincir aşınması veya motor kaynaklı olabilir.',
                    checks: 'CVT olduğu ve doğru yağ spesifikasyonu koddan doğrulanır; kaçak, sıcaklık, basınç ve üretici tarama verileri incelenir. Klasik ATF kullanılmaz; her CVT aynı kayış/zincir düzeninde değildir.'
                },
                {
                    title: 'Aşırı ısınma uyarısı veya koruma modu',
                    symptoms: 'Güç kısıtlaması, uyarı mesajı ya da uzun yükte belirgin performans düşüşü.',
                    causes: 'Aşırı yük/ısı, soğutucu akış sorunu, yağ seviyesi veya basınç sorunu olasıdır.',
                    checks: 'Aracı zorlamayın; sıcaklık sensörü, soğutucu devresi, kaçak ve doğru seviye üretici prosedürüyle incelenir. Aşırı ısınma nedeni bulunmadan yalnız yağ değişimi yeterli kabul edilmez.'
                }
            ]
        },
        {
            type: 'Hibrit e-CVT / güç bölüştürücülü transaks',
            examples: 'Toyota/Lexus hibrit sistemleri ve bazı diğer hibrit güç aktarma düzenleri. Kayışlı CVT ile aynı yapı değildir.',
            faults: [
                {
                    title: 'Hibrit sistem uyarısı veya güç kaybı',
                    symptoms: 'Gösterge uyarısı, içten yanmalı motorun olağandışı çalışması ya da çekişin kısıtlanması.',
                    causes: 'Sorun e-CVT mekanik dişli takımından değil; hibrit batarya, inverter, soğutma, yüksek voltaj bağlantıları veya kontrol sisteminden de kaynaklanabilir.',
                    checks: 'Hibrit uyumlu cihazla tüm kontrol üniteleri taranır; yüksek voltajlı parçalara kullanıcı müdahale etmemelidir. Eğitimli teknisyen üretici güvenlik ve izolasyon prosedürünü uygular.'
                },
                {
                    title: 'Aktarma bölgesinden uğultu veya mekanik ses',
                    symptoms: 'Hıza/yüke bağlı ses ya da yağ kaçağı.',
                    causes: 'Redüksiyon dişlileri/rulmanları, bağlantılar, lastik-rulman veya elektrik motoru sesleri birbirine karışabilir.',
                    checks: 'Sesin hangi hız ve yükte oluştuğu belirlenir; lastik ve teker rulmanı kaynakları dışlanır, transaks yağı/kaçak ve hibrit sistem verileri servis prosedürüyle incelenir.'
                }
            ]
        },
        {
            type: 'Hibrit DHT / multimode aktarma',
            examples: 'BYD DM-i, Renault E-Tech ve bazı plug-in hibritlerde kullanılan modele özgü hibrit aktarma düzenleri; yapıları birbirinin aynısı değildir.',
            faults: [
                {
                    title: 'Hibrit sistem uyarısı veya benzinli-elektrikli geçişte kesinti',
                    symptoms: 'Uyarı lambası, güç kısıtlaması veya motorlar arası geçiş sırasında sarsıntı.',
                    causes: 'Yüksek voltaj bataryası, inverter, elektrik motoru, soğutma, kavrama/aktüatör veya yazılım kaynaklı olabilir.',
                    checks: 'Tam model ve üretici sistem kodu tespit edilir; tüm hibrit modüller uyumlu cihazla taranır. Yüksek voltaj bileşenlerine kullanıcı müdahale etmemeli; genel DCT/CVT prosedürü doğrudan uygulanmamalıdır.'
                },
                {
                    title: 'Aktarma sesi veya sürüş modunun devre dışı kalması',
                    symptoms: 'Uğultu, geçişte vuruntu ya da yalnızca belirli çalışma modlarının kullanılamaması.',
                    causes: 'Hibrit dişli/kavrama düzeni, kontrol aktüatörü, soğutma sistemi veya sesin kaynağına göre başka aktarma bileşenleri incelenir.',
                    checks: 'Arıza kayıtları, hibrit çalışma verileri ve üretici test planı izlenir; yapı ve arıza kodları markalar arasında ortak kabul edilmez.'
                }
            ]
        },
        {
            type: 'Elektrikli araç tek oranlı redüksiyon',
            examples: 'Tesla, TOGG ve birçok tam elektrikli otomobil. Klasik çok vitesli otomatik şanzıman değildir.',
            faults: [
                {
                    title: 'Tahrik sistemi uyarısı veya çekiş kısıtlaması',
                    symptoms: 'Güç kısıtlaması ya da tahrik sistemi uyarısı.',
                    causes: 'Yüksek voltaj bataryası, inverter, motor, soğutma veya kontrol sistemi arızaları redüksiyon kutusu arızasıyla karıştırılmamalıdır.',
                    checks: 'Markaya uygun teşhis cihazıyla güç aktarma ve batarya kayıtları okunur. Yüksek voltaj sistemine yalnız yetkili/eğitimli teknisyen müdahale eder.'
                },
                {
                    title: 'Hıza bağlı uğultu, tıkırtı veya yağ kaçağı',
                    symptoms: 'Hız arttıkça değişen aktarma sesi veya redüksiyon ünitesi çevresinde kaçak.',
                    causes: 'Redüksiyon dişli/rulmanları, akslar, teker rulmanı veya lastik sesi olabilir.',
                    checks: 'Ses yük ve yol hızına göre ayrıştırılır; aks, teker rulmanları, bağlantılar ve redüksiyon ünitesi üretici talimatıyla incelenir. Elektrikli motor sesi/normal çalışma sesiyle karşılaştırılmalıdır.'
                }
            ]
        }
    ];

    guides.forEach(guide => {
        const option = document.createElement('option');
        option.value = guide.type;
        option.textContent = guide.type;
        guideType.append(option);
    });

    function renderGuides() {
        const query = guideSearch.value.trim().toLocaleLowerCase('tr-TR');
        const selectedType = guideType.value;
        const matches = guides.filter(guide => {
            if (selectedType && guide.type !== selectedType) return false;
            const searchableText = `${guide.type} ${guide.examples} ${guide.faults.map(fault =>
                `${fault.title} ${fault.symptoms} ${fault.causes} ${fault.checks}`).join(' ')}`.toLocaleLowerCase('tr-TR');
            return !query || searchableText.includes(query);
        });

        guideList.replaceChildren();
        matches.forEach(guide => {
            const article = document.createElement('article');
            article.className = 'transmission-fault-card';
            const cardHeader = document.createElement('div');
            cardHeader.className = 'transmission-fault-card-header';
            const number = document.createElement('span');
            number.className = 'transmission-fault-number';
            number.textContent = String(guides.indexOf(guide) + 1).padStart(2, '0');
            const heading = document.createElement('h3');
            heading.textContent = guide.type;
            cardHeader.append(number, heading);
            const examples = document.createElement('p');
            examples.className = 'transmission-fault-examples';
            examples.textContent = `Araç örnekleri: ${guide.examples}`;
            const faultList = document.createElement('div');
            faultList.className = 'transmission-fault-items';
            guide.faults.forEach((fault, faultIndex) => {
                const item = document.createElement('section');
                item.className = 'transmission-fault-item';
                const title = document.createElement('h4');
                const issueNumber = document.createElement('span');
                issueNumber.className = 'transmission-fault-issue-number';
                issueNumber.textContent = `${faultIndex + 1}.`;
                title.append(issueNumber, document.createTextNode(` ${fault.title}`));
                item.append(title);
                [
                    ['Belirti', fault.symptoms],
                    ['Olası nedenler', fault.causes],
                    ['Kontrol ve çözüm yolu', fault.checks]
                ].forEach(([label, text]) => {
                    const paragraph = document.createElement('p');
                    const strong = document.createElement('strong');
                    strong.textContent = `${label}: `;
                    paragraph.append(strong, document.createTextNode(text));
                    item.append(paragraph);
                });
                faultList.append(item);
            });
            article.append(cardHeader, examples, faultList);
            guideList.append(article);
        });

        guideCount.textContent = matches.length
            ? `${matches.length} şanzıman türü listeleniyor. Sıra: çift kavramalılar, tork konvertörlü, CVT ve elektrifikasyonlu aktarmalar.`
            : 'Aramanızla eşleşen şanzıman arıza rehberi bulunamadı.';
    }

    guideSearch.addEventListener('input', renderGuides);
    guideType.addEventListener('change', renderGuides);
    renderGuides();
});
