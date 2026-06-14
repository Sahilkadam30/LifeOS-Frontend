import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CheckCircle } from "lucide-react";

/**
 * SuccessModal — premium save-success popup
 *
 * Props:
 *   open        {boolean}  — controls visibility
 *   onClose     {fn}       — called when user clicks OK or backdrop
 *   title       {string}   — headline (default "Saved Successfully!")
 *   description {string}   — body text
 *   onViewDetails {fn}     — optional; if provided renders "View Details" button
 */
export default function SuccessModal({
  open,
  onClose,
  title = "Saved Successfully!",
  description = "Your data has been saved successfully.",
  onViewDetails,
}) {
  const panelRef = useRef(null);

  /* Close on Escape */
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  /* Auto-dismiss after 1.2 seconds */
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, 1200);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <>
      {/* ── Keyframe injection (once per render) ── */}
      <style>{`
        @keyframes sm-backdrop-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes sm-panel-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        .sm-backdrop {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: sm-backdrop-in 300ms ease-out both;
        }
        .sm-panel {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          z-index: 9999;
          width: min(460px, calc(100vw - 32px));
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E2E8F0;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          padding: 40px 36px 32px;
          text-align: center;
          font-family: 'Inter', 'Poppins', system-ui, sans-serif;
          animation: sm-panel-in 300ms ease-out both;
        }
        .sm-icon-wrap {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: #DCFCE7;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .sm-title {
          font-size: 24px; font-weight: 700;
          color: #1E293B; margin: 0 0 10px;
          line-height: 1.25;
        }
        .sm-desc {
          font-size: 15px; font-weight: 400;
          color: #64748B; margin: 0 0 28px;
          line-height: 1.6;
        }
        .sm-btn-row {
          display: flex; flex-direction: column; gap: 10px;
        }
        .sm-ok {
          display: block; width: 100%; height: 44px;
          background: #2563EB; color: #fff;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background .15s, box-shadow .15s;
          font-family: inherit;
        }
        .sm-ok:hover {
          background: #1D4ED8;
          box-shadow: 0 4px 12px rgba(37,99,235,0.35);
        }
        .sm-details {
          display: block; width: 100%; height: 44px;
          background: #fff; color: #2563EB;
          border: 1.5px solid #2563EB; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background .15s, box-shadow .15s;
          font-family: inherit;
        }
        .sm-details:hover {
          background: #EFF6FF;
        }
      `}</style>

      {/* Backdrop — click outside closes */}
      <div className="sm-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="sm-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sm-title"
        aria-describedby="sm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green check icon */}
        <div className="sm-icon-wrap" aria-hidden="true">
          <CheckCircle size={36} color="#16A34A" strokeWidth={2.2} />
        </div>

        <h2 className="sm-title" id="sm-title">{title}</h2>
        <p className="sm-desc" id="sm-desc">{description}</p>

        <div className="sm-btn-row">
          <button type="button" className="sm-ok" onClick={onClose} autoFocus>
            OK
          </button>

          {onViewDetails && (
            <button
              type="button"
              className="sm-details"
              onClick={() => { onViewDetails(); onClose(); }}
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
