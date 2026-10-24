/* =====================================================================
   WEBSITE CONTENT
   Edit this file to change what your site says. You never need to
   touch any other file.

   How to edit:
   - Change the text between the quote marks "like this".
   - Items in a list are separated by commas. A list of several things,
     like courses, goes inside square brackets: ["One", "Two", "Three"]
   - To add another item to a list (a job, project, skill...), copy a
     whole { ... } block, paste it after a comma, and change the text.
   - To remove an item, delete its whole { ... } block and its comma.
   - A placeholder looks like "[Your role]". Anything still in square
     brackets is hidden on the site until you replace it, brackets and all.
   - Lines starting with // are notes. The site ignores them.
   - On GitHub: open this file, click the pencil icon, edit, then click
     "Commit changes". The site updates in about a minute.
   - Made a typo? The update simply won't go live, and your site stays
     as it was. Vercel emails you the line number to fix.
   ===================================================================== */

window.SITE = {

  /* ---------- The basics ---------- */
  name: "Darren Ke",                          // Shown in the footer
  headline: "Hello, my name is Darren Ke!",   // The big greeting at the top
  image: "headshot.png",     // Your photo. Upload it next to index.html with this exact name. Hidden until it exists.
  bio: "I am an undergraduate at Yale University studying Mechanical Engineering with a certificate in Energy studies. I love to design and build new things, especially transportation related projects! Check out my projects, read about my interests, and reach out to connect!",

  email: "darren.ke@yale.edu",
  //resumePdf: "resume.pdf",   // Upload a PDF with this name and remove the // to show a Resume button
  links: [
    { label: "Email",    url: "mailto:darren.ke@yale.edu" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/darrenke" }
  ],

  /* ---------- The journey ----------
     The two ends of your line: the route map at the top runs from "from" to "to",
     and so does the ticket next to your name. */
  journey: { from: "Bronx", to: "New Haven" },

  /* ---------- Your ticket ----------
     The rows on the ticket next to your name. Add, remove or reorder rows. */
  ticket: [
    { label: "Passenger", value: "Darren Ke" },
    { label: "Via",       value: "Mechanical Engineering, Yale" },
    { label: "Class",     value: "2028" },
    { label: "Status",    value: "Open to summer 2027 internships" }
  ],

  /* ---------- By the numbers ----------
     The dark panel right after your intro. Keep it to 3 or 4 numbers.
     Delete the whole list to hide the panel. */
  stats: [
    { value: "1,400+", label: "Air-quality sensors in the Gentner Lab network" },
    { value: "300+",   label: "Students at the alumni events I plan" },
    { value: "$5",     label: "Saved per unit by my outdoor sensor enclosures" }
  ],

  /* ---------- Stations on your line (the map at the top) ----------
     Each station shows the list below with the same id, so the
     "research" station shows research: [ ... ].
     "short" is the label used on phones. Reorder, rename or delete
     stations here. */
  stations: [
    { id: "about",      label: "About",      short: "About" },
    { id: "education",  label: "Education",  short: "School" },
    { id: "projects",   label: "Projects",   short: "Projects" },
    { id: "research",   label: "Research",   short: "Labs" },
    { id: "experience", label: "Experience", short: "Work" },
    { id: "skills",     label: "Skills",     short: "Skills" },
    { id: "contact",    label: "Contact",    short: "Contact" }
  ],

  /* ---------- Research (newest first) ---------- */
  research: [
    {
      title: "Project Researcher",
      org: "Nanoprobe Lab",
      dates: "Fall 2026 – Present",
      points: [
        "Running high-speed impact tests on glass with a pneumatic launcher to study how cracks form",
        "CAD, Materials Science, LabVIEW"
      ]
    },
    {
      title: "Research Assistant",
      org: "Gentner Lab, Yale Engineering",
      dates: "Sep 2025 – Present",
      points: [
        "Comparing indoor and outdoor air quality across New Haven with a network of 1,400+ PurpleAir, AirGradient, Zigbee and Aranet sensors",
        "Building a long-term data collection system with Python and Raspberry Pi that stores more data at a lower monthly cost",
        "Wrote a step-by-step guide that lets non-specialists assemble Raspberry Pi, Home Assistant and sensor packages",
        "Designed CAD enclosures that protect outdoor sensors in extreme weather, saving at least $5 per unit"
      ]
    }
  ],

  /* ---------- Experience (newest first) ---------- */
  experience: [
    {
      title: "Teaching Assistant, Materials Science",
      org: "Yale School of Engineering",
      dates: "Fall 2026",
      points: [
        "Teaching assistant for an introductory materials science course"
      ]
    },
    {
      title: "Class of 2028 Delegate",
      org: "Yale Alumni Association",
      dates: "Sep 2025 – Present",
      points: [
        "Connect a class of 1,500+ students with alumni and report on University updates and alumni events",
        "Plan events for 300+ students and 75+ alumni at a time, opening up mentorship, career and fundraising opportunities"
      ]
    },
    {
      title: "Drives Engineer",
      org: "Yale Robotics Rover",
      dates: "Jan 2025 – Present",
      points: [
        "Find and fix design faults with sub-team leads in CAD: wheel treads, fillets to reduce stress concentrations, and component mates",
        "Selected machine elements, then machined and built the rover's suspension and chassis"
      ]
    },
    {
      title: "Office Aide",
      org: "Pierson College Head of College Office",
      dates: "Jan 2025 – Present",
      points: [
        "Run front-office operations: phones, student support and hospitality at college events",
        "Set up and run major events including Convocation, Family Receptions and Commencement"
      ]
    }
  ],

  /* ---------- Projects ----------
     Each project shows as a preview card. Clicking it opens a full
     project window with everything below.

     tags       the filter buttons above your projects (they appear once
                you have two or more projects)
     image      the card photo, like "images/knife.jpg". "" until you have one.
     role       your role, team size and timeframe
     points     short highlights, shown on the card and in the window
     overview   paragraphs at the top of the window
     reasoning  your design decisions, one box each. Give one an image
                and the box gets a line pointing to a spot on it:
                  image    the picture, like "images/knife-linkage.jpg"
                  caption  a short label under the picture
                  point    where the line lands, as
                           [percent from left, percent from top].
                           [50, 50] is the center. Leave it out to aim
                           at the image's edge instead.
     links      buttons, like { label: "Report (PDF)", url: "files/knife-report.pdf" }

     Every project also gets its own link to share, made from its title:
     darrenke.com/#project-foot-operated-kitchen-knife */
  projects: [
    {
      title: "Foot Operated Kitchen Knife",
      summary: "A foot-powered cutting device that lets people with limited hand dexterity slice food on their own.",
      tags: ["SolidWorks", "FEA"],
      image: "",
      role: "Team of 4 · MENG 1105 Mechanical Design · Spring 2026",
      points: [
        "Designed for people with arthritis and limited hand dexterity",
        "Drove the design with a House of Quality, FMEA and DFA",
        "Built an aluminum prototype that cut a banana in a live demo"
      ],
      overview: [
        "Cutting food is a basic kitchen task that many people with limited hand dexterity can't do safely on their own. About half of people over 70 struggle with tasks that need fine motor control, so many rely on caregivers to prepare food. Our team of four set out to design a knife you work with your foot.",
        "A House of Quality ranked what users needed most: a low input force, safety, adjustment to different counter heights, and durability. The alternatives fall short: rocker knives and mandolines still take hand strength, a mandoline puts fingers right next to the blade, and food processors need power and can't cut even slices.",
        "The final design uses a foot pedal, a string wound on a threaded cylinder, and a parallelogram linkage that carries the blade. The aluminum prototype cut a banana in a live demo and met our targets for input force, output force, endurance, safety and height range. It missed the weight target by a wide margin, so cutting weight is the top item for a next version."
      ],
      reasoning: [
        {
          title: "Aluminum and brackets, not welds",
          text: "We built the frame from aluminum: strong, nonporous, cheaper and easier to source than other metals. Joining it with brackets instead of welding kept every joint adjustable, and making the arms, base and bearings one standard size meant fewer different parts to order.",
          image: ""
        },
        {
          title: "Carrying force with a string",
          text: "To get force from the pedal to the blade we compared a Bowden cable, a rigid rod, a hydraulic line, and a pulley and string. The final design runs a string around a cylinder, which we threaded to add surface area, and with it friction, so the string wouldn't slip.",
          image: ""
        },
        {
          title: "What the FMEA predicted",
          text: "Before building, we listed how the design could fail: linkage arms buckling under compression, pivots sticking at the top or bottom of the stroke, the blade not reaching the board, clamps loosening, and the return spring sticking. It gave us confidence the string would hold and warned that the spring probably wouldn't work, which testing confirmed.",
          image: ""
        },
        {
          title: "Fixes from testing",
          text: "The arms slid off the base, so we 3D-printed caps and drilled them through to lock the arms in place. The cutting force was strong enough to lift the base off the table. The new clamps blocked the arms until we cut them down, and we removed a whole arm that added weight without doing any work.",
          image: ""
        },
        {
          title: "What a second version would change",
          text: "Cut weight first: the solid cylinder could be hollow or printed in PLA. Add a hard stop so the linkage can't fold flat, where the force needed to reset it spikes, and design a better elastic return. And agree on one unit system across the team from day one.",
          image: ""
        }
      ],
      links: []
    }
  ],

  /* ---------- Skills (grouped) ---------- */
  skills: [
    { group: "CAD & Design",       items: ["SolidWorks", "Onshape"] },
    { group: "Analysis",           items: ["MATLAB", "FEA", "Excel"] },
    { group: "Fabrication",        items: ["Mill", "Lathe", "CNC", "Additive Manufacturing", "Hand Tools"] },
    { group: "Programming & Data", items: ["Python", "C++", "C", "Raspberry Pi", "Home Assistant", "LabVIEW", "LoggerPro"] },
    { group: "Languages",          items: ["English", "Mandarin (Native)", "Spanish (coursework)", "Korean (coursework)"] }
  ],

  /* ---------- Education ---------- */
  education: [
    {
      school: "Yale University",
      degree: "B.S. Mechanical Engineering (ABET‑accredited)",
      dates: "2024 – 2028",
      details: ["Certificate in Energy Studies", "GPA: 3.67"],
      honors: ["STARS I Research Fellow", "Buckley Institute Fellow", "Yale Entrepreneurial Society Fellow"],
      activities: ["AIAA", "ASME", "St. Thomas More Undergraduate Council"],
      /* Each semester is a row that opens to show its courses.
         Newest first. Courses go inside [ ], separated by commas. */
      semesters: [
        {
          term: "Fall 2026",
          courses: [
            "MENG 3125: Machine Elements and Manufacturing Processes",
            "MENG 3422: Fluid Mechanics",
            "ENVE 1200: Intro to Environmental Engineering",
            "KREN 1300: Intermediate Korean",
            "MATH 2220: Linear Algebra"
          ]
        },
        {
          term: "Spring 2026",
          courses: [
            "ENAS 1940: Ordinary & Partial Differential Equations",
            "MENG 1105: Mechanical Design",
            "MENG 2050: Computer Aided Engineering",
            "MENG 2511: Thermodynamics for Mechanical Engineers",
            "PHIL 1126: Early Modern Philosophy from Descartes to Kant",
            "HUMS S3411: Life Worth Living"
          ]
        },
        {
          term: "Fall 2025",
          courses: [
            "ECE 2000: Electronics",
            "ENAS 1300: Computing for Engineering and Scientists",
            "MENG 2311: Strength and Deformation",
            "MENG 2615: Materials Science"
          ]
        },
        {
          term: "Spring 2025",
          courses: [
            "ENAS 151: Multivariable Calculus for Engineers",
            "HIST 081: Displacement in Asia after WW2",
            "KREN 120: Elementary Korean II",
            "PHYS 166L: General Physics Laboratory",
            "PHYS 181: University Physics II"
          ]
        },
        {
          term: "Fall 2024",
          courses: [
            "KREN 110: Elementary Korean I",
            "MATH 115: Calculus II",
            "PHYS 165L: General Physics Laboratory",
            "PHYS 180: University Physics I",
            "ENGL S114: Writing Seminar I",
            "MATH S102: Approximation and Prediction I"
          ]
        }
      ]
    }
  ],

  /* ---------- Contact ---------- */
  contactNote: "Open to summer 2027 design, manufacturing, and research internships. Email is the fastest way to reach me, or connect on LinkedIn."
};
