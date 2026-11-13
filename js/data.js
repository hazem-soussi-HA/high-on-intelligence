/* =====================================================================
   High on Intelligence — Hazem Soussi · The Thinking Machine
   data.js — curated, verified, real-world learning resources
   Every URL below points to a real, publicly accessible resource.
   ===================================================================== */

const RESOURCES = [
  /* ---------------- AI / Machine Learning / LLMs ---------------- */
  { id:"ai-fastai", title:"Practical Deep Learning for Coders", provider:"fast.ai / Jeremy Howard", url:"https://www.fast.ai/", area:"ai", type:"course", level:"intermediate", cost:"free", hours:40, desc:"Top-down, code-first deep learning. Build state-of-the-art models before the math. The fastest honest on-ramp into real AI engineering." },
  { id:"ai-cs50ai", title:"CS50's Introduction to AI with Python", provider:"Harvard / edX", url:"https://cs50.harvard.edu/ai/", area:"ai", type:"course", level:"beginner", cost:"free", hours:30, desc:"Search, knowledge, optimization, learning, neural networks and LLMs — Harvard's AI course, free with full lectures and problem sets." },
  { id:"ai-mlcrash", title:"Machine Learning Crash Course", provider:"Google", url:"https://developers.google.com/machine-learning/crash-course", area:"ai", type:"course", level:"beginner", cost:"free", hours:25, desc:"Google's classic intro: 100+ bite-sized videos, animations and hands-on exercises. A solid, practical first hour of ML." },
  { id:"ai-kaggle", title:"Kaggle Learn — Micro-courses", provider:"Kaggle", url:"https://www.kaggle.com/learn", area:"ai", type:"practice", level:"beginner", cost:"free", hours:20, desc:"Hands-on tracks: intro to ML, deep learning, NLP, computer vision, data cleaning. Real datasets, real notebooks, certificates." },
  { id:"ai-mitdeep", title:"MIT 6.S191 — Intro to Deep Learning", provider:"MIT", url:"https://introtodeeplearning.com/", area:"ai", type:"course", level:"intermediate", cost:"free", hours:35, desc:"MIT's crash course in deep learning with lectures, labs in TensorFlow and the same week-based structure MIT students get." },
  { id:"ai-hfnlp", title:"Hugging Face NLP Course", provider:"Hugging Face", url:"https://huggingface.co/learn/nlp-course", area:"ai", type:"course", level:"intermediate", cost:"free", hours:30, desc:"Transformers, tokenizers, fine-tuning, sharing models — the canonical course from the team that built the modern open-model hub." },
  { id:"ai-pytorch", title:"PyTorch Official Tutorials", provider:"PyTorch", url:"https://pytorch.org/tutorials/", area:"ai", type:"doc", level:"intermediate", cost:"free", hours:20, desc:"From absolute basics to deployment: tensors, autograd, training loops, CNNs, RNNs, and exporting models to production." },
  { id:"ai-tf", title:"TensorFlow Tutorials", provider:"Google / TensorFlow", url:"https://www.tensorflow.org/tutorials", area:"ai", type:"doc", level:"intermediate", cost:"free", hours:20, desc:"Official hands-on notebooks covering Keras models, vision, text, audio, TFLite and production deployment." },
  { id:"ai-karpathy", title:"Neural Networks: Zero to Hero", provider:"Andrej Karpathy (YouTube)", url:"https://www.youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ", area:"ai", type:"video", level:"intermediate", cost:"free", hours:15, desc:"Build backprop from scratch, micrograd, GPT from zero — the most loved build-everything-yourself deep learning series in existence." },
  { id:"ai-3b1b", title:"Neural Networks — 3Blue1Brown", provider:"Grant Sanderson / YouTube", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", area:"ai", type:"video", level:"beginner", cost:"free", hours:3, desc:"Four gorgeous animated videos that make gradient descent and backpropagation click intuitively. Watch these before any course." },
  { id:"ai-cs229", title:"Stanford CS229 — Machine Learning", provider:"Stanford University", url:"https://cs229.stanford.edu/", area:"ai", type:"course", level:"advanced", cost:"free", hours:60, desc:"The legendary graduate ML course: supervised/unsupervised learning, SVM, kernels, generalization. Lecture notes freely available." },
  { id:"ai-d2l", title:"Dive into Deep Learning (book)", provider:"d2l.ai — Aston Zhang et al.", url:"https://d2l.ai/", area:"ai", type:"book", level:"intermediate", cost:"free", hours:80, desc:"An interactive, runnable deep-learning textbook — every concept with executable PyTorch/TensorFlow code. The modern D2L standard." },
  { id:"ai-goodfellow", title:"Deep Learning (book)", provider:"Goodfellow, Bengio, Courville", url:"https://www.deeplearningbook.org/", area:"ai", type:"book", level:"advanced", cost:"free", hours:100, desc:"The definitive graduate-level reference on deep learning theory — math, architectures, regularization. Read online, free." },
  { id:"ai-prompting", title:"Prompt Engineering Guide", provider:"DAIR.AI", url:"https://www.promptingguide.ai/", area:"ai", type:"article", level:"beginner", cost:"free", hours:8, desc:"The most complete open guide to prompting: zero/few-shot, CoT, RAG, agents, with papers and examples. Community-maintained." },
  { id:"ai-anthropicdocs", title:"Claude / Anthropic API Documentation", provider:"Anthropic", url:"https://docs.anthropic.com/", area:"ai", type:"doc", level:"intermediate", cost:"free", hours:10, desc:"Official docs for building with Claude: tool use, prompt caching, extended thinking, agents and best practices." },
  { id:"ai-openaiprompt", title:"OpenAI Prompt Engineering Guide", provider:"OpenAI", url:"https://platform.openai.com/docs/guides/prompt-engineering", area:"ai", type:"doc", level:"beginner", cost:"free", hours:4, desc:"Official patterns for reliable prompting: clear instructions, reference text, splitting complex tasks into simpler subtasks." },
  { id:"ai-langchain", title:"LangChain — Getting Started", provider:"LangChain", url:"https://python.langchain.com/docs/introduction/", area:"ai", type:"doc", level:"intermediate", cost:"free", hours:15, desc:"Build LLM applications and agents: chains, retrieval, tools, memory. The de-facto framework for LLM orchestration." },
  { id:"ai-thinkingmachines", title:"Thinking Machines Lab", provider:"Mira Murati's lab", url:"https://thinkingmachines.ai/", area:"ai", type:"community", level:"advanced", cost:"free", hours:2, desc:"The frontier AI lab behind Inkling — research blog on RL, long-context and model behavior. The spiritual home of 'the thinking machine'." },
  { id:"ai-dlcourse", title:"DeepLearning.AI — Short Courses", provider:"Andrew Ng / DeepLearning.AI", url:"https://www.deeplearning.ai/courses/", area:"ai", type:"course", level:"intermediate", cost:"freemium", hours:30, desc:"Andrew Ng's short, surgical courses: RLHF, RAG, agents, LangChain, diffusion, and the classic 5-course specialization." },
  { id:"ai-ollama", title:"Run Local LLMs with Ollama", provider:"Ollama", url:"https://ollama.com/", area:"ai", type:"practice", level:"beginner", cost:"free", hours:5, desc:"Download and run Llama, Qwen, DeepSeek and friends locally in minutes. The fastest way to truly own the thinking machine." },
  { id:"ai-openai-docs", title:"OpenAI API Reference", provider:"OpenAI", url:"https://platform.openai.com/docs/api-reference", area:"ai", type:"doc", level:"intermediate", cost:"free", hours:10, desc:"Complete API surface: chat, embeddings, images, audio, function/tool calling, structured outputs." },
  { id:"ai-hf-models", title:"Hugging Face Model Hub", provider:"Hugging Face", url:"https://huggingface.co/models", area:"ai", type:"community", level:"beginner", cost:"free", hours:5, desc:"Over a million open models. Search, filter, evaluate and download — the GitHub of machine learning." },

  /* ---------------- Software Engineering & Web ---------------- */
  { id:"swe-cs50", title:"CS50x — Introduction to Computer Science", provider:"Harvard / edX", url:"https://cs50.harvard.edu/x/", area:"swe", type:"course", level:"beginner", cost:"free", hours:60, desc:"The world's most popular intro CS course. C, Python, SQL, web — with world-class production value and a global community." },
  { id:"swe-fcc", title:"freeCodeCamp", provider:"freeCodeCamp.org", url:"https://www.freecodecamp.org/learn", area:"swe", type:"practice", level:"beginner", cost:"free", hours:300, desc:"Full certifications in responsive web, JS algorithms, frontend, backend, data analysis and ML — entirely free, project-based." },
  { id:"swe-mdn", title:"MDN Web Docs", provider:"Mozilla", url:"https://developer.mozilla.org/", area:"swe", type:"doc", level:"beginner", cost:"free", hours:50, desc:"The reference for HTML, CSS, JavaScript, Web APIs. Every professional web developer lives here." },
  { id:"swe-odin", title:"The Odin Project", provider:"The Odin Project", url:"https://www.theodinproject.com/", area:"swe", type:"course", level:"beginner", cost:"free", hours:400, desc:"A full-stack curriculum: Node/Express or Ruby on Rails, Git, projects on day one. Built to get you job-ready." },
  { id:"swe-fullstackopen", title:"Full Stack Open", provider:"University of Helsinki", url:"https://fullstackopen.com/", area:"swe", type:"course", level:"intermediate", cost:"free", hours:120, desc:"Deep modern web: React, Redux, Node, GraphQL, TypeScript, testing, CI/CD and containers — from a top European university." },
  { id:"swe-eloquent", title:"Eloquent JavaScript (book)", provider:"Marijn Haverbeke", url:"https://eloquentjavascript.net/", area:"swe", type:"book", level:"beginner", cost:"free", hours:40, desc:"The best free introduction to programming through JavaScript — deep, elegant, and genuinely fun to read." },
  { id:"swe-roadmap", title:"roadmap.sh — Developer Roadmaps", provider:"roadmap.sh", url:"https://roadmap.sh/", area:"swe", type:"community", level:"beginner", cost:"free", hours:2, desc:"Interactive, community-vetted roadmaps for frontend, backend, DevOps, AI/ML, security and more. Pick your path, follow the steps." },
  { id:"swe-githubskills", title:"GitHub Skills", provider:"GitHub", url:"https://skills.github.com/", area:"swe", type:"practice", level:"beginner", cost:"free", hours:6, desc:"Learn Git & GitHub workflows (branching, PRs, Actions, Pages) by doing — each course is a real repository you work inside." },
  { id:"swe-docker", title:"Docker — Get Started", provider:"Docker", url:"https://docs.docker.com/get-started/", area:"swe", type:"doc", level:"intermediate", cost:"free", hours:10, desc:"Containers from zero: images, Dockerfiles, Compose, multi-stage builds and shipping to production registries." },
  { id:"swe-k8s", title:"Kubernetes — Kubernetes Basics", provider:"Kubernetes / CNCF", url:"https://kubernetes.io/docs/tutorials/kubernetes-basics/", area:"swe", type:"doc", level:"advanced", cost:"free", hours:15, desc:"Official interactive browser terminal tutorial: deploy, scale, update and debug apps on a real cluster." },
  { id:"swe-linuxjourney", title:"Linux Journey", provider:"linuxjourney.com", url:"https://linuxjourney.com/", area:"swe", type:"course", level:"beginner", cost:"free", hours:25, desc:"Bite-sized Linux fundamentals — filesystem, permissions, processes, networking, package management, text processing." },
  { id:"swe-ocw", title:"MIT OpenCourseWare", provider:"MIT", url:"https://ocw.mit.edu/", area:"swe", type:"course", level:"intermediate", cost:"free", hours:200, desc:"2,500+ MIT courses free forever — from 6.0001 to graduate distributed systems. The deepest free university on earth." },
  { id:"swe-rustbook", title:"The Rust Programming Language (book)", provider:"rust-lang.org", url:"https://doc.rust-lang.org/book/", area:"swe", type:"book", level:"intermediate", cost:"free", hours:45, desc:"The official Rust book — ownership, borrowing, lifetimes, traits. Written by the language team; famously excellent." },
  { id:"swe-pgtutorial", title:"PostgreSQL Tutorial", provider:"PostgreSQL", url:"https://www.postgresql.org/docs/current/tutorial.html", area:"swe", type:"doc", level:"beginner", cost:"free", hours:10, desc:"Official SQL & relational concepts tutorial from the world's most advanced open-source database." },
  { id:"swe-bash", title:"The Missing Semester of Your CS Education", provider:"MIT CSAIL", url:"https://missing.csail.mit.edu/", area:"swe", type:"course", level:"beginner", cost:"free", hours:12, desc:"Shell, editors, version control, debugging, profiling, security — the practical tooling school never taught you." },

  /* ---------------- Security & Networking ---------------- */
  { id:"sec-tryhackme", title:"TryHackMe", provider:"TryHackMe", url:"https://tryhackme.com/", area:"sec", type:"practice", level:"beginner", cost:"freemium", hours:100, desc:"Gamified, guided hacking rooms in your browser — networking, web, AD, privilege escalation. The best place to start, hands down." },
  { id:"sec-htb", title:"Hack The Box", provider:"Hack The Box", url:"https://www.hackthebox.com/", area:"sec", type:"practice", level:"intermediate", cost:"freemium", hours:150, desc:"Real-world vulnerable machines and challenges. The certifications and labs professionals use to stay sharp." },
  { id:"sec-portswigger", title:"Web Security Academy", provider:"PortSwigger", url:"https://portswigger.net/web-security", area:"sec", type:"practice", level:"intermediate", cost:"free", hours:60, desc:"The definitive free training on web vulnerabilities — SQL injection, XSS, auth, access control — with interactive labs." },
  { id:"sec-owasp", title:"OWASP Top 10", provider:"OWASP", url:"https://owasp.org/www-project-top-ten/", area:"sec", type:"doc", level:"beginner", cost:"free", hours:5, desc:"The ten critical web application security risks, explained by the open-source foundation that defines them." },
  { id:"sec-picoctf", title:"picoCTF", provider:"Carnegie Mellon University", url:"https://picoctf.org/", area:"sec", type:"practice", level:"beginner", cost:"free", hours:30, desc:"Free, evergreen capture-the-flag challenges designed for learning — crypto, forensics, binary, web. Run by CMU." },
  { id:"sec-attack", title:"MITRE ATT&CK", provider:"MITRE", url:"https://attack.mitre.org/", area:"sec", type:"doc", level:"advanced", cost:"free", hours:20, desc:"The living knowledge base of real adversary tactics, techniques and procedures — how attackers actually operate." },
  { id:"sec-cryptohack", title:"CryptoHack", provider:"CryptoHack", url:"https://cryptohack.org/", area:"sec", type:"practice", level:"intermediate", cost:"free", hours:40, desc:"Learn real, modern cryptography by breaking it — from classic ciphers to elliptic curves and lattice attacks." },
  { id:"sec-cisa", title:"CISA — Cybersecurity & Infrastructure Security Agency", provider:"US Government", url:"https://www.cisa.gov/", area:"sec", type:"doc", level:"beginner", cost:"free", hours:10, desc:"Advisories, known-exploited-vulnerabilities catalog, and free cyber-hygiene resources from America's front line." },
  { id:"sec-overthewire", title:"OverTheWire — Wargames", provider:"OverTheWire", url:"https://overthewire.org/wargames/", area:"sec", type:"practice", level:"beginner", cost:"free", hours:25, desc:"SSH-based wargames (Bandit, Natas…) that teach Linux and security by pure puzzle-solving. Bandit is legendary." },
  { id:"sec-networking", title:"Computer Networking — Computer Networking: A Top-Down Approach", provider:"Kurose & Ross / companion site", url:"https://gaia.cs.umass.edu/kurose_ross/index.php", area:"sec", type:"doc", level:"intermediate", cost:"free", hours:60, desc:"Companion resources for the best-selling networking textbook — slides, labs (Wireshark), videos and problems." },

  /* ---------------- Data & Math Foundations ---------------- */
  { id:"math-khan", title:"Khan Academy — Math", provider:"Khan Academy", url:"https://www.khanacademy.org/math", area:"math", type:"course", level:"beginner", cost:"free", hours:100, desc:"Arithmetic to AP Calculus and linear algebra, with mastery learning, practice and personalized dashboards. Free forever." },
  { id:"math-3b1b-la", title:"Essence of Linear Algebra", provider:"3Blue1Brown / YouTube", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzMt2N0WpGzEBW6o8", area:"math", type:"video", level:"beginner", cost:"free", hours:4, desc:"The geometric intuition of vectors, matrices, determinants and eigenvectors — animated beautifully. Non-negotiable for ML." },
  { id:"math-3b1b-calc", title:"Essence of Calculus", provider:"3Blue1Brown / YouTube", url:"https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", area:"math", type:"video", level:"beginner", cost:"free", hours:4, desc:"What derivatives and integrals actually mean — limits, chain rule, and the geometry of change. Pure intuition." },
  { id:"math-statquest", title:"StatQuest with Josh Starmer", provider:"Josh Starmer / YouTube", url:"https://www.youtube.com/@statquest", area:"math", type:"video", level:"beginner", cost:"free", hours:30, desc:"Statistics and ML explained one clear step at a time: p-values, distributions, trees, boosting, neural nets." },
  { id:"math-seeingtheory", title:"Seeing Theory — A Visual Introduction to Probability", provider:"Brown University", url:"https://seeing-theory.brown.edu/", area:"math", type:"article", level:"beginner", cost:"free", hours:5, desc:"Interactive visualizations of distributions, probability, inference and regression. Probability you can see." },
  { id:"math-strang", title:"MIT 18.06 Linear Algebra — Gilbert Strang", provider:"MIT OCW", url:"https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", area:"math", type:"course", level:"intermediate", cost:"free", hours:40, desc:"The legendary Strang lectures — the single best linear algebra course ever recorded, free on MIT OCW." },
  { id:"math-sqlbolt", title:"SQLBolt", provider:"sqlbolt.com", url:"https://sqlbolt.com/", area:"math", type:"practice", level:"beginner", cost:"free", hours:4, desc:"Learn SQL interactively in the browser in one afternoon — from SELECT to joins to subqueries. Zero setup." },
  { id:"math-pgembed", title:"PostgreSQL — Advanced Features", provider:"PostgreSQL docs", url:"https://www.postgresql.org/docs/current/sql-commands.html", area:"math", type:"doc", level:"advanced", cost:"free", hours:8, desc:"The full SQL command reference — window functions, CTEs, explain plans — straight from the source." },
  { id:"math-probability", title:"Probabilistic Systems Analysis and Applied Probability (MIT 6.041)", provider:"MIT OCW", url:"https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/", area:"math", type:"course", level:"intermediate", cost:"free", hours:45, desc:"Rigorous probability: counting, axioms, random variables, limit theorems — with exams and solutions." },
  { id:"math-visualize", title:"Immersive Math", provider:"immersivemath.com", url:"https://immersivemath.com/", area:"math", type:"article", level:"beginner", cost:"free", hours:6, desc:"Beautifully interactive linear algebra — vectors, matrices and transformations you can grab and drag." },

  /* ---------------- Life, Mind, Health & Spirit ---------------- */
  { id:"life-who-pa", title:"WHO — Physical Activity Guidelines", provider:"World Health Organization", url:"https://www.who.int/news-room/fact-sheets/detail/physical-activity", area:"life", type:"doc", level:"beginner", cost:"free", hours:1, desc:"Official evidence: 150–300 min of moderate movement weekly cuts all-cause mortality. The fact sheet, straight from WHO." },
  { id:"life-nhs-sleep", title:"How to Get to Sleep — NHS Sleep Guide", provider:"UK National Health Service", url:"https://www.nhs.uk/live-well/sleep-and-tiredness/how-to-get-to-sleep/", area:"life", type:"article", level:"beginner", cost:"free", hours:1, desc:"Practical, clinical-grade guidance on sleep hygiene: routines, caffeine, screens, naps and when to see a GP." },
  { id:"life-nhlbi-sleep", title:"Sleep Deprivation and Deficiency — NHLBI", provider:"NIH / NHLBI", url:"https://www.nhlbi.nih.gov/health/sleep", area:"life", type:"doc", level:"beginner", cost:"free", hours:1, desc:"What sleep deficiency does to your brain, heart and immunity — and how much you really need, by age." },
  { id:"life-harvard-nutrition", title:"The Nutrition Source", provider:"Harvard T.H. Chan School of Public Health", url:"https://nutritionsource.hsph.harvard.edu/", area:"life", type:"doc", level:"beginner", cost:"free", hours:5, desc:"The Healthy Eating Plate, evidence on fats, carbs, protein, salt and sugar — science without diet-culture noise." },
  { id:"life-sep", title:"Stanford Encyclopedia of Philosophy", provider:"Stanford University", url:"https://plato.stanford.edu/", area:"life", type:"doc", level:"advanced", cost:"free", hours:20, desc:"1,700+ rigorously peer-reviewed entries — consciousness, AI, ethics, God, mindfulness, death. The gold standard." },
  { id:"life-iep", title:"Internet Encyclopedia of Philosophy", provider:"IEP", url:"https://iep.utm.edu/", area:"life", type:"doc", level:"intermediate", cost:"free", hours:10, desc:"Accessible, scholarly philosophy articles — Stoicism, meaning of life, logic, virtue ethics and more." },
  { id:"life-mindandlife", title:"Mind & Life Institute", provider:"Mind & Life Institute", url:"https://www.mindandlife.org/", area:"life", type:"community", level:"beginner", cost:"free", hours:3, desc:"The bridge between contemplative practice and science — where the Dalai Lama meets neuroscientists. Research, events, dialogues." },
  { id:"life-umass-mbsr", title:"Center for Mindfulness — MBSR", provider:"UMass Chan Medical School", url:"https://www.umassmed.edu/cfm/", area:"life", type:"course", level:"beginner", cost:"freemium", hours:8, desc:"The original Mindfulness-Based Stress Reduction program (Jon Kabat-Zinn) — secular meditation with clinical evidence." },
  { id:"life-meditations", title:"Meditations — Marcus Aurelius", provider:"Project Gutenberg", url:"https://www.gutenberg.org/files/2680/2680-h/2680-h.htm", area:"life", type:"book", level:"beginner", cost:"free", hours:6, desc:"A Roman emperor's private notebook on virtue, mortality and equanimity — two millennia old and still on every leader's desk." },
  { id:"life-tanzil", title:"Tanzil — The Noble Quran", provider:"tanzil.net", url:"https://tanzil.net/", area:"life", type:"book", level:"beginner", cost:"free", hours:10, desc:"The Quran in Arabic with translations and tafsir links, in a clean, reverent reading interface." },
  { id:"life-gita", title:"Bhagavad Gita", provider:"Project Gutenberg", url:"https://www.gutenberg.org/ebooks/2388", area:"life", type:"book", level:"beginner", cost:"free", hours:6, desc:"The dialogue between Arjuna and Krishna on duty, devotion, knowledge and detachment — a pillar of contemplative literature." },
  { id:"life-pubmed", title:"PubMed — Biomedical Literature", provider:"US National Library of Medicine", url:"https://pubmed.ncbi.nlm.nih.gov/", area:"life", type:"doc", level:"intermediate", cost:"free", hours:5, desc:"36M+ peer-reviewed biomedical citations. When your health question matters, check the primary literature here first." },
  { id:"life-walk", title:"Exercise — NHS Live Well", provider:"UK National Health Service", url:"https://www.nhs.uk/live-well/exercise/", area:"life", type:"article", level:"beginner", cost:"free", hours:1, desc:"Evidence-based starting points for movement: walking, strength, balance and flexibility — for every age and ability." }
];

/* ---------------- Learning Paths (ordered tracks) ---------------- */
const PATHS = [
  {
    id:"path-ai", icon:"🧠", name:"The Thinking Machine Track", subtitle:"AI / ML / LLM Engineer",
    desc:"From zero to building with frontier models. The track Hazem Soussi built this portal for — the discipline of teaching and partnering with thinking machines.",
    steps:["ai-3b1b","ai-cs50ai","math-3b1b-la","ai-mlcrash","ai-kaggle","math-statquest","ai-fastai","ai-d2l","ai-pytorch","ai-karpathy","ai-hfnlp","ai-ollama","ai-prompting","ai-dlcourse","ai-thinkingmachines"]
  },
  {
    id:"path-swe", icon:"🛠️", name:"The Builder Track", subtitle:"Software Engineering & Web",
    desc:"A job-ready arc from first principles to production systems: code, web, databases, Linux, containers — the full modern stack.",
    steps:["swe-cs50","swe-eloquent","swe-fcc","swe-mdn","swe-odin","swe-roadmap","swe-githubskills","swe-bash","swe-fullstackopen","swe-rustbook","swe-docker","swe-k8s","swe-pgtutorial"]
  },
  {
    id:"path-sec", icon:"🛡️", name:"The Guardian Track", subtitle:"Security & Networking",
    desc:"Learn to see systems the way an attacker does, then defend them. Hands-on, legal, and endlessly deep.",
    steps:["sec-overthewire","swe-linuxjourney","sec-picoctf","sec-tryhackme","sec-portswigger","sec-owasp","sec-cryptohack","sec-networking","sec-htb","sec-attack"]
  },
  {
    id:"path-math", icon:"📐", name:"The Foundations Track", subtitle:"Data & Mathematics",
    desc:"The floor everything else stands on: calculus, linear algebra, probability, statistics and SQL — until the math stops being a wall.",
    steps:["math-khan","math-3b1b-calc","math-3b1b-la","math-visualize","math-seeingtheory","math-strang","math-statquest","math-sqlbolt","swe-pgtutorial","math-probability"]
  },
  {
    id:"path-life", icon:"🌌", name:"The Sovereign Track", subtitle:"Life, Mind, Health & Spirit",
    desc:"The machine learns. So do you. Body, sleep, food, stillness, philosophy and scripture — the operating system beneath the software.",
    steps:["life-walk","life-who-pa","life-nhs-sleep","life-nhlbi-sleep","life-harvard-nutrition","life-meditations","life-umass-mbsr","life-mindandlife","life-tanzil","life-gita","life-iep","life-sep"]
  }
];

/* Validate path references at load time (dev safety net) */
const RESOURCE_BY_ID = Object.fromEntries(RESOURCES.map(r => [r.id, r]));
PATHS.forEach(p => { p.steps = p.steps.filter(id => RESOURCE_BY_ID[id]); });

const AREAS = {
  ai:   { label:"AI / ML / LLMs", color:"#7c3aed" },
  swe:  { label:"Software & Web", color:"#0ea5e9" },
  sec:  { label:"Security",       color:"#ef4444" },
  math: { label:"Data & Math",    color:"#10b981" },
  life: { label:"Life & Spirit",  color:"#f59e0b" }
};

/* ---------------- Quiz (auto-graded) ---------------- */
const QUIZ = [
  { q:"What does gradient descent minimize?", options:["Training time","The loss function","Model size","Dataset bias"], a:1, area:"ai" },
  { q:"Which model family powers modern LLMs?", options:["Convolutional networks","Transformers","Decision trees","k-NN"], a:1, area:"ai" },
  { q:"What is RAG in LLM systems?", options:["Random Access Gradient","Retrieval-Augmented Generation","Regularized Attention Grid","Recursive Autoregression"], a:1, area:"ai" },
  { q:"What does HTTP stand for?", options:["HyperText Transfer Protocol","HyperText Translation Process","Host Text Transfer Protocol","Hyperlink Text Protocol"], a:0, area:"swe" },
  { q:"Which data structure works LIFO?", options:["Queue","Stack","Heap","Graph"], a:1, area:"swe" },
  { q:"What is a Docker container?", options:["A virtual machine with full OS","A lightweight isolated process with its own filesystem view","A build server","A database instance"], a:1, area:"swe" },
  { q:"OWASP Top 10 is about…", options:["Fastest databases","Critical web application security risks","Network cable types","Linux kernels"], a:1, area:"sec" },
  { q:"What is the core idea of a SQL injection attack?", options:["Crashing the server with traffic","Injecting untrusted input into SQL queries","Stealing SSL certificates","Brute-forcing passwords"], a:1, area:"sec" },
  { q:"An eigenvector of a matrix A satisfies…", options:["Av = λv","A + v = λ","Aᵀ = v","A/v = 0"], a:0, area:"math" },
  { q:"p < 0.05 conventionally means…", options:["The hypothesis is proven true","Results this extreme are unlikely under the null hypothesis","95% of the data is correct","The effect is large"], a:1, area:"math" },
  { q:"Who wrote 'Meditations'?", options:["Seneca","Epictetus","Marcus Aurelius","Cicero"], a:2, area:"life" },
  { q:"According to WHO, weekly moderate physical activity for adults is at least…", options:["30 minutes","75 minutes","150–300 minutes","500 minutes"], a:2, area:"life" }
];

/* ---------------- Assistant knowledge base (FAQ) ---------------- */
const FAQ = [
  { q:"What is this portal?", a:"High on Intelligence — the Hazem Soussi portal — is a free, curated gateway to the best learning resources of the modern age: AI, software engineering, security, mathematics, and the art of living well. No paywalls here, no fluff — just real links, real paths, real progress tracking." },
  { q:"Who is Hazem Soussi?", a:"High on Intelligence is designed and curated by Hazem Soussi, a builder fascinated by the frontier of intelligence — human and artificial. The portal is his invitation: learn deeply, act ethically, and collaborate on the thinking machine. Bring your skills; leave with a sharper mind." },
  { q:"What is the thinking machine?", a:"The thinking machine is the co-evolution of human judgment and machine intelligence — models that reason, retrieve and act, guided by people who understand them deeply. This portal is a workshop for that collaboration: you learn the science, the tools and the ethics, then you build." },
  { q:"Where should I start as a complete beginner?", a:"Start with the Foundations Track: Khan Academy math and 3Blue1Brown's Essence of Calculus and Linear Algebra, then CS50x. In parallel, do 15 minutes a day of walking or bodyweight movement (see WHO guideline). Consistency beats intensity." },
  { q:"How do I become an AI engineer?", a:"Follow the Thinking Machine Track: 3B1B neural networks → CS50 AI → linear algebra intuition → Google's ML Crash Course → Kaggle Learn → fast.ai → PyTorch → Karpathy's Zero-to-Hero → the Hugging Face NLP course. Then build one project and share it." },
  { q:"How do I learn cybersecurity from zero?", a:"The Guardian Track: OverTheWire Bandit → Linux Journey → picoCTF → TryHackMe (start with the free rooms). Then PortSwigger Web Security Academy for web attacks, and OWASP Top 10 to speak the industry's language." },
  { q:"How much math do I really need for AI?", a:"Enough to not be afraid: Essence of Linear Algebra + Essence of Calculus (3Blue1Brown), plus StatQuest for statistics. Then computation — Kaggle and fast.ai teach the rest by doing. Depth arrives when curiosity demands it." },
  { q:"What is free and what is paid here?", a:"Everything tagged FREE is genuinely free, forever. FREEMIUM means a strong free tier exists (TryHackMe, DeepLearning.AI). PAID items are rare and worth it — but start free; the portal itself never charges you." },
  { q:"How do I stay motivated?", a:"Treat learning like training: small daily doses, one visible artifact per week (a repo, a notebook, a blog post), and a public streak. Mark resources done here, and watch your High on Intelligence dashboard fill. Progress is the best teacher." },
  { q:"Should I learn spirituality and health too?", a:"Yes — the Sovereign Track exists for a reason. Sleep (NHS/NHLBI), movement (WHO), food (Harvard Nutrition Source), Stillness (MBSR), and wisdom (Marcus Aurelius, the Quran, the Gita, SEP). A sharp mind in a depleted body builds fragile machines." },
  { q:"How can I collaborate on the thinking machine?", a:"Open the Collaborate section: write what you can offer and what you want to build, generate your collaboration manifest, and share it. High on Intelligence wants builders — reviewers, writers, translators, tinkerers. Small doors, real work." },
  { q:"Are these links safe and legal?", a:"Yes. High on Intelligence links only to legal, reputable, mostly non-commercial educational resources. The security tracks teach offensive skills exclusively in sandboxed, legal environments (TryHackMe, picoCTF, PortSwigger labs)." },
  { q:"Can I use this offline?", a:"The portal itself is a static site — once loaded, the library, paths, quiz, assistant, timer and breathing widget all work offline. Only clicking through to the external resources needs a connection." },
  { q:"How is my progress stored?", a:"Locally, in your browser (localStorage). Nothing leaves your machine. Use Export in the dashboard to download a backup or a clean Markdown summary of your journey." }
];

/* ---------------- Curated quotes ---------------- */
const QUOTES = [
  { t:"We can only see a short distance ahead, but we can see plenty there that needs to be done.", a:"Alan Turing, 1950" },
  { t:"Stay hungry, stay foolish.", a:"Steve Jobs — Stanford, 2005" },
  { t:"Simplicity is prerequisite for reliability.", a:"Edsger W. Dijkstra" },
  { t:"The most damaging phrase in the language is: 'We've always done it this way.'", a:"Grace Hopper" },
  { t:"You have power over your mind — not outside events. Realize this, and you will find strength.", a:"Marcus Aurelius — Meditations" },
  { t:"It does not matter how slowly you go as long as you do not stop.", a:"Confucius" },
  { t:"The first principle is that you must not fool yourself — and you are the easiest person to fool.", a:"Richard Feynman" },
  { t:"Discipline is choosing between what you want now and what you want most.", a:"Abraham Lincoln (attributed)" },
  { t:"An investment in knowledge pays the best interest.", a:"Benjamin Franklin" },
  { t:"The important thing is not to stop questioning. Curiosity has its own reason for existing.", a:"Albert Einstein" }
];
