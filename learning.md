---
layout: default
title: Learning
subtitle: Interactive data science learning paths and knowledge graph.
permalink: /learning/
---

<section class="page-hero">
  <p class="eyebrow">LEARNING PATHS</p>
  <h1>Navigate data science as a knowledge graph</h1>
  <p>Explore SQL, Python, visualization, machine learning, deep learning, and AI systems as connected lessons.</p>
</section>

<section class="section knowledge-lab" data-learning-graph>
  <div class="knowledge-copy">
    <p class="eyebrow">INTERACTIVE KNOWLEDGE GRAPH</p>
    <h2>Choose your next lesson visually</h2>
    <p class="muted">Click a node to inspect prerequisites, next lessons, learning time, and Colab practice links. Mark completed lessons to build your personal map.</p>
  </div>

  <div class="knowledge-shell">
    <div class="graph-toolbar">
      <div class="graph-filters" data-graph-filters></div>
      <div class="graph-status">
        <span data-graph-progress>0/0 lessons mapped</span>
        <button class="graph-reset" type="button" data-graph-reset>Reset</button>
      </div>
    </div>

    <div class="graph-stage">
      <svg class="learning-graph" data-graph-canvas aria-label="Interactive data science learning graph"></svg>
      <aside class="lesson-panel" data-lesson-panel>
        <h3>Loading learning graph</h3>
        <p>Preparing your roadmap.</p>
      </aside>
    </div>
  </div>
</section>

<section class="section">
  <div class="section-heading">
    <p class="eyebrow">HOW TO SCALE</p>
    <h2>Add new lessons without redesigning the site</h2>
    <p class="muted">Each lesson is a data object with a domain, level, prerequisites, next lessons, and optional Colab URL. Add new objects to grow the graph.</p>
  </div>
</section>
