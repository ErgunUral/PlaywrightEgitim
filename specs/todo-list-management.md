# Todo Listesi Yönetimi — Test Planı

## Uygulama

- **URL:** https://demo.playwright.dev/todomvc
- **Uygulama:** Playwright TodoMVC demo
- **Amaç:** Kullanıcının todo oluşturma, düzenleme, durum değiştirme, filtreleme ve silme işlemlerini; ayrıca liste sayacı ve kalıcılığı doğrulamak.

## Test yaklaşımı

- Her senaryoyu diğerlerinden bağımsız, temiz bir tarayıcı bağlamında çalıştırın. Yenileme ve kalıcılık kontrollerinde aynı bağlamı kullanın.
- Senaryolarda benzersiz görev başlıkları kullanın; yalnızca testin oluşturduğu görevleri doğrulayın.
- Adımları Arrange, Act ve Assert olarak uygulayın. Klavye işlemlerinde Enter ile kaydedin, düzenleme iptali için Escape kullanın.
- Uygulamanın yerel depolama durumuna bağlı testlerde, test başında ilgili todo verisini temizleyin; testler arasında uygulama durumunun paylaşılmasına izin vermeyin.

## Locator stratejisi

Öncelik sırasıyla erişilebilir kullanıcı arayüzü locator'larını kullanın. Liste öğesine ait işlemlerde önce öğeyi görev başlığına göre bulun, ardından eylemi bu öğe kapsamında sorgulayın.

| Arayüz öğesi | Tercih edilen locator |
|---|---|
| Yeni görev girişi | `getByPlaceholder('What needs to be done?')` |
| Görev başlığı | `getByTestId('todo-title')` ve ilgili görev metni |
| Görev satırı | `getByRole('listitem').filter({ hasText: '...' })` |
| Görevi tamamlama kontrolü | İlgili satır içindeki `getByRole('checkbox', { name: 'Toggle Todo' })` |
| Tümünü tamamlama kontrolü | `getByRole('checkbox', { name: 'Mark all as complete' })` |
| Görev silme | İlgili satır içindeki `getByRole('button', { name: 'Delete' })` |
| Liste filtresi | `getByRole('link', { name: 'All' })`, `Active`, `Completed` |
| Tamamlananları temizleme | `getByRole('button', { name: 'Clear completed' })` |
| Kalan görev sayacı | `getByText(/\d+ items? left/)` |

Erişilebilir ad veya rol uygulamada bulunmuyorsa, `todo-title` gibi mevcut test kimliğini kullanın. Kırılgan CSS seçicilerinden, XPath'ten ve DOM hiyerarşisine dayalı konumsal locator'lardan kaçının.

## Senaryo matrisi

| ID | Kapsam | Tür | Öncelik |
|---|---|---|---|
| TLM-01 | Boş listenin açılması | Pozitif | P1 |
| TLM-02 | Tek görev oluşturma ve sayaç | Pozitif | P1 |
| TLM-03 | Boş ve yalnızca boşluk içeren görevlerin reddi | Negatif / sınır | P1 |
| TLM-04 | Görev başlığındaki kenar boşluklarının kırpılması | Sınır | P2 |
| TLM-05 | Aynı başlığa sahip birden fazla görevin yönetimi | Sınır | P2 |
| TLM-06 | Görevi tamamlandı ve etkin durumları arasında değiştirme | Pozitif | P1 |
| TLM-07 | Tüm görevleri topluca tamamlama ve etkinleştirme | Pozitif | P2 |
| TLM-08 | Görev başlığını düzenleyip kaydetme | Pozitif | P1 |
| TLM-09 | Düzenlemeyi Escape ile iptal etme | Negatif | P2 |
| TLM-10 | Düzenlenen başlığı boş bırakıp kaydetme | Sınır | P2 |
| TLM-11 | All, Active ve Completed filtreleri | Pozitif | P1 |
| TLM-12 | Tamamlanan görevleri temizleme | Pozitif / sınır | P1 |
| TLM-13 | Tek bir görevi silme | Pozitif | P1 |
| TLM-14 | Yenileme sonrasında görev ve durumların korunması | Pozitif | P1 |

## Ayrıntılı senaryolar

### TLM-01 — Boş listenin açılması

**Arrange**
- Yeni ve todo verisi bulunmayan bir tarayıcı bağlamı oluşturun.

**Act**
- Uygulamayı açın.

**Assert**
- `todos` başlığı ve `What needs to be done?` görev giriş alanı görünür ve kullanılabilirdir.
- Görev listesi, sayaç ve görev işlemleri boş listede görünmez.

### TLM-02 — Tek görev oluşturma ve sayaç

**Arrange**
- Temiz bir bağlamda uygulamayı açın.

**Act**
- Giriş alanına `Alışveriş yap` yazıp Enter'a basın.

**Assert**
- `Alışveriş yap` başlıklı tek görev görünür ve etkin durumdadır.
- Giriş alanı temizlenir, kalan görev sayacı `1 item left` gösterir.

### TLM-03 — Boş ve yalnızca boşluk içeren görevlerin reddi

**Arrange**
- Temiz bir bağlamda uygulamayı açın.

**Act**
- Giriş alanını boş bırakıp Enter'a basın.
- Ardından yalnızca boşluklardan oluşan metni girip Enter'a basın.

**Assert**
- Her iki işlemden sonra da görev oluşturulmaz; liste boş kalır ve görev sayacı gösterilmez.

### TLM-04 — Görev başlığındaki kenar boşluklarının kırpılması

**Arrange**
- Temiz bir bağlamda uygulamayı açın.

**Act**
- Başında ve sonunda boşluk bulunan `  Raporu gönder  ` başlığını girip Enter'a basın.

**Assert**
- Görev `Raporu gönder` başlığıyla görünür; başlığın başında veya sonunda boşluk yoktur.
- Sayaç `1 item left` gösterir.

### TLM-05 — Aynı başlığa sahip birden fazla görevin yönetimi

**Arrange**
- Temiz bir bağlamda uygulamayı açın.

**Act**
- `Tekrarlanan görev` başlıklı iki görev ekleyin.
- İkinci görev satırındaki `Toggle Todo` kontrolünü işaretleyin.

**Assert**
- Aynı başlıklı iki ayrı görev satırı bulunur.
- Yalnızca seçilen satır tamamlandı olur; sayaç `1 item left` gösterir.

### TLM-06 — Görevi tamamlandı ve etkin durumları arasında değiştirme

**Arrange**
- `Durumu değiştir` başlıklı etkin bir görev oluşturun.

**Act**
- Görev satırındaki `Toggle Todo` kontrolünü işaretleyin, sonra işaretini kaldırın.

**Assert**
- İlk işlemden sonra görev tamamlandı, etkin sayısı sıfırdır.
- İkinci işlemden sonra görev etkin olur ve sayaç `1 item left` değerine döner.

### TLM-07 — Tüm görevleri topluca tamamlama ve etkinleştirme

**Arrange**
- İki ayrı etkin görev oluşturun.

**Act**
- `Mark all as complete` kontrolünü işaretleyin, ardından işaretini kaldırın.

**Assert**
- İşaretliyken iki görev de tamamlanmış ve kalan görev sayısı sıfırdır.
- İşaret kaldırıldığında iki görev de etkinleşir ve sayaç iki öğeyi gösterir.

### TLM-08 — Görev başlığını düzenleyip kaydetme

**Arrange**
- `Alışveriş yap` başlıklı bir görev oluşturun.

**Act**
- Görev başlığına çift tıklayın.
- Düzenleme alanındaki metni `Market alışverişi` ile değiştirip Enter'a basın.

**Assert**
- Düzenleme alanı kapanır; yeni başlık görünür ve eski başlık görünmez.
- Görev sayısı değişmez.

### TLM-09 — Düzenlemeyi Escape ile iptal etme

**Arrange**
- `Değişmeden kalacak` başlıklı bir görev oluşturun.

**Act**
- Görev başlığına çift tıklayın, metni `Geçici değişiklik` olarak değiştirin ve Escape'e basın.

**Assert**
- Düzenleme alanı kapanır ve görev başlığı `Değişmeden kalacak` olarak kalır.

### TLM-10 — Düzenlenen başlığı boş bırakıp kaydetme

**Arrange**
- `Silinecek düzenleme` başlıklı bir görev oluşturun.

**Act**
- Görev başlığına çift tıklayın, düzenleme alanındaki metni tamamen silin ve Enter'a basın.

**Assert**
- Boş başlıklı görev listede kalmaz.
- Kalan görev sayısı sıfır olur; boş listeye ait liste ve sayaç görünürlük kuralları sağlanır.

### TLM-11 — All, Active ve Completed filtreleri

**Arrange**
- `Etkin görev` ve `Tamamlanan görev` başlıklı iki görev oluşturun.
- `Tamamlanan görev` satırındaki tamamlama kontrolünü işaretleyin.

**Act**
- Sırasıyla `Active`, `Completed` ve `All` filtrelerine tıklayın.

**Assert**
- `Active` filtresinde yalnızca `Etkin görev`, `Completed` filtresinde yalnızca `Tamamlanan görev` görünür.
- `All` filtresinde iki görev de görünür.
- Filtre değiştirmek görevleri silmez veya durumlarını değiştirmez; kalan görev sayacı bir etkin görevi gösterir.

### TLM-12 — Tamamlanan görevleri temizleme

**Arrange**
- Bir etkin ve bir tamamlanmış görev oluşturun.

**Act**
- `Clear completed` düğmesinin görünür olduğunu doğrulayın ve tıklayın.

**Assert**
- Tamamlanmış görev kaldırılır, etkin görev kalır ve sayaç değişmeden `1 item left` gösterir.
- Temizleme sonrası tamamlanmış görev kalmadığı için `Clear completed` düğmesi görünmez.

### TLM-13 — Tek bir görevi silme

**Arrange**
- `Silinecek görev` ve `Kalacak görev` başlıklı iki etkin görev oluşturun.

**Act**
- `Silinecek görev` satırı içindeki `Delete` düğmesine tıklayın.

**Assert**
- Yalnızca `Silinecek görev` kaldırılır.
- `Kalacak görev` görünür kalır ve sayaç `1 item left` gösterir.

### TLM-14 — Yenileme sonrasında görev ve durumların korunması

**Arrange**
- Aynı tarayıcı bağlamında `Etkin görev` ve `Tamamlanan görev` başlıklı görevler oluşturun.
- İkinci görevi tamamlayın.

**Act**
- Sayfayı yenileyin.

**Assert**
- Her iki görev de listede görünür.
- `Etkin görev` etkin, `Tamamlanan görev` tamamlanmış olarak kalır.
- Kalan görev sayacı `1 item left` gösterir.

## Çıkış kriterleri

- P1 ve P2 senaryolarının tamamı beklenen sonuçlarla geçmelidir.
- Senaryolar Chromium, Firefox ve WebKit projelerinde bağımsız çalıştırılmalıdır.
- Locator'lar erişilebilir role/ad ve metin tabanlı olmalı; kırılgan CSS/XPath kullanılmamalıdır.
