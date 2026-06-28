const demoProjects = [
  {
    id: "p1",
    name: "Job Search Hub",
    summary:
      "אפליקציית ניהול חיפוש עבודה אישית, בנויה עם React ו-TypeScript. כוללת מעקב משרות, דשבורד, וכרטיסי הכנה לראיון.",
    stack: ["React", "TypeScript", "Vite", "CSS"],
    interviewTip:
      "מדגים יכולת לבנות מוצר מלא לבד, עם חשיבה על UX, RTL ומבנה קוד נקי.",
  },
  {
    id: "p2",
    name: "פרויקט דמו 2",
    summary:
      "פרויקט צד שני לדוגמה. כאן יוצג תיאור קצר של הפרויקט ומה בנית בו.",
    stack: ["JavaScript", "HTML", "CSS"],
    interviewTip: "נתון דמו בלבד. לא פרטים אמיתיים.",
  },
];

function ProjectsPage() {
  return (
    <div className="page">
      <div className="page__header">
        <p className="page__eyebrow">פרויקטים</p>
        <h2 className="page__title">הפרויקטים שלי</h2>
      </div>

      <div className="projects-layout">
        <div className="projects-list">
          {demoProjects.map((project) => (
            <div key={project.id} className="card">
              <h3 className="card__title">{project.name}</h3>
              <p className="card__text">{project.summary}</p>
              <div className="chip-row">
                {project.stack.map((tech) => (
                  <span key={tech} className="chip chip--teal">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="project-tip">
                <strong>מתי להשתמש בראיון</strong>
                {project.interviewTip}
              </div>
            </div>
          ))}
        </div>

        <div className="card card--sidebar card--accent">
          <h3 className="card__title">איך להשתמש בזה בראיון</h3>
          <p className="card__text">
            כשמציגים פרויקט בראיון, כדאי להסביר את הבעיה שפתרתם, הטכנולוגיות
            שהשתמשתם, ומה הייתם עושים אחרת היום.
            <br />
            <br />
            שמרו על מבנה: בעיה → פתרון → תוצאה.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;
