"use client";

import { useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import {
  ArchiveBoxIcon,
  CheckIcon,
  LockClosedIcon,
  LockOpenIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Address } from "@scaffold-ui/components";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [esyaIsmi, setEsyaIsmi] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [dogrulamaSorusu, setDogrulamaSorusu] = useState("");
  const [gizliKonum, setGizliKonum] = useState("");
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
        args: [esyaIsmi, aciklama, bulunduMu, dogrulamaSorusu, gizliKonum],
      });
      setEsyaIsmi(""); setAciklama(""); setDogrulamaSorusu(""); setGizliKonum("");
    } catch (e) {
      console.error(e);
    }
  };

  const idSira = sonrakiId ? Number(sonrakiId) : 0;
  const esyalarDizisi = Array.from({ length: idSira }, (_, i) => i).reverse();

  return (
    <div className="flex items-center flex-col grow pt-10 px-5 bg-[#F8FAFC] min-h-screen text-[#1E293B]">
      <div className="text-center mb-10">
        <h1 className="text-6xl font-black mb-2 text-[#0F172A] tracking-tighter">LostChain</h1>
        <p className="text-lg font-medium text-[#64748B] tracking-wide">
          Erciyes Üniversitesi Şeffaf Kayıp Eşya Portalı
        </p>
      </div>

      {/* --- YENİ MODERN FORM --- */}
      <div className="card w-full max-w-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#E2E8F0] rounded-[2rem] mb-16">
        <div className="card-body p-8">
          <h2 className="card-title text-xl font-bold mb-4 flex items-center gap-2 text-[#334155]">
            <PlusIcon className="h-5 w-5 text-blue-500" /> Bir İlan Oluşturun
          </h2>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Eşyanın Adı nedir?"
              className="input input-bordered bg-[#F1F5F9] border-none focus:ring-2 focus:ring-blue-400 placeholder-[#94A3B8]"
              value={esyaIsmi}
              onChange={e => setEsyaIsmi(e.target.value)}
            />
            <textarea
              placeholder="Kısa bir açıklama ekleyin..."
              className="textarea textarea-bordered bg-[#F1F5F9] border-none focus:ring-2 focus:ring-blue-400 h-24 placeholder-[#94A3B8]"
              value={aciklama}
              onChange={e => setAciklama(e.target.value)}
            />
            
            <div className="flex gap-2">
                <button 
                    onClick={() => setBulunduMu(false)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!bulunduMu ? 'bg-red-50 text-red-600 border-2 border-red-100' : 'bg-white text-gray-400 border-2 border-gray-50'}`}
                >
                    Eşyam Kayıp
                </button>
                <button 
                    onClick={() => setBulunduMu(true)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${bulunduMu ? 'bg-green-50 text-green-600 border-2 border-green-100' : 'bg-white text-gray-400 border-2 border-gray-50'}`}
                >
                    Eşya Buldum
                </button>
            </div>

            {bulunduMu && (
              <div className="flex flex-col gap-3 p-5 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in slide-in-from-top-4 duration-300">
                <input
                  type="text"
                  placeholder="Doğrulama Sorusu (Örn: Rengi neydi?)"
                  className="input input-sm bg-white border-blue-200"
                  value={dogrulamaSorusu}
                  onChange={e => setDogrulamaSorusu(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Gizli Konum (Nereye bıraktınız?)"
                  className="input input-sm bg-white border-blue-200"
                  value={gizliKonum}
                  onChange={e => setGizliKonum(e.target.value)}
                />
              </div>
            )}

            <button className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-none text-white font-bold rounded-xl mt-4 shadow-lg shadow-blue-200" onClick={handleEkle}>
              İlanı Yayınla
            </button>
          </div>
        </div>
      </div>

      {/* --- İLANLAR --- */}
      <div className="w-full max-w-7xl pb-20">
        <div className="flex items-center gap-4 mb-10 px-4">
            <div className="h-[1px] grow bg-[#E2E8F0]"></div>
            <h2 className="text-2xl font-black text-[#475569] flex items-center gap-2">
                <ArchiveBoxIcon className="h-6 w-6" /> AKTİF İLANLAR
            </h2>
            <div className="h-[1px] grow bg-[#E2E8F0]"></div>
        </div>
        
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
  const [cevap, setCevap] = useState("");
  const [iletisim, setIletisim] = useState("");
  const [konum, setKonum] = useState("");
  const { data: esya } = useScaffoldReadContract({ contractName: "YourContract", functionName: "esyalar", args: [BigInt(id)] });
  const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract("YourContract");

  if (!esya) return <div className="h-80 bg-white rounded-[2rem] animate-pulse border border-gray-100" />;
  const [, isim, aciklama, bildiren, durum, bulanKisi, iletisimNotu, gizliKonum, dogrulamaSorusu, onayliKisi] = esya;

  const isSahibi = connectedAddress?.toLowerCase() === bildiren.toLowerCase();
  const isOnayli = connectedAddress?.toLowerCase() === onayliKisi?.toLowerCase();
  const isBulundu = Number(durum) === 1;
  const isKayip = Number(durum) === 0;

  return (
    <div className={`group bg-white rounded-[2rem] border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden ${Number(durum) === 2 ? 'grayscale opacity-60' : ''}`}>
      <div className="p-7">
        <div className="flex justify-between items-center mb-5">
          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isKayip ? 'bg-red-100 text-red-600' : isBulundu ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
            {isKayip ? "Kayıp" : isBulundu ? "Bulundu" : "Teslim Edildi"}
          </span>
          <span className="text-[10px] font-bold text-gray-300">#00{id}</span>
        </div>

        <h3 className="text-xl font-bold text-[#1E293B] mb-2">{isim}</h3>
        <p className="text-sm text-[#64748B] mb-6 line-clamp-2">&quot;{aciklama}&quot;</p>

        {isBulundu && !isSahibi && !isOnayli && (
          <div className="bg-[#F8FAFC] p-5 rounded-2xl border border-gray-100 mb-6">
            <p className="text-[11px] font-black text-blue-600 uppercase mb-3 flex items-center gap-1">
                <PaperAirplaneIcon className="h-3 w-3" /> Sahiplik Talebi
            </p>
            <p className="text-[11px] text-gray-500 mb-3">Soru: <b>{dogrulamaSorusu}</b></p>
            <input type="text" placeholder="Cevabınız" className="input input-xs w-full mb-2 bg-white" value={cevap} onChange={e => setCevap(e.target.value)} />
            <input type="text" placeholder="İletişim Adresiniz" className="input input-xs w-full mb-3 bg-white" value={iletisim} onChange={e => setIletisim(e.target.value)} />
            <button className="btn btn-xs w-full bg-blue-600 text-white border-none hover:bg-blue-700" onClick={() => writeYourContractAsync({ functionName: "talepOlustur", args: [BigInt(id), cevap, iletisim] })}>Talep Gönder</button>
          </div>
        )}

        <div className="space-y-4">
            <div className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${isOnayli || isSahibi ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'}`}>
                <div className={`p-2 rounded-lg ${isOnayli || isSahibi ? 'bg-white text-green-500' : 'bg-white text-gray-300'}`}>
                    {isOnayli || isSahibi ? <LockOpenIcon className="h-5 w-5" /> : <LockClosedIcon className="h-5 w-5" />}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Gizli Konum</p>
                    <p className="text-sm font-bold text-[#334155]">
                        {isOnayli || isSahibi ? (gizliKonum || "Konum Bekleniyor") : "••••••••••••"}
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-gray-50">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">İlan Sahibi</p>
                <Address address={bildiren} />
            </div>

            {isSahibi && Number(durum) !== 2 && (
                <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2" onClick={() => writeYourContractAsync({ functionName: "teslimEdildiIsaretle", args: [BigInt(id)] })}>
                    <CheckIcon className="h-4 w-4" /> Süreci Kapat
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;