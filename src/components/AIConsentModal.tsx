type ConsentField = { label: string; value: string };

export type ConsentPayload = {
  taskLabel: string;
  fields: ConsentField[];
  textToSend: string;
  isRedacted: boolean;
};

type Props = {
  payload: ConsentPayload;
  onConfirm: () => void;
  onCancel: () => void;
};

export function AIConsentModal({ payload, onConfirm, onCancel }: Props) {
  return (
    <div
      className="ai-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-modal-title"
    >
      <div className="ai-modal">
        <h2 id="ai-modal-title" className="ai-modal__title">
          אישור שליחה ל-AI
        </h2>

        <div className="ai-modal__warning">
          ⚠️ המידע יישלח לשירות AI חיצוני. לא נשלח דבר בלי אישורך.
        </div>

        <div className="ai-modal__row">
          <span className="ai-modal__row-label">משימה:</span>
          <span>{payload.taskLabel}</span>
        </div>

        <div className="ai-modal__section">
          <p className="ai-modal__section-title">שדות שיישלחו:</p>
          <ul className="ai-modal__fields">
            {payload.fields.map((f, i) => (
              <li key={i}>
                <strong>{f.label}:</strong> {f.value || "—"}
              </li>
            ))}
          </ul>
        </div>

        <div className="ai-modal__section">
          <p className="ai-modal__section-title">
            טקסט שיישלח
            {payload.isRedacted ? " (אחרי עיבוד פרטיות)" : " (ללא עיבוד פרטיות)"}:
          </p>
          <pre className="ai-modal__preview">
            {payload.textToSend.slice(0, 1000)}
            {payload.textToSend.length > 1000 ? "\n…[חתוך לתצוגה]" : ""}
          </pre>
        </div>

        <div className="ai-modal__actions">
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            שליחה ל-AI
          </button>
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            ביטול
          </button>
        </div>
      </div>
    </div>
  );
}
