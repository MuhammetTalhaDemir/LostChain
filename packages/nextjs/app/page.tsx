"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ArchiveBoxIcon, CheckIcon, LockClosedIcon, LockOpenIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [esyaIsmi, setEsyaIsmi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [dogrulamaSorusu, setDogrulamaSorusu] = useState("");
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
        args: [esyaIsmi, aciklama, bulunduMu, dogrulamaSorusu],
      });
      setEsyaIsmi("");
      setAciklama("");
      setDogrulamaSorusu("");
    } catch (e) {
      console.error(e);
    }
  };

  const idSira = sonrakiId ? Number(sonrakiId) : 0;
  const esyalarDizisi = Array.from({ length: idSira }, (_, i) => i).reverse();

  return (
    <div className="flex items-center flex-col grow pt-10 px-5 bg-base-200 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-2 text-primary">LostChain</h1>
        <p className="text-xl italic text-secondary font-bold underline decoration-primary">
          Erciyes Universitesi Seffaf Portal
        </p>
      </div>

      <div className="card w-full max-w-2xl bg-base-100 shadow-2xl border-2 border-primary mb-12">
        <div className="card-body">
          <h2 className="card-title text-2xl">
            <PlusIcon className="h-6 w-6" /> Yeni Ilan Olustur
          </h2>
          <div className="form-control gap-4 mt-4">
            <input
              type="text"
              placeholder="Esya Nedir?"
              className="input input-bordered border-primary"
              value={esyaIsmi}
              onChange={e => setEsyaIsmi(e.target.value)}
            />
            <textarea
              placeholder="Genel Aciklama"
              className="textarea textarea-bordered border-primary"
              value={aciklama}
              onChange={e => setAciklama(e.target.value)}
            />
            <input
              type="text"
              placeholder="Dogrulama Sorusu"
              className="input input-bordered input-secondary"
              value={dogrulamaSorusu}
              onChange={e => setDogrulamaSorusu(e.target.value)}
            />
            <select
              className="select select-bordered border-primary"
              onChange={e => setBulunduMu(e.target.value === "bulundu")}
            >
              <option value="kayip">Esyami Kaybettim</option>
              <option value="bulundu">Esya Buldum</option>
            </select>
            <button className="btn btn-primary shadow-lg" onClick={handleEkle}>
              Sisteme Kaydet
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl">
        <h2 className="text-3xl font-bold mb-8 text-center flex justify-center gap-3">
          <ArchiveBoxIcon className="h-9 w-9 text-primary" /> Aktif Ilanlar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {esyalarDizisi.map(id => (
            <EsyaKarti key={id} id={id} connectedAddress={connectedAddress} />
          ))}
        </div>
      </div>
    </div>
  );
};

const EsyaKarti = ({ id, connectedAddress }: { id: number; connectedAddress?: string }) => {
  const [iletisim, setIletisim] = useState("");
  const [konum, setKonum] = useState("");
  const { data: esya } = useScaffoldReadContract({
    contractName: "YourContract",
    functionName: "esyalar",
    args: [BigInt(id)],
  });
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  if (!esya) return <div className="h-64 bg-base-300 animate-pulse rounded-3xl" />;
  const [, isim, aciklama, bildiren, durum, bulanKisi, iletisimNotu, gizliKonum, dogrulamaSorusu, onayliKisi] = esya;

  const isSahibi = connectedAddress?.toLowerCase() === bildiren.toLowerCase();
  const isOnayli = connectedAddress?.toLowerCase() === onayliKisi.toLowerCase();

  return (
    <div
      className={`card bg-base-100 shadow-xl border-t-8 ${
        durum === 2 ? "border-gray-400 opacity-60" : "border-primary"
      } transition-all hover:shadow-2xl`}
    >
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div
            className={`badge font-bold ${
              durum === 0 ? "badge-error" : durum === 1 ? "badge-warning" : "badge-success"
            }`}
          >
            {durum === 0 ? "KAYIP" : durum === 1 ? "BULUNDU" : "TESLIM EDILDI"}
          </div>
          <span className="text-xs font-mono opacity-50 italic">ID: {id}</span>
        </div>

        <h3 className="card-title text-2xl mt-2">{isim}</h3>
        <p className="text-sm opacity-80 italic">&quot;{aciklama}&quot;</p>

        <div className="divider">GUVENLIK</div>
        <p className="text-xs font-bold text-secondary uppercase tracking-widest">Dogrulama Sorusu:</p>
        <p className="text-sm bg-secondary/10 p-3 rounded-lg border border-secondary/20">{dogrulamaSorusu}</p>

        {durum === 0 && !isSahibi && (
          <div className="mt-4 p-4 bg-base-200 rounded-2xl border border-dashed border-primary">
            <p className="text-xs font-bold mb-2">Bulduysan Bilgi Ver:</p>
            <input
              type="text"
              placeholder="Iletisim (Tel/TG)"
              className="input input-xs input-bordered w-full mb-2"
              onChange={e => setIletisim(e.target.value)}
            />
            <input
              type="text"
              placeholder="Gizli Konum Bilgisi"
              className="input input-xs input-bordered w-full mb-2"
              onChange={e => setKonum(e.target.value)}
            />
            <button
              className="btn btn-warning btn-xs w-full"
              onClick={() =>
                writeYourContractAsync({ functionName: "buldugunuBildir", args: [BigInt(id), iletisim, konum] })
              }
            >
              Buldum!
            </button>
          </div>
        )}

        {durum === 1 && isSahibi && (
          <div className="mt-4 p-4 bg-primary/10 rounded-2xl border border-primary text-center">
            <p className="text-xs font-bold mb-1 text-primary uppercase">Biri Esyani Buldu!</p>
            <div className="text-[10px] mb-2 flex flex-col items-center">
              <Address address={bulanKisi} />
              <span className="mt-2 font-bold italic">Not: {iletisimNotu}</span>
            </div>
            <button
              className="btn btn-primary btn-xs w-full"
              onClick={() => writeYourContractAsync({ functionName: "kisiOnayla", args: [BigInt(id), bulanKisi] })}
            >
              BU KISIYI ONAYLA
            </button>
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl bg-base-300 border-2 border-base-content/10">
          <div className="flex items-center gap-2 mb-2">
            {isOnayli || isSahibi ? (
              <LockOpenIcon className="h-5 w-5 text-success" />
            ) : (
              <LockClosedIcon className="h-5 w-5 text-error" />
            )}
            <span className="text-xs font-bold uppercase tracking-widest">Gizli Konum</span>
          </div>
          {isOnayli || isSahibi ? (
            <p className="text-sm font-bold text-success animate-pulse">{gizliKonum || "Konum girilmemis"}</p>
          ) : (
            <p className="text-[10px] italic opacity-50 text-center">
              Bu bilgiye sadece ilani veren kisinin onayladigi cuzdan erisebilir.
            </p>
          )}
        </div>

        <div className="card-actions justify-end mt-6 border-t pt-4">
          <div className="w-full">
            <p className="text-[10px] uppercase font-bold opacity-30">Ilan Sahibi</p>
            <Address address={bildiren} />
          </div>
          {isSahibi && durum !== 2 && (
            <button
              className="btn btn-success btn-sm w-full mt-4 gap-2"
              onClick={() => writeYourContractAsync({ functionName: "teslimEdildiIsaretle", args: [BigInt(id)] })}
            >
              <CheckIcon className="h-4 w-4" /> Sureci Kapat
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;