import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";

/**
 * DeleteConfirmModal — premium delete confirmation popup
 *
 * Props:
 *   open        {boolean}  — controls visibility
 *   onClose     {fn}       — called when user clicks Cancel or backdrop
 *   onConfirm   {fn}       — called when user clicks Delete
 *   title       {string}   — headline (default "Delete Entry?")
 *   description {string}   — body text
 */
export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Delete Entry?",
  description = "Are you sure you want to delete this entry? This action cannot be undone.",
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

  if (!open) return null;

  return createPortal(
    <>
      {/* ── Keyframe injection (once per render) ── */}
      <style>{`
        @keyframes dcm-backdrop-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes dcm-panel-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1);    }
        }
        .dcm-backdrop {
          position: fixed; inset: 0; z-index: 9998;
          background: rgba(15,23,42,0.45);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          animation: dcm-backdrop-in 300ms ease-out both;
        }
        .dcm-panel {
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
          animation: dcm-panel-in 300ms ease-out both;
        }
        .dcm-icon-wrap {
          width: 70px; height: 70px;
          border-radius: 50%;
          background: #FEE2E2;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }
        .dcm-title {
          font-size: 24px; font-weight: 700;
          color: #1E293B; margin: 0 0 10px;
          line-height: 1.25;
        }
        .dcm-desc {
          font-size: 15px; font-weight: 400;
          color: #64748B; margin: 0 0 28px;
          line-height: 1.6;
        }
        .dcm-btn-row {
          display: flex; gap: 12px;
        }
        .dcm-confirm {
          flex: 1; height: 44px;
          background: #EF4444; color: #fff;
          border: none; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background .15s, box-shadow .15s;
          font-family: inherit;
        }
        .dcm-confirm:hover {
          background: #DC2626;
          box-shadow: 0 4px 12px rgba(239,68,68,0.35);
        }
        .dcm-cancel {
          flex: 1; height: 44px;
          background: #fff; color: #64748B;
          border: 1px solid #E2E8F0; border-radius: 10px;
          font-size: 15px; font-weight: 600;
          cursor: pointer; transition: background .15s, color .15s;
          font-family: inherit;
        }
        .dcm-cancel:hover {
          background: #F8FAFC; color: #1E293B;
        }
      `}</style>

      {/* Backdrop */}
      <div className="dcm-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="dcm-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dcm-title"
        aria-describedby="dcm-desc"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red trash icon */}
        <div className="dcm-icon-wrap" aria-hidden="true">
          <Trash2 size={32} color="#EF4444" strokeWidth={2.2} />
        </div>

        <h2 className="dcm-title" id="dcm-title">{title}</h2>
        <p className="dcm-desc" id="dcm-desc">{description}</p>

        <div className="dcm-btn-row">
          <button type="button" className="dcm-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="dcm-confirm" onClick={onConfirm} autoFocus>
            Delete
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
