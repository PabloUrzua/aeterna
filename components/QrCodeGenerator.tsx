"use client";

import React, { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import confetti from "canvas-confetti";
import { QRCodeCanvas } from "qrcode.react";

interface QrCodeGeneratorProps {
  url: string;
  name: string;
}

export default function QrCodeGenerator({ url, name }: QrCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      confetti({
        particleCount: 20,
        spread: 30,
        colors: ["#1F2937", "#9CA3AF"],
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Error al copiar enlace: ", err);
    }
  };

  const handleDownload = () => {
    const canvas = document.getElementById("memorial-qr-code") as HTMLCanvasElement;
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `codigo_qr_${name.toLowerCase().replace(/\s+/g, "_")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      confetti({
        particleCount: 30,
        spread: 45,
        colors: ["#1F2937", "#E5E7EB"],
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-850 rounded-2xl shadow-xs space-y-6 text-center">
      <div className="space-y-1">
        <h4 className="font-serif text-sm font-semibold text-neutral-800 dark:text-neutral-100">
          Código QR del Memorial
        </h4>
        <p className="text-[10px] text-neutral-400 max-w-xs leading-normal">
          Escanea o descarga este código para colocarlo en la placa del memorial físico.
        </p>
      </div>

      <div className="relative group p-4 bg-white rounded-xl border border-neutral-100 dark:border-neutral-800 flex items-center justify-center">
        <QRCodeCanvas 
          id="memorial-qr-code"
          value={url} 
          size={160} 
          level="H"
          includeMargin={true}
          className="w-40 h-40 object-contain"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
      </div>

      <div className="w-full space-y-3">
        {/* URL display & Copy */}
        <div className="flex items-center justify-between gap-2 p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800 rounded-lg text-[10px]">
          <span className="font-mono text-neutral-500 truncate max-w-[180px]">
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded text-neutral-600 dark:text-neutral-350 transition-colors"
            title="Copiar enlace"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          className="w-full py-2.5 rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-200 text-[10px] font-medium transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Download size={12} /> Descargar Código QR
        </button>
      </div>
    </div>
  );
}
