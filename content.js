/* =====================================================================
   YOUR WEBSITE CONTENT
   Edit this file to change what your site says. You never need to
   touch index.html.

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
  name: "Darren Ke",
  lineColor: "#1F5FBF",      
  bio: "Junior at Yale University studying Mechanical Engineering. Passionate about transportation, material science, and defense.",

  //resumePdf: "resume.pdf",   
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/[your-profile]" },
    { label: "GitHub",   url: "https://github.com/[yourusername]" }
  ],

  /* ---------- Stations on your line (the map at the top) ----------
     "short" is the label used on phones. You can reorder these,
     rename them, or delete one to remove that section from the site. */
  stations: [
    { id: "about",      label: "About",      short: "About" },
    { id: "education",  label: "Education",  short: "School" },
    { id: "experience", label: "Experience", short: "Work" },
    { id: "projects",   label: "Projects",   short: "Projects" },
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
    { group: "CAD & Design",       items: ["[SolidWorks]", "[Fusion 360]", "[GD&T]"] },
    { group: "Analysis",           items: ["[MATLAB]", "[FEA]", "[Excel]"] },
    { group: "Fabrication",        items: ["[Mill]", "[Lathe]", "[3D printing]"] },
    { group: "Languages",          items: ["English", "Korean (coursework)"] }
  ],

  /* ---------- Education ---------- */
  education: [
    {
      school: "Yale University",
      degree: "B.S. Mechanical Engineering",
      dates: "[2024] – [2028]",
      details: ["GPA: [3.67]"],
      courses: ["Fluid Mechanics", "Intro to Environmental Engineering"]
    }
  ],

  /* ---------- Contact ---------- */
  contactNote: "[Open to summer 2027 internships.]"
};
