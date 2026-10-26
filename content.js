/* =====================================================================
   WEBSITE CONTENT
   Everything the site says lives in this file. You never need to touch
   any other file.

   How to edit:
   - Change the text between the quote marks "like this".
   - Items in a list are separated by commas. A list goes inside square
     brackets: ["One", "Two", "Three"]
   - To add an item (a project, a role, a course...), copy a whole
     { ... } block, paste it after a comma, and change the text.
   - To remove an item, delete its whole { ... } block and its comma.
   - Anything still written as "[like this]" is hidden on the site until
     you replace it, brackets and all.
   - On GitHub: open this file, click the pencil icon, edit, then click
     "Commit changes". The site updates in about a minute.
   - Made a typo? The update simply won't go live, and your site stays
     as it was. Vercel emails you the line number to fix.
   ===================================================================== */

window.SITE = {

  /* ---------- Basics ---------- */
  name: "Darren Ke",
  role: "Mechanical Engineering, Yale University",
  email: "darren.ke@yale.edu",
  location: "New Haven, Connecticut",
  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/darrenke" }
  ],
  photo: "headshot.png",     // Shown on the About page. Upload it next to index.html with this exact name.

  /* ---------- Home page ---------- */
  statement: "Mechanical engineering student at Yale. I design and build things, especially for transportation.",
  facts: [
    { label: "Currently", value: "Lead undergraduate researcher, Yale Nanoprobe Lab" },
    { label: "Studying",  value: "B.S. Mechanical Engineering, Yale, 2028" },
    { label: "Seeking",   value: "Summer 2027 internships in design, manufacturing and research" }
  ],

  /* ---------- About ---------- */
  about: [
    "I'm an undergraduate at Yale studying mechanical engineering, with a certificate in Energy Studies. I like designing and building things, especially for transportation.",
    "Right now I lead an undergraduate research project in Yale's Nanoprobe Lab on how glass fractures under high-speed impact, and I'm an engineer and treasurer on Yale's autonomous rover team."
  ],
  experience: [
    {
      title: "Teaching Assistant, Materials Science",
      org: "Yale School of Engineering",
      dates: "Fall 2026",
      points: ["Teaching assistant for an introductory materials science course"]
    },
    {
      title: "Class of 2028 Delegate",
      org: "Yale Alumni Association",
      dates: "Sep 2025 – Present",
      points: [
        "Connect a class of 1,500+ students with alumni and report on University updates and alumni events",
        "Plan events for 300+ students and 75+ alumni at a time"
      ]
    },
    {
      title: "Office Aide",
      org: "Pierson College Administrative Office",
      dates: "Jan 2025 – Present",
      points: [
        "Serve as a primary point of contact for students and staff, and coordinate with university administrators on operational and logistical needs",
        "Lead execution of major college events such as move-in and commencement"
      ]
    }
  ],
  skills: [
    { group: "Design and fabrication", items: ["Onshape", "SolidWorks", "Raspberry Pi"] },
    { group: "Programming and software", items: ["Python", "C", "C++", "MATLAB", "Excel", "LabVIEW"] },
    { group: "Manufacturing and machining", items: ["Lathe", "CNC", "Additive manufacturing", "Waterjet", "Laser cutting", "Hand tools"] },
    { group: "Languages", items: ["English", "Mandarin (native)", "Spanish (coursework)", "Korean (coursework)"] }
  ],

  /* ---------- Education ---------- */
  education: [
    {
      school: "Yale University",
      place: "New Haven, CT",
      degree: "B.S. Mechanical Engineering (ABET-accredited)",
      dates: "2024 – May 2028 (expected)",
      details: ["Energy Studies Certificate", "GPA 3.67 / 4.0"],
      distinctions: [
        "Science, Technology and Research Scholars (STARS) Fellowship",
        "American Society of Mechanical Engineers",
        "American Institute of Aeronautics and Astronautics",
        "Yale Fishing"
      ],
      /* Courses go inside [ ], separated by commas. Newest term first. */
      semesters: [
        { term: "Fall 2026", courses: [
          "MENG 3125: Machine Elements and Manufacturing Processes",
          "MENG 3422: Fluid Mechanics",
          "ENVE 1200: Intro to Environmental Engineering",
          "KREN 1300: Intermediate Korean",
          "MATH 2220: Linear Algebra"
        ] },
        { term: "Spring 2026", courses: [
          "ENAS 1940: Ordinary & Partial Differential Equations",
          "MENG 1105: Mechanical Design",
          "MENG 2050: Computer Aided Engineering",
          "MENG 2511: Thermodynamics for Mechanical Engineers",
          "PHIL 1126: Early Modern Philosophy from Descartes to Kant",
          "HUMS S3411: Life Worth Living"
        ] },
        { term: "Fall 2025", courses: [
          "ECE 2000: Electronics",
          "ENAS 1300: Computing for Engineering and Scientists",
          "MENG 2311: Strength and Deformation",
          "MENG 2615: Materials Science"
        ] },
        { term: "Spring 2025", courses: [
          "ENAS 151: Multivariable Calculus for Engineers",
          "HIST 081: Displacement in Asia after WW2",
          "KREN 120: Elementary Korean II",
          "PHYS 166L: General Physics Laboratory",
          "PHYS 181: University Physics II"
        ] },
        { term: "Fall 2024", courses: [
          "KREN 110: Elementary Korean I",
          "MATH 115: Calculus II",
          "PHYS 165L: General Physics Laboratory",
          "PHYS 180: University Physics I",
          "ENGL S114: Writing Seminar I",
          "MATH S102: Approximation and Prediction I"
        ] }
      ]
    }
  ],

  /* ---------- Resume ----------
     To update: upload your new PDF over resume.pdf on GitHub (same name),
     and change "updated" below. */
  resume: {
    pdf: "resume.pdf",
    preview: "assets/resume-preview.webp",
    updated: "October 2026"
  },

  /* ---------- Engineering projects ----------
     Each project gets its own page, at darrenke.com/projects/ plus its title
     in lowercase with dashes (for example /projects/pneumatic-pellet-launcher).

     image      a photo, like "images/launcher.jpg". "" until you have one.
     reasoning  your design decisions. Give one an image and a
                point: [percent from left, percent from top] and a line is
                drawn from the text to that spot on the photo.
     featured   true puts the project on the home page. */
  projects: [
    {
      title: "Pneumatic Pellet Launcher",
      summary: "A pneumatic high-speed impact tester that fires pellets at around 100 m/s for research on how glass fractures.",
      role: "Mechanical design and systems development",
      context: "Yale Nanoprobe Lab",
      dates: "Jun 2026 – Present",
      tags: ["CAD", "Machining", "Waterjet", "LabVIEW", "Pneumatics"],
      featured: true,
      image: "",
      points: [
        "Lead development and continuous improvement of a pneumatic high-speed impact tester using an integrated system of compressed air, an actuated ball valve and a solenoid, firing pellets at around 100 m/s",
        "Designed and manufactured a glass sample fixture using CAD, waterjet cutting and milling to reduce energy interference in high-speed impacts, improving test reliability by about 5%",
        "Developing hardware and LabVIEW controls to automate sample-stage positioning across multiple samples and holders"
      ],
      overview: [],
      reasoning: [],
      links: []
    },
    {
      title: "Autonomous Rover",
      summary: "A competition rover built by a 30-member student robotics team, where I work as an engineer and treasurer.",
      role: "Engineer and treasurer",
      context: "Yale robotics rover team",
      dates: "Jan 2025 – Present",
      tags: ["FEA", "CAD", "3D printing", "CNC"],
      featured: false,
      image: "",
      points: [
        "Lead a 30-member robotics team toward a competition-ready rover by securing a $15,000 budget, managing funds, reviewing the bill of materials and setting project milestones",
        "Identified fault areas and reduced peak stress concentrations in the rover wheel using FEA-driven optimization",
        "Rapid fabrication and prototype iteration with 3D printing and CNC milling to support continuous design validation and testing"
      ],
      overview: [],
      reasoning: [],
      links: []
    },
    {
      title: "Foot-Actuated Kitchen Knife",
      aliases: ["foot-operated-kitchen-knife"],   // its address on the previous version of the site
      summary: "A foot-powered cutting device that lets people with limited hand dexterity slice food on their own.",
      role: "Mechanical design",
      context: "MENG 1105 Mechanical Design",
      dates: "2026",
      tags: ["CAD", "FMEA", "DFA", "Prototyping"],
      featured: false,
      image: "",
      points: [
        "Developed a foot-actuated cutting device using a four-bar linkage, a pulley system and an elastic return mechanism",
        "Reached an estimated 100 N output force through iterative CAD design, fabrication and testing",
        "Built an aluminum prototype that cut a banana in a live demo"
      ],
      overview: [
        "Cutting food is a basic kitchen task that many people with limited hand dexterity can't do safely on their own. About half of people over 70 struggle with tasks that need fine motor control, so many rely on caregivers to prepare food. The goal was a knife you work with your foot.",
        "A House of Quality ranked what users needed most: a low input force, safety, adjustment to different counter heights, and durability. The alternatives fall short: rocker knives and mandolines still take hand strength, a mandoline puts fingers right next to the blade, and food processors need power and can't cut even slices.",
        "The final aluminum prototype met its targets for input force, output force, endurance, safety and height range. It missed the weight target by a wide margin, so cutting weight is the top item for a next version."
      ],
      reasoning: [
        {
          title: "Aluminum and brackets, not welds",
          text: "The frame is aluminum: strong, nonporous, cheaper and easier to source than other metals. Joining it with brackets instead of welding kept every joint adjustable, and making the arms, base and bearings one standard size meant fewer different parts to order.",
          image: ""
        },
        {
          title: "Carrying force with a string",
          text: "Options for getting force from the pedal to the blade included a Bowden cable, a rigid rod, a hydraulic line, and a pulley and string. The final design runs a string around a cylinder, threaded to add surface area, and with it friction, so the string wouldn't slip.",
          image: ""
        },
        {
          title: "What the FMEA predicted",
          text: "Before building, the failure modes were listed: linkage arms buckling under compression, pivots sticking at the top or bottom of the stroke, the blade not reaching the board, clamps loosening, and the return spring sticking. It gave confidence the string would hold and warned that the spring probably wouldn't work, which testing confirmed.",
          image: ""
        },
        {
          title: "Fixes from testing",
          text: "The arms slid off the base, so 3D-printed caps were drilled through to lock them in place. The cutting force was strong enough to lift the base off the table, the new clamps blocked the arms until they were cut down, and a whole arm was removed because it added weight without doing any work.",
          image: ""
        },
        {
          title: "What a second version would change",
          text: "Cut weight first: the solid cylinder could be hollow or printed in PLA. Add a hard stop so the linkage can't fold flat, where the force needed to reset it spikes, and design a better elastic return.",
          image: ""
        }
      ],
      links: []
    }
  ],

  /* ---------- Research ---------- */
  research: [
    {
      title: "Lead Undergraduate Researcher",
      org: "Yale Nanoprobe Lab",
      dates: "Jun 2026 – Present",
      current: true,
      summary: "Leading a Corning Inc.-funded project on crack morphology in oxide glasses under dynamic, high-speed loading.",
      points: [
        "Measure coefficients of restitution across three oxide glass compositions at multiple impact velocities to quantify how energy dissipation relates to composition",
        "Use GIXRD, high-speed imaging and microscopy to characterize coatings, residual stresses and surface conditions, and correlate them with fracture response"
      ],
      methods: ["GIXRD", "High-speed imaging", "Microscopy", "LabVIEW"]
    },
    {
      title: "Lab Assistant",
      org: "Gentner Lab, Yale School of Engineering",
      dates: "Sep 2025 – Jan 2026",
      current: false,
      summary: "Indoor and outdoor air-quality monitoring across homes in New Haven.",
      points: [
        "Developed a data acquisition system sampling 150+ homes with Raspberry Pi, Python and air-quality sensors, increasing storage capacity and cutting potential monthly costs by more than $14",
        "Designed and fabricated protective sensor enclosures and compact support structures with CAD and additive manufacturing, improving weather resistance and cutting potential fabrication costs by $10 per unit",
        "Led a study of how QuantAQ sensor orientation affects PM10 and PM2.5 measurements, using MATLAB, to improve experimental reliability"
      ],
      methods: ["Python", "Raspberry Pi", "MATLAB", "CAD", "Additive manufacturing"]
    }
  ],

  /* ---------- Contact ---------- */
  contactNote: "Open to summer 2027 internships in design, manufacturing and research. Email is the fastest way to reach me."
};
