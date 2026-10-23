/* =====================================================================
   WEBSITE CONTENT
   Edit this file to change what your site says.

   How to edit:
   - Change the text between the quote marks "like this".
   - Keep the commas at the ends of lines.
   - To add another item to a list (a job, project, skill...), copy a
     whole { ... } block, paste it after a comma, and change the text.
   - To remove an item, delete its whole { ... } block and its comma.
   - Anything in [square brackets] is a placeholder to replace.
   - On GitHub: open this file, click the pencil icon, edit,
     then click "Commit changes". The site updates in a minute or two.
   ===================================================================== */

window.SITE = {

  /* ---------- The basics ---------- */
  image: "headshot.png",
  name: "Hello, my name is Darren Ke!",
  lineColor: "#1F5FBF",      
  bio: "I am an undergraduate at Yale University studying Mechanical Engineering with a certificate in Energy studies. I love to design and build new things, especially transportation related projects! Check out my projects, read about my interests, and reach out to connect!",

  //resumePdf: "resume.pdf",   
  links: [
     {label: "Email", url: "mailto:darren.ke@yale.edu"}, 
    { label: "LinkedIn", url: "https://www.linkedin.com/in/darrenke" },
  ],

  /* ---------- Stations on your line (the map at the top) ---------- */
  stations: [
    { id: "about",      label: "About",      short: "About" },
    { id: "education",  label: "Education",  short: "School" },
    { id: "projects",   label: "Projects",   short: "Projects" },
     {id: "research", label: "Research", short: "Research"},
    { id: "skills",     label: "Skills",     short: "Skills" },
    { id: "contact",    label: "Contact",    short: "Contact" }
  ],

  /* ---------- Experience ---------- */
  experience: [
    {
      title: "Project Researcher",
      org: "Nanoprobe Lab",
      dates: "Fall 2026 – Present",
      points: [
        "Conducting high speed impact testing",
        "CAD, Materials Science, LaVIEW"
      ]
    },
  ],

  /* ---------- Projects ----------
     "tags" become the filter buttons above your projects.
     "image" is a file you upload, like "images/gearbox.jpg". Leave "" for now. */
  projects: [
    {
      title: "Foot Operated Kitchen Knife",
      summary: "MENG 1105 Final Project",
      tags: ["SolidWorks", "FEA"],
      image: "",
      points: [
        "Foot Actuated Kitchen Knife intended for those with arthritis",
        "CAD, FMEA, DFA"
      ],
      links: []
    },
  ],

  /* ---------- Skills (grouped) ---------- */
  skills: [
    { group: "CAD & Design",       items: ["SolidWorks", "Onshape", "Raspberry Pi"] },
    { group: "Analysis",           items: ["MATLAB", "FEA", "Excel", "LoggerPro", "LabVIEW"] },
    { group: "Fabrication",        items: ["Mill", "Lathe", "Additive Manufacturing", "CNC", "Hand Tools"] },
     {group: "Programming",       items: ["C++", "C", "Python"]
    { group: "Languages",          items: ["English", "Mandarin (Native)", "Spanish (coursework)", "Korean (coursework)"] }
  ],

  /* ---------- Education ---------- */
  education: [
    {
      school: "Yale University",
      degree: "B.S. Mechanical Engineering",
      dates: "[2024] – [2028]",
      details: ["GPA: [3.67]"],
      semesters: [
        { term: "Fall 2026",   courses: "MENG 3125: Machine Elements and Manufacturing Processes", "MENG 3422: Fluid Mechanics", "ENVE 1200: Intro to Environmental Engineering", "KREN 1300: Intermediate Korean", "MATH 2220: Linear Algebra" },
        { term: "Spring 2026", courses: "ENAS 1940: Ordinary & Partial Differential Equations ", "MENG 1105: Mechanical Design", "MENG 2050: Computer Aided Engineering", "MENG 2511: Thermodynamics for Mechanical Engineers", "PHIL 1126: Early Modern Philosophy from Descartes to Kant", "HUMS S3411: Life Worth Living" },
        { term: "Fall 2025", courses: "ECE 2000: Electronics", " ENAS 1300: Computing for Engineering and Scientists", "MENG 2311: Strength and Deformation", "MENG 2615: Materials Science"}, 
         { term: "Spring 2025", courses: "ENAS 151: Multivariable Calculus for Engineers", "HIST 081: Displacement in Asia after WW2", "KREN 120: Elementary Korean II", "PHYS 166L: General Physics Laboratory", "PHYS 181: University Physics II"}, 
         {term: "Fall 2024", courses: "KREN 110: Elementary Korean I", "MATH 115: Calculus II", "PHYS 165L: General Physics Laboratory", "PHYS 180: University Physics I", "ENGL S114: Writing Seminar I", "MATH S102: Approximation and Prediction I"}
      ]    
    }
  ],

  /* ---------- Contact ---------- */
  contactNote: "Open to summer 2027 design, manufacturing, and research internships. Email me at darren.ke@yale.edu, or contact me on Linkedin!"
};
