"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { hardhat } from "viem/chains";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick, useTargetNetwork } from "~~/hooks/scaffold-eth";

export const Header = () => {
  const { targetNetwork } = useTargetNetwork();
  const isLocalNetwork = targetNetwork.id === hardhat.id;

  const burgerMenuRef = useRef<HTMLDetailsElement>(null);
  useOutsideClick(burgerMenuRef, () => {
    burgerMenuRef?.current?.removeAttribute("open");
  });

  return (
    <div className="sticky lg:static top-0 navbar bg-white border-b border-gray-100 min-h-0 shrink-0 justify-between z-20 px-4 py-3">
      <div className="navbar-start w-auto">
        <Link href="/" passHref className="flex items-center gap-2 ml-2 shrink-0">
          <div className="flex flex-col">
            <span className="text-2xl font-black leading-tight tracking-tighter text-slate-900">LostChain</span>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-[0.2em] -mt-1">Erciyes Portal</span>
          </div>
        </Link>
      </div>

      <div className="navbar-end grow gap-2">
        <RainbowKitCustomConnectButton />
        {isLocalNetwork && <FaucetButton />}
      </div>
    </div>
  );
};
