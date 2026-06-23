import "./App.css";

function App() {
  return (
    <main className="app" dir="rtl">
      <section className="hero">
        <p className="eyebrow">JobPrep AI</p>

        <h1>מערכת אישית לחיפוש עבודה והכנה לראיונות</h1>

        <p className="heroText">
          כאן נבנה מערכת שתעזור לי לנהל משרות, להבין מה כל תפקיד דורש,
          להתכונן לראיונות, ולחבר בין המשרות לבין הפרויקטים שלי מ־GitHub.
        </p>

        <div className="heroActions">
          <button>הוספת משרה</button>
          <button className="secondary">צפייה בפרויקטים</button>
        </div>
      </section>
    </main>
  );
}

export default App;