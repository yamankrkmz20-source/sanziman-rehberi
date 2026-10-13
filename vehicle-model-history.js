window.vehicleModelHistory = {
    BMW: {
        groups: {
            dogrulanamadi: [
                { model: '1 Serisi' },
                { model: '2 Serisi' },
                { model: '3 Serisi' },
                { model: '4 Serisi' },
                { model: '5 Serisi' },
                { model: '6 Serisi' },
                { model: '7 Serisi' },
                { model: '8 Serisi' },
                { model: 'X ailesi' },
                { model: 'Z ailesi' }
            ]
        },
        note: 'Borusan Oto Türkiye fiyat listesinde model aileleri yer alıyor; bu kaynak geçmiş satış yıllarını ve yakıt eşleşmelerini doğrulamıyor.',
        sources: [
            { label: 'Borusan Oto BMW — fiyat listesi', url: 'https://borusanoto.bmw.com.tr/fiyat-listesi' }
        ]
    },
    Bentley: {
        groups: {
            dogrulanamadi: [
                { model: 'Continental GT' },
                { model: 'Flying Spur' },
                { model: 'Bentayga' }
            ]
        },
        note: 'Türkiye’deki Bentley/Doğuş Oto kanalı doğrulanıyor; bu kaynaklar tarihsel satış dönemlerini ve model-yakıt eşleşmelerini göstermiyor.',
        sources: [
            { label: 'Bentley Türkiye', url: 'https://www.bentleymotors.com/en/world-of-bentley/bentley-in-your-country/turkey.html' },
            { label: 'Doğuş Oto', url: 'https://www.dogusoto.com.tr/' }
        ]
    },
    Daihatsu: {
        groups: {
            benzin: [
                { model: 'Cuore' },
                { model: 'Sirion' },
                { model: 'YRV' },
                { model: 'Terios' },
                { model: 'Copen' },
                { model: 'Materia' }
            ]
        },
        note: 'Model adları Türkiye’ye ait eski site arşivinde görülüyor; kesin satış yılları ve her modelin donanımları doğrulanamadı.',
        sources: [
            { label: 'Daihatsu Türkiye — eski site arşivi', url: 'https://web.archive.org/web/*/daihatsu.com.tr/*' }
        ]
    },
    Geely: {
        groups: {
            benzin: [
                { model: 'MK' },
                { model: 'CK' },
                { model: 'FC / Emgrand' },
                { model: 'Panda' }
            ]
        },
        note: 'Türkiye’deki eski Geely sitesi model ailelerinin pazar geçmişini destekliyor; nesil ve satış dönemi ayrıntıları doğrulanamadı.',
        sources: [
            { label: 'Geely Türkiye — eski site arşivi', url: 'https://web.archive.org/web/*/geely.com.tr/*' },
            { label: 'Geely', url: 'https://www.geely.com/' }
        ]
    },
    Honda: {
        groups: {
            hibrit: [
                { model: 'HR-V', details: ['e:HEV hibrit olarak Türkiye model sayfasında listeleniyor.'] }
            ]
        },
        note: 'HR-V için Türkiye kaynağında e:HEV ibaresi doğrulanıyor; diğer yakıt/nesil seçenekleri bu kaynakla doğrulanmadı.',
        sources: [
            { label: 'Honda Türkiye — modeller', url: 'https://www.honda.com.tr/otomobil/modeller' }
        ]
    },
    Lada: {
        groups: {
            benzin: [
                { model: 'Niva / LADA 4x4', details: ['3 ve 5 kapı / Urban adlarıyla listelenen benzinli aile.'] }
            ]
        },
        note: 'Türkiye fiyat-listesi sayfasında Niva ailesi listeleniyor; satış/stok güncelliği ve geçmiş dönem aralığı kesin değil.',
        sources: [
            { label: 'LADA Türkiye — fiyat listesi', url: 'https://lada.gen.tr/fiyat-listesi' }
        ]
    },
    'Land Rover': {
        groups: {
            dogrulanamadi: [
                { model: 'Range Rover' },
                { model: 'Range Rover Sport' },
                { model: 'Range Rover Evoque' },
                { model: 'Range Rover Velar' },
                { model: 'Defender' },
                { model: 'Discovery' },
                { model: 'Discovery Sport' }
            ]
        },
        note: 'Türkiye resmî model sayfalarında model aileleri bulunuyor; her model yılına ait yakıt ve motor seçeneği burada doğrulanmadı.',
        sources: [
            { label: 'Land Rover Türkiye — tüm araçlar', url: 'https://www.landrover.com.tr/vehicles/our-vehicles' },
            { label: 'Defender Türkiye', url: 'https://www.landrover.com.tr/defender/overview' },
            { label: 'Discovery Türkiye', url: 'https://www.landrover.com.tr/discovery/overview' },
            { label: 'Range Rover Türkiye', url: 'https://www.landrover.com.tr/range-rover/overview' }
        ]
    },
    Leapmotor: {
        groups: {
            elektrikli: [
                { model: 'T03', details: ['Tam elektrikli model.'] },
                { model: 'C10', details: ['Tam elektrikli sürüm.'] }
            ],
            hibrit: [
                { model: 'C10 REEV', details: ['Menzil uzatıcı elektrikli sürüm; Türkiye’deki bulunurluk versiyon/yıla göre değişebilir.'] }
            ]
        },
        note: 'Model ve aktarma bilgileri Leapmotor Türkiye sayfalarında listelenen sürümlere göredir; satış dönemi/versiyon kapsamı değişebilir.',
        sources: [
            { label: 'Leapmotor Türkiye', url: 'https://leapmotortr.com/' }
        ]
    },
    Mitsubishi: {
        groups: {
            dogrulanamadi: [
                { model: 'ASX' },
                { model: 'Lancer' },
                { model: 'Colt' },
                { model: 'Outlander' }
            ],
            hibrit: [
                { model: 'Outlander PHEV', details: ['Şarj edilebilir hibrit; yerel satış dönemi ve model yılı ayrıca doğrulanmalı.'] }
            ]
        },
        note: 'Türkiye model kaynaklarında ASX, Lancer, Colt ve Outlander aileleri yer alıyor; tarihsel motor/yakıt eşleşmeleri tam olarak doğrulanmadı.',
        sources: [
            { label: 'Mitsubishi Motors Türkiye', url: 'https://www.mitsubishi-motors.com.tr/modeller' },
            { label: 'Arabalar.com.tr — Mitsubishi', url: 'https://www.arabalar.com.tr/mitsubishi' }
        ]
    },
    Nissan: {
        groups: {
            dogrulanamadi: [
                { model: 'Micra' },
                { model: 'Juke' },
                { model: 'Qashqai' },
                { model: 'X-Trail' }
            ]
        },
        note: 'Nissan Türkiye kaynaklarında model aileleri bulunuyor; verilen yerel kaynaklar tarihsel satış dönemini ve motor/yakıt eşleşmelerini göstermiyor.',
        sources: [
            { label: 'Nissan Türkiye', url: 'https://www.nissan.com.tr/' }
        ]
    },
    SEAT: {
        groups: {
            dogrulanamadi: [
                { model: 'Ibiza' },
                { model: 'Arona' },
                { model: 'León' },
                { model: 'Ateca' }
            ]
        },
        note: 'SEAT Türkiye sayfasında model aileleri listeleniyor; bu kaynak geçmiş dönemleri veya her yakıt seçeneğini doğrulamıyor.',
        sources: [
            { label: 'SEAT Türkiye', url: 'https://www.seat.com.tr/' }
        ]
    },
    smart: {
        groups: {
            dogrulanamadi: [
                { model: 'fortwo' },
                { model: 'forfour' }
            ]
        },
        note: 'Türkiye’deki yetkili satıcı model listesinde fortwo/forfour aileleri görülüyor; satış yılları ve yakıt seçenekleri doğrulanmadı.',
        sources: [
            { label: 'Mengerler — smart modelleri', url: 'https://www.mengerler.com/smart/otomobil/liste' }
        ]
    },
    SWM: {
        groups: {
            benzin: [
                { model: 'G01' },
                { model: 'G01F' }
            ]
        },
        note: 'SWM Türkiye kaynaklarında G01/G01F benzinli model ailesi olarak listeleniyor; motor ve satış dönemi versiyona göre değişebilir.',
        sources: [
            { label: 'SWM Türkiye', url: 'https://swmtr.com/' }
        ]
    },
    TOGG: {
        groups: {
            elektrikli: [
                { model: 'T10X', details: ['Tam elektrikli; resmî Türkiye ürün sayfasında doğrulanıyor.'] }
            ]
        },
        note: 'T10X modeli ve elektrikli aktarma bilgisi TOGG Türkiye ürün sayfasında yer alıyor.',
        sources: [
            { label: 'TOGG Türkiye — T10X', url: 'https://www.togg.com.tr/t10x' }
        ]
    }
};
