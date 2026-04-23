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
        address bulanKisi; // Eşyayı bulduğunu iddia eden kişi
        string iletisimNotu; // Bulan kişinin bıraktığı not veya iletişim bilgisi
    }

    mapping(uint256 => Esya) public esyalar;
    uint256 public sonrakiId;

    function esyaEkle(string memory _isim, string memory _aciklama, bool _bulunduMu) public {
        esyalar[sonrakiId] = Esya({
            id: sonrakiId,
            isim: _isim,
            aciklama: _aciklama,
            bildiren: msg.sender,
            durum: _bulunduMu ? Status.Bulundu : Status.Kayip,
            bulanKisi: address(0),
            iletisimNotu: ""
        });
        sonrakiId++;
    }

    // Birisi "Kayip" ilanı verilmiş bir eşyayı bulursa bu fonksiyonu çağırır
    function buldugunuBildir(uint256 _id, string memory _not) public {
        require(esyalar[_id].durum == Status.Kayip, "Bu esya zaten bulunmus veya teslim edilmis.");
        esyalar[_id].durum = Status.Bulundu;
        esyalar[_id].bulanKisi = msg.sender;
        esyalar[_id].iletisimNotu = _not;
    }

    // Eşya sahibi eşyayı teslim aldığında sistemi kapatır
    function teslimEdildiIsaretle(uint256 _id) public {
        require(msg.sender == esyalar[_id].bildiren, "Sadece ilani veren kisi onaylayabilir.");
        esyalar[_id].durum = Status.TeslimEdildi;
    }
}
