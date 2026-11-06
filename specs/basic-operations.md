# TodoMVC Temel İşlemler Test Planı

## Uygulama

- **URL:** https://demo.playwright.dev/todomvc
- **Uygulama:** React TodoMVC demo
- **Amaç:** Görev ekleme, düzenleme, tamamlama, filtreleme ve silme akışlarının tarayıcı arayüzünden doğrulanması.

## Test yaklaşımı

- Her test yeni bir tarayıcı bağlamında çalışmalı; testler birbirlerinin görevlerine veya `localStorage` verisine bağlı olmamalı.
- Görev oluşturma ve değiştirme işlemlerinde Enter tuşu kullanılmalı. Görev düzenleme, görev başlığına çift tıklanarak başlatılır.
- Liste öğelerini görev metnine göre kapsamlandırın. Her görevde aynı erişilebilir ada sahip `Toggle Todo` onay kutusu bulunduğundan, bu kutuyu ilgili liste öğesi içinden bulun.
- Öncelikli locator'lar: `What needs to be done?` placeholder'lı textbox, `todo-title` test kimliği, `Toggle Todo` ve `Delete` erişilebilir adları, `Active`/`Completed` filtre bağlantıları ve `Clear completed` düğmesi.
- Boş liste durumunu varsaymayın; her senaryoda yalnızca kendi oluşturduğu görevleri doğrulayın. Sayfa yenileme senaryosunda kalıcılık aynı bağlamda test edilmelidir.

## Senaryolar

### BO-01 — Başlangıç arayüzünü görüntüleme

**Ön koşul:** Yeni tarayıcı bağlamı; uygulamada kayıtlı görev yok.

1. Uygulama URL'sini açın.
2. `todos` başlığının ve `What needs to be done?` giriş alanının görünür olduğunu doğrulayın.
3. Görev listesinin ve görev işlemlerine ait alt bilginin görünmediğini doğrulayın.

**Beklenen:** Boş TodoMVC arayüzü açılır; görev ekleme alanı kullanılabilir.

### BO-02 — Enter ile görev ekleme

**Ön koşul:** Yeni tarayıcı bağlamı.

1. Giriş alanına `Alışveriş yap` yazın ve Enter'a basın.
2. Görev listesinde `Alışveriş yap` başlıklı tek öğe olduğunu doğrulayın.
3. Giriş alanının boşaldığını ve kalan görev sayısının `1 item left` olduğunu doğrulayın.

**Beklenen:** Görev etkin olarak eklenir ve sayaç bir artar.

### BO-03 — Boş veya yalnızca boşluk içeren görev eklemeyi engelleme

**Ön koşul:** Yeni tarayıcı bağlamı.

1. Giriş alanını boş bırakıp Enter'a basın.
2. Yalnızca boşluklardan oluşan metni girip Enter'a basın.

**Beklenen:** Her iki girişte de görev oluşturulmaz; görev listesi boş kalır.

### BO-04 — Eklenen görev metnindeki kenar boşluklarını temizleme

**Ön koşul:** Yeni tarayıcı bağlamı.

1. Giriş alanına başında ve sonunda boşluk bulunan `  Raporu gönder  ` metnini girip Enter'a basın.

**Beklenen:** Görev başlığı `Raporu gönder` olarak görünür; kenar boşlukları saklanmaz.

### BO-05 — Görevi tamamlandı/etkin durumları arasında değiştirme

**Ön koşul:** `BO-02` adımlarıyla oluşturulmuş etkin bir görev.

1. Görev öğesindeki `Toggle Todo` onay kutusunu işaretleyin.
2. Görevin tamamlandı olarak işaretlendiğini ve etkin görev sayısının sıfır olduğunu doğrulayın.
3. Aynı onay kutusunun işaretini kaldırın.

**Beklenen:** Görev durumu her işlemle değişir; etkin görev sayacı `1` değerine geri döner.

### BO-06 — Tüm görevleri tamamlama ve tekrar etkinleştirme

**Ön koşul:** İki etkin görev oluşturun.

1. `Mark all as complete` kontrolünü işaretleyin.
2. Her iki görevin tamamlandı olduğunu ve etkin görev sayısının sıfır olduğunu doğrulayın.
3. Kontrolün işaretini kaldırın.

**Beklenen:** Toplu kontrol bütün görevleri aynı anda tamamlar veya tekrar etkinleştirir.

### BO-07 — Görev düzenleme ve kaydetme

**Ön koşul:** `Alışveriş yap` başlıklı bir görev oluşturun.

1. Görev başlığına çift tıklayın.
2. Düzenleme alanında metni `Market alışverişi` olarak değiştirip Enter'a basın.

**Beklenen:** Düzenleme alanı kapanır ve listede yeni başlık görünür; eski başlık görünmez.

### BO-08 — Düzenlemeyi Escape ile iptal etme

**Ön koşul:** `Alışveriş yap` başlıklı bir görev oluşturun.

1. Görev başlığına çift tıklayın ve metni `Değişiklik` olarak değiştirin.
2. Escape tuşuna basın.

**Beklenen:** Düzenleme iptal edilir; görev başlığı `Alışveriş yap` olarak kalır.

### BO-09 — Filtreleri ve görev sayaçlarını doğrulama

**Ön koşul:** `Etkin görev` ve `Tamamlanan görev` başlıklı iki görev oluşturun; ikinci görevi tamamlayın.

1. `Active` filtresine tıklayın ve yalnızca `Etkin görev` öğesini doğrulayın.
2. `Completed` filtresine tıklayın ve yalnızca `Tamamlanan görev` öğesini doğrulayın.
3. `All` filtresine tıklayın ve iki görevin de görünür olduğunu doğrulayın.

**Beklenen:** Filtreler görevlerin durumuna göre liste görünümünü değiştirir; filtre değişikliği görevleri silmez veya durumlarını değiştirmez. Sayaçta bir etkin görev gösterilir.

### BO-10 — Tamamlanan görevleri temizleme

**Ön koşul:** Bir etkin ve bir tamamlanmış görev oluşturun.

1. `Clear completed` düğmesinin görünür olduğunu doğrulayın.
2. Düğmeye tıklayın.

**Beklenen:** Tamamlanmış görev kaldırılır, etkin görev kalır ve etkin görev sayacı değişmez. Temizlenecek tamamlanmış görev yokken düğme gösterilmez.

### BO-11 — Tek bir görevi silme

**Ön koşul:** `Silinecek görev` ve `Kalacak görev` başlıklı iki görev oluşturun.

1. `Silinecek görev` öğesi içindeki `Delete` düğmesine tıklayın.

**Beklenen:** Yalnızca seçilen görev kaldırılır; diğer görev görünür ve sayaç `1 item left` olur.

### BO-12 — Görevlerin yenileme sonrasında korunması

**Ön koşul:** Aynı tarayıcı bağlamında bir etkin ve bir tamamlanmış görev oluşturun.

1. Sayfayı yenileyin.
2. Her iki görevin ve tamamlanmış görev durumunun korunduğunu doğrulayın.

**Beklenen:** Görevler ve durumları aynı bağlamda sayfa yenilemesinden sonra korunur.

## Çıkış kriterleri

- BO-01–BO-12 senaryolarının tamamı başarılı olmalı.
- Senaryolar Chromium, Firefox ve WebKit Playwright projelerinde çalıştırılmalı.
- Testlerin temiz ve bağımsız durumda çalıştığı, görev ekleme ve düzenleme senaryolarının Enter tuşuyla tamamlandığı doğrulanmalı.
