"use client";

import React from "react";

/**
 * Site footer - Sadeleştirilmiş ve Header ile uyumlu koyu gri versiyon.
 */
export const Footer = () => {
  return (
    <div className="min-h-0 py-5 px-1 mb-11 lg:mb-0 bg-slate-100 border-t border-slate-200">
      <div className="w-full">
        <ul className="menu menu-horizontal w-full">
          <div className="flex justify-center items-center gap-2 text-sm w-full">
            <div className="text-slate-500 font-medium">
              LostChain © {new Date().getFullYear()} - Erciyes Üniversitesi
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};