import { demoJobs } from "../data/demoJobs";

function DashboardPage() {
  const stats = {
    total: demoJobs.length,
    waiting: demoJobs.filter((j) => j.status === "waiting").length,
    phoneScreens: demoJobs.filter((j) => j.status === "phone_screen").length,
  };

  return (
    <section>
      <p className="eyebrow">דשבורד</p>
      <h1 className="pageTitle">ברוכה הבאה ל־JobPrep AI</h1>

      <p className="heroText">
        כאן נראה סיכום של המשרות, הסטטוסים, הפעולות הבאות וההכנה לראיונות.
      </p>

      <div className="statsGrid">
        <article className="statCard">
          <strong>{stats.total}</strong>
          <span>משרות בדמו</span>
        </article>

        <article className="statCard">
          <strong>{stats.waiting}</strong>
          <span>ממתינות לתשובה</span>
        </article>

        <article className="statCard">
          <strong>{stats.phoneScreens}</strong>
          <span>שיחות טלפוניות</span>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;