const answers = [
  {
    question: "ספרי על עצמך",
    answer: "נתון דמו בלבד. כאן תופיע תשובה אישית מוכנה.",
  },
  {
    question: "למה את רוצה את התפקיד",
    answer: "נתון דמו בלבד. כאן תופיע תשובה מותאמת לחברה.",
  },
  {
    question: "חוזקה בולטת",
    answer: "נתון דמו בלבד. כאן תופיע דוגמה אמיתית עם הוכחה.",
  },
  {
    question: "חולשה",
    answer:
      "נתון דמו בלבד. כאן תופיע חולשה אמיתית עם הסבר על שיפור.",
  },
];

function PersonalInterviewPage() {
  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">ראיון אישי</p>
        <h2 className="page__title">הכנה לראיון אישי</h2>
      </div>

      <div className="personal-layout">
        <div className="personal-answers">
          {answers.map((item, i) => (
            <div key={i} className="card">
              <h3 className="card__title">{item.question}</h3>
              <p className="card__text">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="card card--sidebar card--accent">
          <h3 className="card__title">עתיד המערכת</h3>
          <p className="card__text">
            בהמשך, המערכת תתאים את התשובות האישיות לכל חברה בנפרד.
            <br />
            <br />
            לכל משרה יהיה עמוד עם גרסה מותאמת של "ספרי על עצמך"
            ו"למה את רוצה אצלנו".
          </p>
        </div>
      </div>
    </div>
  );
}

export default PersonalInterviewPage;
