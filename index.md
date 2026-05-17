---
layout: default
title: Home
---

<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">DATA SCIENCE • AI • DECISION INTELLIGENCE</p>
    <h1>Turn Data Into Decisions</h1>
    <p class="hero-text">A premium learning and consulting hub for data strategy, analytics, AI systems, decision intelligence, and practical upskilling.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="/use-cases/">Explore Use Cases</a>
      <a class="btn btn-secondary" href="/notes/">Read Notes</a>
    </div>
  </div>
  <div class="hero-panel">
    <img src="/assets/images/data-strategy.png" alt="Data strategy showcase" />
  </div>
</section>

<section class="section">
  <div class="section-heading">
    <p class="eyebrow">CORE CAPABILITIES</p>
    <h2>From strategy to measurable business impact</h2>
  </div>

  <div class="capability-grid">
    <a class="capability-card" href="/data-strategy/">
      <img src="/assets/images/data-strategy.png" alt="Data Strategy & Consulting" />
      <span>01</span>
      <h3>Data Strategy & Consulting</h3>
      <p>Design data-driven strategies aligned with business goals.</p>
    </a>

    <a class="capability-card" href="/training-upskilling/">
      <img src="/assets/images/training-upskilling.png" alt="Training & Data Upskilling" />
      <span>02</span>
      <h3>Training & Data Upskilling</h3>
      <p>Empower teams with practical data science and analytics skills.</p>
    </a>

    <a class="capability-card" href="/data-platform/">
      <img src="/assets/images/data-platform.png" alt="Data Platform & Pipeline Design" />
      <span>03</span>
      <h3>Data Platform & Pipeline Design</h3>
      <p>Build scalable data pipelines and modern data architectures.</p>
    </a>

    <a class="capability-card" href="/decision-intelligence/">
      <img src="/assets/images/decision-intelligence.png" alt="Decision Intelligence" />
      <span>04</span>
      <h3>Decision Intelligence</h3>
      <p>Enable smarter decisions through data, automation, and AI-driven insights.</p>
    </a>

    <a class="capability-card" href="/ai-machine-learning/">
      <img src="/assets/images/ai-machine-learning.png" alt="AI & Machine Learning" />
      <span>05</span>
      <h3>AI & Machine Learning</h3>
      <p>Build predictive models and intelligent systems for real-world applications.</p>
    </a>

    <a class="capability-card" href="/advanced-analytics/">
      <img src="/assets/images/advanced-analytics.png" alt="Advanced Analytics" />
      <span>06</span>
      <h3>Advanced Analytics</h3>
      <p>Turn complex data into clear insights using statistical and analytical techniques.</p>
    </a>
  </div>
</section>

<section class="section" id="resources">
  <div class="section-heading">
    <p class="eyebrow">LEARNING RESOURCES</p>
    <h2>Visual pages and interactive lessons</h2>
    <p class="muted">Open standalone HTML learning pages from the main DataLearn website, then return home anytime.</p>
  </div>

  <div class="resource-grid">
    <a class="resource-card" href="/m50-machine-learning-slides.html">
      <span>Interactive Slides</span>
      <h3>M50 Machine Learning Concepts</h3>
      <p>A slide-by-slide machine learning viewer with simple English explanations, zoom, and drag-to-inspect images.</p>
    </a>

    <a class="resource-card" href="/spark-visual-gallery.html">
      <span>Visual Gallery</span>
      <h3>Apache Spark Visual Gallery</h3>
      <p>A visual walkthrough of Spark ideas, distributed execution, transformations, actions, joins, and optimization.</p>
    </a>

    <a class="resource-card" href="/spark-visual-gallery-clear.html">
      <span>Clean Version</span>
      <h3>Apache Spark Clear Gallery</h3>
      <p>A simpler Spark gallery layout for quick reading and sharing.</p>
    </a>
  </div>

  <div class="section-actions">
    <a class="btn btn-secondary" href="/resources/">View All Resources</a>
  </div>
</section>

<section class="section split-section">
  <div>
    <p class="eyebrow">LATEST NOTES</p>
    <h2>Daily Markdown posts, automatically published</h2>
    <p class="muted">Create a file in <code>_posts/YYYY-MM-DD-title.md</code>, commit to GitHub, and it appears here.</p>
  </div>

  <div class="mini-posts">
    {% for post in site.posts limit:3 %}
      <a class="mini-post" href="{{ post.url }}">
        <small>{{ post.date | date: "%b %d, %Y" }}</small>
        <strong>{{ post.title }}</strong>
      </a>
    {% endfor %}
  </div>
</section>
