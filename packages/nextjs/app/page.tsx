"use client";

import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { PlusIcon, ArchiveBoxIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { useState } from "react";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [esyaIsmi, setEsyaIsmi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [bulunduMu, setBulunduMu] = useState(false);

  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  const { data: sonrakiId } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "sonrakiId",
  });

  const handleEkle = async () => {
    try {
      await writeYourContractAsync({
        functionName: "esyaEkle",
        args: [esyaIsmi, aciklama, bulunduMu],
      });
      setEsyaIsmi("");
      setAciklama("");
    } catch (e) {
      console.error(e);
    }
  };

  const idSira = sonrakiId ? Number(sonrakiId) : 0;
  const esyalarDizisi = Array.from({ length: idSira }, (_, i) => i).reverse();

  return (
    <div className="flex items-center flex-col grow pt-10 px-5">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2 text-primary">Şeffaf Kantin</h1>
        <p className="text-xl italic text-secondary font-bold">Erciyes Üniversitesi Kayıp Eşya Portalı</p>
      </div>

      <div className="bg-base-100 p-8 rounded-3xl shadow-xl w-full max-w-2xl mb-12 border-2 border-primary">
        <h2 className="text-2xl font-bold mb-5 flex items-center gap-2">
          <PlusIcon className="h-6 w-6" /> İlan Ver
        </h2>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Eşya İsmi"
            className="input input-bordered"
            value={esyaIsmi}
            onChange={e => setEsyaIsmi(e.target.value)}
          />
          <textarea
            placeholder="Açıklama"
            className="textarea textarea-bordered"
            value={aciklama}
            onChange={e => setAciklama(e.target.value)}
          />
          <select className="select select-bordered" onChange={e => setBulunduMu(e.target.value === "bulundu")}>
            <option value="kayip">Eşyamı Kaybettim</option>
            <option value="bulundu">Eşya Buldum</option>
          </select>
          <button className="btn btn-primary" onClick={handleEkle}>
            Blokzincirine Kaydet
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center flex justify-center gap-2 text-primary">
          <ArchiveBoxIcon className="h-8 w-8" /> İlanlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {esyalarDizisi.map(id => (
            <EsyaKarti key={id} id={id} connectedAddress={connectedAddress} />
          ))}
        </div>
      </div>
    </div>
  );
};

const EsyaKarti = ({ id, connectedAddress }: { id: number; connectedAddress?: string }) => {
  const [bulunduNotu, setBulunduNotu] = useState("");
  const { data: esya } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "esyalar",
    args: [BigInt(id)],
  });
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  if (!esya) return <div className="p-20 bg-base-200 animate-pulse rounded-3xl"></div>;
  const [esyaId, isim, aciklama, bildiren, durum, bulanKisi, iletisimNotu] = esya;

  return (
    <div className={`bg-base-100 p-6 rounded-3xl shadow-lg border-2 ${durum === 2 ? "opacity-50 grayscale" : "border-primary"}`}>
      <div className="flex justify-between mb-4">
        <span className={`badge font-bold p-3 ${durum === 0 ? "badge-error" : durum === 1 ? "badge-warning" : "badge-success"}`}>
          {durum === 0 ? "KAYIP" : durum === 1 ? "BULUNDU" : "TESLİM EDİLDİ"}
        </span>
        <span className="text-xs opacity-50 font-mono">ID: {id}</span>
      </div>
      <h3 className="text-xl font-bold mb-1">{isim}</h3>
      <p className="text-sm mb-4 h-12 overflow-y-auto opacity-80">{aciklama}</p>

      {durum === 0 && bildiren.toLowerCase() !== connectedAddress?.toLowerCase() && (
        <div className="mt-4 flex flex-col gap-2 border-t pt-4">
          <input
            type="text"
            placeholder="Nereye bıraktın? Not yaz..."
            className="input input-sm input-bordered"
            value={bulunduNotu}
            onChange={e => setBulunduNotu(e.target.value)}
          />
          <button
            className="btn btn-warning btn-sm"
            onClick={() => writeYourContractAsync({ functionName: "bulundugunuBildir", args: [BigInt(id), bulunduNotu] })}
          >
            Bulduğumu Bildir
          </button>
        </div>
      )}

      {durum === 1 && iletisimNotu && (
        <div className="mt-4 bg-yellow-100 p-3 rounded-xl border-l-4 border-yellow-500 text-xs text-black">
          <strong>Bulan Notu:</strong> {iletisimNotu}
          <div className="mt-2 text-[10px] opacity-70">
            Bulan: {bulanKisi.slice(0, 6)}...{bulanKisi.slice(-4)}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-base-300">
        <p className="text-[10px] uppercase font-bold opacity-50 mb-1">Bildiren</p>
        <Address address={bildiren} />
      </div>

      {bildiren.toLowerCase() === connectedAddress?.toLowerCase() && durum !== 2 && (
        <button
          className="btn btn-success btn-sm w-full mt-4 gap-2"
          onClick={() => writeYourContractAsync({ functionName: "teslimEdildiIsaretle", args: [BigInt(id)] })}
        >
          <CheckIcon className="h-4 w-4" /> Teslim Aldım / Kayıt Kapat
        </button>
      )}
    </div>
  );
};

export default Home;