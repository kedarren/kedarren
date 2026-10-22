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
  name: "[Your Name]",
  lineColor: "#EE6A1F",      // The color of your subway line, as a hex code. Try "#0F7A3D" (green) or "#1F5FBF" (blue).
  major: "Mechanical Engineering",
  school: "[Your University]",
  classOf: "Class of [20XX]",
  bio: "Mechanical engineering student from New York, working toward bringing high-speed rail to the US and strengthening American manufacturing. [Add a sentence or two about what you're working on now and what you're looking for.]",

  resumePdf: "resume.pdf",   // Upload your resume to GitHub with this exact name, or set to "" to hide the button.
  email: "[you@example.com]",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/[your-profile]" },
    { label: "GitHub",   url: "https://github.com/[yourusername]" }
  ],

  /* ---------- Stations on your line (the map at the top) ----------
     "short" is the label used on phones. You can reorder these,
     rename them, or delete one to remove that section from the site. */
  stations: [
    { id: "about",      label: "About",      short: "About" },
    { id: "experience", label: "Experience", short: "Work" },
    { id: "projects",   label: "Projects",   short: "Projects" },
    { id: "skills",     label: "Skills",     short: "Skills" },
    { id: "education",  label: "Education",  short: "School" },
    { id: "contact",    label: "Contact",    short: "Contact" }
  ],

  /* ---------- Experience (newest first) ---------- */
  experience: [
    {
      title: "[Your role]",
      org: "Schwarz Lab, [Department]",
      dates: "Fall 2026 – Present",
      points: [
        "[What you do in the lab, in one line]",
        "[A result, skill or tool you used]"
      ]
    },
    {
      title: "Summer Study Abroad",
      org: "Greece",
      dates: "Summer [20XX] · 2 months",
      points: [
        "Studied political science, economics and climate change alongside American students from other universities",
        "Started in Athens, then traveled to other cities and islands across Greece"
      ]
    },
    {
      title: "[Internship or job title]",
      org: "[Company], [City]",
      dates: "[Month Year] – [Month Year]",
      points: [
        "[What you built, tested or improved]",
        "[A number if you have one: time saved, parts made, cost cut]"
      ]
    }
  ],

  /* ---------- Projects ----------
     "tags" become the filter buttons above your projects.
     "image" is a file you upload, like "images/gearbox.jpg". Leave "" for now. */
  projects: [
    {
      title: "[Example] Bogie suspension model",
      summary: "[One sentence on what it is and why it matters.]",
      tags: ["SolidWorks", "FEA"],
      image: "",
      role: "[Your role, team size, timeframe]",
      points: [
        "[What you designed or analyzed]",
        "[The result or what you learned]"
      ],
      links: []
    },
    {
      title: "[Example] Wind tunnel test rig",
      summary: "[One sentence on what it is and why it matters.]",
      tags: ["Fluids", "Arduino"],
      image: "",
      role: "[Your role, team size, timeframe]",
      points: [
        "[What you built]",
        "[How you tested it]"
      ],
      links: []
    },
    {
      title: "[Example] Machined tool holder",
      summary: "[One sentence on what it is and why it matters.]",
      tags: ["Machining", "SolidWorks"],
      image: "",
      role: "[Your role, team size, timeframe]",
      points: [
        "[Process you used: mill, lathe, CNC]",
        "[Tolerances or how it performed]"
      ],
      links: [
        { label: "[Report PDF]", url: "#" }
      ]
    }
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
      school: "[Your University]",
      degree: "B.S. Mechanical Engineering",
      dates: "[20XX] – [20XX]",
      details: ["GPA: [x.xx]", "[Honors, clubs or teams]"],
      courses: ["Fluid Mechanics", "MENG 3125 [course title]", "Intro to Environmental Engineering"]
    }
  ],

  /* ---------- Contact ---------- */
  contactNote: "[Open to summer 20XX internships in rail and manufacturing.]"
};
