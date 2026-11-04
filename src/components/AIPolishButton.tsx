import React, { useState } from "react";
import { Sparkles, Loader2, RotateCcw, Check } from "lucide-react";

interface AIPolishButtonProps {
  textToPolish: string;
  onPolished: (polishedText: string) => void;
  context?: string;
  targetRole?: string;
  compact?: boolean;
  className?: string;
}

export const AIPolishButton: React.FC<AIPolishButtonProps> = ({
  textToPolish,
  onPolished,
  context = "Deskripsi Kualifikasi & Tanggung Jawab",
  targetRole = "Administrative Specialist & Accounting Professional",
  compact = false,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [previousText, setPreviousText] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handlePolish = async () => {
    if (!textToPolish.trim() || isLoading) return;

    setIsLoading(true);
    setPreviousText(textToPolish);

    try {
      const res = await fetch("/api/ai/polish-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToPolish,
          context,
          targetRole,
        }),
      });

      const data = await res.json();
      if (data.polishedText && data.polishedText !== textToPolish) {
        onPolished(data.polishedText);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (err) {
      console.error("Gagal merapihkan teks dengan AI:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousText !== null) {
      onPolished(previousText);
      setPreviousText(null);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePolish}
        disabled={isLoading || !textToPolish.trim()}
        title="Rapihkan dan percantik kata-kata dengan AI agar formal, berdampak tinggi, dan memikat HRD"
        className={`inline-flex items-center gap-1.5 rounded-lg font-semibold transition-all shadow-sm ${
          compact
            ? "px-2 py-1 text-[11px] bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30"
            : "px-3 py-1.5 text-xs bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 hover:from-emerald-500/25 hover:to-cyan-500/25 text-emerald-300 border border-emerald-500/40"
        } disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {isLoading ? (
          <>
            <Loader2 size={12} className="animate-spin text-emerald-400" />
            <span className="font-mono text-[10px]">Merapihkan...</span>
          </>
        ) : (
          <>
            <Sparkles size={12} className="text-cyan-400 animate-pulse" />
            <span>Rapihkan dengan AI</span>
          </>
        )}
      </button>

      {previousText !== null && (
        <button
          type="button"
          onClick={handleUndo}
          className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          title="Kembalikan ke tulisan draf awal Anda"
        >
          <RotateCcw size={10} />
          <span>Urungkan</span>
        </button>
      )}

      {showSuccessToast && (
        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 animate-fadeIn">
          <Check size={12} />
          <span>Kata-kata dipercantik!</span>
        </span>
      )}
    </div>
  );
};
