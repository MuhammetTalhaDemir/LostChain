// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

contract YourContract {
    enum Status { Kayip, Bulundu, TeslimEdildi }

    struct Esya {
        uint256 id;
        string isim;
        string aciklama;
        address bildiren;
        Status durum;
        address bulanKisi;
        string iletisimNotu; 
        string gizliKonum;   // Sadece onaylı kişi görecek
        string dogrulamaSorusu; // Sahibi tarafından sorulan soru
        address onayliKisi;  // Konumu görme yetkisi olan kişi
    }

    mapping(uint256 => Esya) public esyalar;
    uint256 public sonrakiId;

    // Eşya eklerken doğrulama sorusu da ekleniyor
    function esyaEkle(string memory _isim, string memory _aciklama, bool _bulunduMu, string memory _soru) public {
        esyalar[sonrakiId] = Esya({
            id: sonrakiId,
            isim: _isim,
            aciklama: _aciklama,
            bildiren: msg.sender,
            durum: _bulunduMu ? Status.Bulundu : Status.Kayip,
            bulanKisi: address(0),
            iletisimNotu: "",
            gizliKonum: "",
            dogrulamaSorusu: _soru,
            onayliKisi: address(0)
        });
        sonrakiId++;
    }

    // Birisi eşyayı bulduğunu iddia ederse
    function buldugunuBildir(uint256 _id, string memory _iletisim, string memory _konum) public {
        require(esyalar[_id].durum == Status.Kayip, "Bu esya zaten bulundu.");
        esyalar[_id].bulanKisi = msg.sender;
        esyalar[_id].iletisimNotu = _iletisim;
        esyalar[_id].gizliKonum = _konum;
        esyalar[_id].durum = Status.Bulundu;
    }

    // İlan sahibi, bulan kişiyi doğrularsa yetki verir
    function kisiOnayla(uint256 _id, address _onaylanacakKisi) public {
        require(msg.sender == esyalar[_id].bildiren, "Sadece sahibi onaylayabilir.");
        esyalar[_id].onayliKisi = _onaylanacakKisi;
    }

    function teslimEdildiIsaretle(uint256 _id) public {
        require(msg.sender == esyalar[_id].bildiren, "Sadece sahibi kapatabilir.");
        esyalar[_id].durum = Status.TeslimEdildi;
    }

            // ... mevcut struct ve enumlar ...

    function talepOlustur(uint256 _id, string memory _cevap, string memory _iletisim) public {
        require(esyalar[_id].durum == Status.Bulundu, "Bu esya icin talep olusturulamaz.");
        // Biz burada 'bulanKisi' ve 'iletisimNotu' alanlarini 
        // gecici olarak talep eden kisinin bilgileriyle guncelliyoruz ki sahibi gorsun.
        esyalar[_id].bulanKisi = msg.sender;
        esyalar[_id].iletisimNotu = string(abi.encodePacked("CEVAP: ", _cevap, " | ILETISIM: ", _iletisim));
    }
}