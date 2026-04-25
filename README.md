# 🏗 LostChain | Monad Blitz Kayseri

**LostChain**, Erciyes Üniversitesi kampüs ortamı için tasarlanmış, blockchain tabanlı bir kayıp-buluntu eşya portalıdır. Bu proje, **Monad Blitz Kayseri Hackathon** kapsamında sınırlı bir sürede geliştirilmiş bir **Teknik Prototiptir**.

---

## 🎯 Problem ve Çözüm

Üniversite kampüslerinde kayıp eşya ilanları genellikle anlık mesajlaşma grupları (WhatsApp, Telegram vb.) üzerinden paylaşılmaktadır. Ancak bu yöntem iki büyük sorunu beraberinde getirir:

1.  **Bilgi Kirliliği ve Kaybolma:** İlanlar, yoğun mesaj trafiği arasında hızla yukarıda kalarak görünürlüğünü yitirir ve ihtiyaç anında aranıp bulunması imkansız hale gelir.
2.  **Güvenlik ve Doğrulama:** Eşyayı bulan kişi ile gerçek sahibi arasında güvenli bir doğrulama mekanizması yoktur.

**LostChain**, bu sorunları blockchain teknolojisiyle çözer:
* **Kalıcı ve Düzenli Liste:** İlanlar mesaj trafiğine kapılmadan, akıllı kontrat üzerinde kalıcı ve kategorize edilmiş bir şekilde listelenir.
* **Akıllı Doğrulama:** Eşyayı bulan kişi, belirlediği "Doğrulama Sorusu" ile eşyayı sadece doğru cevabı veren kişiye (sahiplik kanıtı) teslim eder.

## 🌟 Temel Özellikler

* **Hybrid Privacy:** Bulunan eşyaların konumu, eşya sahibi onaylanana kadar blockchain üzerinde gizli tutulur.
* **Decentralized Verification:** Sahiplik kanıtı için blockchain tabanlı soru-cevap mekanizması kullanılır.
* **Monad Testnet Integration:** Yüksek performanslı Monad Testnet üzerinde düşük maliyetli ve hızlı işlem yapma imkanı.
* **Direct Contact:** Kayıp eşya sahipleri için merkeziyetsiz bir iletişim köprüsü.

## 🛠 Teknik Stack

* **Smart Contract:** Solidity (Monad Testnet)
* **Frontend:** Next.js, Tailwind CSS
* **Blockchain Tooling:** Scaffold-ETH 2, Wagmi, RainbowKit
* **Deployment:** Vercel

## 🔗 Canlı Uygulama

https://lost-chain-nextjs.vercel.app

## 🚀 Başlangıç

Projeyi yerelde çalıştırmak için:

1.  **Repo'yu klonlayın:**
    ```bash
    git clone https://github.com/MuhammetTalhaDemir/LostChain.git
    cd LostChain
    ```
2.  **Bağımlılıkları yükleyin:**
    ```bash
    yarn install
    ```
3.  **Uygulamayı başlatın:**
    ```bash
    yarn start
    ```

## 📝 Akıllı Kontrat
Kontrat ismi: `LostChain`  
Ağ: `Monad Testnet`  
Doğrulanmış kodları Monad Explorer üzerinden inceleyebilirsiniz.

---

## 🏛️ Proje Durumu ve Final Notu

Bu proje, **Blitz Kayseri** Hackathon finalinin ardından görsel ve teknik iyileştirmeleri (UI/UX polish, hydration fixes, metadata updates) içeren son bir güncelleme ile **nihai haline** getirilmiştir. 

**LostChain**, Monad ekosistemindeki ilk geliştirme deneyimlerimin bir parçası, hackathon heyecanının bir hatırası ve teknik bir referans noktası olarak GitHub üzerinde bu haliyle kalıcı olarak paylaşılmıştır.
