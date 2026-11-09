# SauceDemo E-Ticaret Satın Alma Akışı — Test Planı

## Uygulama

- **URL:** https://www.saucedemo.com
- **Uygulama:** SauceDemo çevrimiçi mağaza
- **Amaç:** Standart kullanıcıyla girişten sipariş onayına kadar satın alma akışını ve temel doğrulama hatalarını uçtan uca doğrulamak.

## Test yaklaşımı

- Her senaryoyu temiz bir tarayıcı bağlamında çalıştırın; senaryolar birbirinin oturumuna veya sepet verisine bağlı olmamalı.
- Ana satın alma senaryosunda `standard_user` ve SauceDemo test parolası `secret_sauce` kullanılmalı.
- Locator önceliği: kullanıcıya dönük `getByRole`, `getByLabel`, `getByPlaceholder` ve `getByText`; bunlar uygun olmadığında uygulamanın `data-test` kimlikleri için `getByTestId`.
- Ürün sıralama kontrolünde `product_sort_container`; ürün kartlarındaki eylemlerde sırasıyla `add-to-cart-sauce-labs-onesie` ve `add-to-cart-sauce-labs-bike-light` test kimlikleri kullanılmalı. Kırılgan CSS/XPath seçicileri ve konuma dayalı genel locator'lar kullanılmamalı.
- Ürün adı ve fiyatları, ilgili ürün kartı içinde doğrulanmalı. Sepet rozeti ve sepet satırları da ürün adlarından bağımsız olarak doğrulanmalı.
- Başarılı satın alma senaryosu, testin kendi oluşturduğu sepet ve sipariş verisiyle sonuna kadar yürütülmeli.

## Senaryo matrisi

| ID | Tür | Senaryo | Beklenen sonuç |
|---|---|---|---|
| SD-01 | Pozitif | Fiyata göre artan sıralama ve satın alma | İlk iki ucuz ürün sepete eklenir; sepet, checkout özeti ve sipariş onayı doğru ürün ve tutarları gösterir. |
| SD-02 | Negatif | Geçersiz kullanıcı bilgileriyle giriş | Giriş reddedilir, kullanıcı envanter sayfasına yönlendirilmez ve anlamlı hata mesajı görünür. |
| SD-03 | Sınır | Checkout zorunlu alanlarının eksik bırakılması | Eksik zorunlu alan için doğrulama mesajı görünür; kullanıcı sipariş özetine ilerleyemez. |
| SD-04 | Sınır | Boş sepet durumunu doğrulama | Sepette ürün satırı gösterilmez ve sepet rozeti boş sepetle tutarlıdır. |

## Ayrıntılı senaryolar

### SD-01 — Fiyata göre artan sıralama ile satın alma

**Tür:** Pozitif, uçtan uca  
**Ön koşul:** Yeni tarayıcı bağlamı; kullanıcı henüz giriş yapmamış ve sepeti boştur.

#### Arrange

1. `https://www.saucedemo.com` adresini açın.
2. Kullanıcı adı alanına `standard_user`, parola alanına `secret_sauce` girin.
3. `Login` düğmesine basın.
4. Envanter sayfasının açıldığını ve `Products` başlığının göründüğünü doğrulayın.

#### Act

1. `product_sort_container` test kimliğine sahip sıralama kontrolünde `Price (low to high)` seçeneğini seçin.
2. Ürünlerin fiyatlarının düşükten yükseğe sıralandığını doğrulayın.
3. Sıralanmış listenin ilk iki ürünü olan `Sauce Labs Onesie` (`$7.99`) ve `Sauce Labs Bike Light` (`$9.99`) ürünlerini ilgili ürün kartlarındaki `Add to cart` düğmeleriyle sepete ekleyin.
4. Sepet bağlantısına tıklayın.
5. Checkout'u başlatmak için `Checkout` düğmesine basın.
6. Checkout bilgi formundaki `First Name`, `Last Name` ve `Zip/Postal Code` alanlarını sırasıyla `Test`, `Customer` ve `10001` değerleriyle doldurun.
7. `Continue` düğmesine basıp sipariş özetini açın.
8. `Finish` düğmesine basın.

#### Assert

- Giriş sonrası envanter sayfası gösterilir; sıralama kontrolünün seçili değeri `Price (low to high)` olur.
- İlk iki ürünün adları ve fiyatları sırasıyla `Sauce Labs Onesie` / `$7.99` ve `Sauce Labs Bike Light` / `$9.99` olur. Görünen fiyatlar artan sıradadır.
- Ürünler sepete eklendikten sonra sepet rozeti `2` gösterir.
- Sepet sayfasında yalnızca bu iki ürün bulunur; her ürünün adı, fiyatı ve miktarı (`1`) doğru görünür.
- Checkout bilgi adımı açılır ve üç alan da doldurulabilir.
- Sipariş özetinde iki doğru ürün ve toplam miktar `2` gösterilir; ara toplam `$17.98` olur. Vergi ve genel toplam ekranda hesaplandığı şekilde görünür ve genel toplam ara toplam ile verginin toplamına eşittir.
- Sipariş tamamlandığında `Checkout: Complete!` başlığı ve `Thank you for your order!` onay mesajı görünür.

### SD-02 — Geçersiz kullanıcı bilgileriyle giriş

**Tür:** Negatif  
**Ön koşul:** Yeni tarayıcı bağlamı; giriş sayfası açık.

#### Arrange / Act

1. Geçersiz kullanıcı adı ve parola girin.
2. `Login` düğmesine basın.

#### Assert

- Envanter sayfasına geçiş yapılmaz; giriş sayfasında kalınır.
- Hata mesajı görünür ve girişin başarısız olduğunu açıkça belirtir.

### SD-03 — Checkout zorunlu alanlarının eksik bırakılması

**Tür:** Sınır  
**Ön koşul:** Kullanıcı giriş yapmıştır ve sepetinde en az bir ürün vardır.

#### Arrange / Act

1. Sepetten `Checkout` adımına geçin.
2. `First Name`, `Last Name` ve `Zip/Postal Code` alanlarını boş bırakıp `Continue` düğmesine basın.
3. Varsa doğrulama mesajındaki belirtilen eksik alanı doldurun ve işlemi tekrarlayarak kalan zorunlu alanların da tek tek denetlendiğini doğrulayın.

#### Assert

- Her denemede eksik zorunlu alanı belirten hata mesajı görünür.
- Zorunlu alanlardan biri eksikken sipariş özeti açılmaz ve sipariş tamamlanamaz.
- Tüm zorunlu alanlar geçerli değerlerle doldurulduğunda `Continue` işlemi sipariş özetine ilerler.

### SD-04 — Boş sepet durumunu doğrulama

**Tür:** Sınır  
**Ön koşul:** Yeni tarayıcı bağlamında `standard_user` ile giriş yapılmış, sepete ürün eklenmemiştir.

#### Arrange / Act

1. Sepet bağlantısını açın.
2. Sepet sayfasındaki ürün listesini ve sepet rozetini kontrol edin.

#### Assert

- Sepet ürün satırı içermez.
- Sepet rozeti boş sepet durumuyla tutarlıdır; ürün eklenmiş veya sipariş tamamlanmış gibi görünmez.

## Çıkış kriterleri

- SD-01–SD-04 senaryoları beklenen sonuçlarla tamamlanmalı.
- Her senaryo bağımsız ve tekrarlanabilir olmalı; SD-01 sipariş onay ekranına kadar yürütülmeli.
- Locator'lar erişilebilir kullanıcı arayüzü adlarına veya mevcut `data-test` kimliklerine dayanmalı; kırılgan DOM yapısı seçicileri kullanılmamalı.
