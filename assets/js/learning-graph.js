(function () {
  const root = document.querySelector("[data-learning-graph]");
  if (!root) return;

  const svg = root.querySelector("[data-graph-canvas]");
  const panel = root.querySelector("[data-lesson-panel]");
  const filters = root.querySelector("[data-graph-filters]");
  const resetButton = root.querySelector("[data-graph-reset]");
  const progressText = root.querySelector("[data-graph-progress]");
  const namespace = "datalearn-graph-progress";

  const readProgress = () => {
    try {
      return JSON.parse(localStorage.getItem(namespace)) || {};
    } catch (error) {
      return {};
    }
  };

  const saveProgress = (progress) => {
    localStorage.setItem(namespace, JSON.stringify(progress));
  };

  const domainFallback = { label: "Learning", color: "#ffffff" };
  let graph = null;
  let activeDomain = "all";
  let activeLessonId = null;
  let progress = readProgress();

  fetch("/data/learning-graph.json")
    .then((response) => response.json())
    .then((data) => {
      graph = prepareGraph(data);
      activeLessonId = graph.lessons[0].id;
      renderFilters();
      render();
    })
    .catch(() => {
      panel.innerHTML = "<h3>Learning graph unavailable</h3><p>Please check the graph data file.</p>";
    });

  function prepareGraph(data) {
    const domains = Object.fromEntries(data.domains.map((domain) => [domain.id, domain]));
    const lessons = data.lessons.map((lesson, index) => ({
      ...lesson,
      x: 180 + (index % 4) * 190,
      y: 100 + Math.floor(index / 4) * 120,
      vx: 0,
      vy: 0
    }));
    const lessonMap = Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson]));
    const links = [];

    lessons.forEach((lesson) => {
      lesson.next.forEach((targetId) => {
        if (lessonMap[targetId]) {
          links.push({ source: lesson.id, target: targetId });
        }
      });
    });

    return { domains, lessons, lessonMap, links };
  }

  function renderFilters() {
    const domainButtons = [
      { id: "all", label: "All" },
      ...Object.values(graph.domains)
    ];

    filters.innerHTML = domainButtons.map((domain) => {
      const color = domain.color || "#ffffff";
      return `<button class="graph-filter" type="button" data-domain="${domain.id}" style="--filter-color:${color}">${domain.label}</button>`;
    }).join("");

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-domain]");
      if (!button) return;
      activeDomain = button.dataset.domain;
      render();
    });

    resetButton.addEventListener("click", () => {
      progress = {};
      saveProgress(progress);
      render();
    });
  }

  function render() {
    runLayout();
    renderSvg();
    renderPanel(graph.lessonMap[activeLessonId] || graph.lessons[0]);
    renderProgress();

    filters.querySelectorAll("[data-domain]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.domain === activeDomain);
    });
  }

  function visibleLesson(lesson) {
    return activeDomain === "all" || lesson.domain === activeDomain;
  }

  function renderSvg() {
    const width = svg.clientWidth || 900;
    const height = svg.clientHeight || 560;
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.innerHTML = "";

    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", width);
    background.setAttribute("height", height);
    background.setAttribute("rx", 20);
    background.setAttribute("class", "graph-backdrop");
    svg.appendChild(background);

    graph.links.forEach((link) => {
      const source = graph.lessonMap[link.source];
      const target = graph.lessonMap[link.target];
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", source.x);
      line.setAttribute("y1", source.y);
      line.setAttribute("x2", target.x);
      line.setAttribute("y2", target.y);
      line.setAttribute("class", visibleLesson(source) && visibleLesson(target) ? "graph-link" : "graph-link is-muted");
      svg.appendChild(line);
    });

    graph.lessons.forEach((lesson) => {
      const domain = graph.domains[lesson.domain] || domainFallback;
      const complete = Boolean(progress[lesson.id]);
      const muted = !visibleLesson(lesson);
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", `graph-node ${muted ? "is-muted" : ""} ${complete ? "is-complete" : ""} ${lesson.id === activeLessonId ? "is-active" : ""}`);
      group.setAttribute("tabindex", "0");
      group.setAttribute("role", "button");
      group.setAttribute("aria-label", lesson.title);
      group.dataset.lessonId = lesson.id;

      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", lesson.x);
      circle.setAttribute("cy", lesson.y);
      circle.setAttribute("r", lesson.level === "Advanced" ? 28 : 24);
      circle.setAttribute("fill", domain.color);
      group.appendChild(circle);

      const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("cx", lesson.x);
      ring.setAttribute("cy", lesson.y);
      ring.setAttribute("r", lesson.level === "Advanced" ? 35 : 31);
      ring.setAttribute("class", "graph-node-ring");
      group.appendChild(ring);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", lesson.x);
      label.setAttribute("y", lesson.y + 48);
      label.setAttribute("text-anchor", "middle");
      label.textContent = lesson.title;
      group.appendChild(label);

      group.addEventListener("click", () => selectLesson(lesson.id));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectLesson(lesson.id);
        }
      });
      attachDrag(group, lesson);
      svg.appendChild(group);
    });
  }

  function selectLesson(lessonId) {
    activeLessonId = lessonId;
    render();
  }

  function renderPanel(lesson) {
    const domain = graph.domains[lesson.domain] || domainFallback;
    const prerequisites = lesson.prerequisites.map((id) => graph.lessonMap[id]?.title).filter(Boolean);
    const nextLessons = lesson.next.map((id) => graph.lessonMap[id]?.title).filter(Boolean);
    const checked = progress[lesson.id] ? "checked" : "";
    const colab = lesson.colabUrl
      ? `<a class="btn btn-primary" href="${lesson.colabUrl}" target="_blank" rel="noopener noreferrer">Open Colab</a>`
      : "";

    panel.innerHTML = `
      <div class="lesson-domain" style="--domain-color:${domain.color}">${domain.label}</div>
      <h3>${lesson.title}</h3>
      <p>${lesson.summary}</p>
      <div class="lesson-meta">
        <span>${lesson.level}</span>
        <span>${lesson.duration} min</span>
        <span>${prerequisites.length} prerequisites</span>
      </div>
      <label class="lesson-toggle">
        <input type="checkbox" data-complete-lesson="${lesson.id}" ${checked}>
        Mark as learned
      </label>
      <div class="lesson-links">
        <div><strong>Before</strong><span>${prerequisites.join(", ") || "Start here"}</span></div>
        <div><strong>Next</strong><span>${nextLessons.join(", ") || "Capstone ready"}</span></div>
      </div>
      <div class="lesson-actions">
        <a class="btn btn-secondary" href="${lesson.url}">Open Lesson</a>
        ${colab}
      </div>
    `;

    panel.querySelector("[data-complete-lesson]").addEventListener("change", (event) => {
      progress[lesson.id] = event.target.checked;
      if (!event.target.checked) delete progress[lesson.id];
      saveProgress(progress);
      render();
    });
  }

  function renderProgress() {
    const completed = Object.keys(progress).filter((id) => graph.lessonMap[id]).length;
    const total = graph.lessons.length;
    progressText.textContent = `${completed}/${total} lessons mapped`;
  }

  function runLayout() {
    const width = svg.clientWidth || 900;
    const height = svg.clientHeight || 560;
    const levelRank = { Beginner: 0, Intermediate: 1, Advanced: 2 };

    for (let tick = 0; tick < 140; tick += 1) {
      graph.lessons.forEach((lesson, index) => {
        const domainIndex = Object.keys(graph.domains).indexOf(lesson.domain);
        const targetX = 120 + Math.max(domainIndex, 0) * ((width - 240) / 6);
        const targetY = 95 + (levelRank[lesson.level] || 0) * ((height - 180) / 2) + (index % 3) * 18;
        lesson.vx += (targetX - lesson.x) * 0.004;
        lesson.vy += (targetY - lesson.y) * 0.004;
      });

      graph.links.forEach((link) => {
        const source = graph.lessonMap[link.source];
        const target = graph.lessonMap[link.target];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = (distance - 135) * 0.0009;
        const fx = dx * force;
        const fy = dy * force;
        source.vx += fx;
        source.vy += fy;
        target.vx -= fx;
        target.vy -= fy;
      });

      for (let i = 0; i < graph.lessons.length; i += 1) {
        for (let j = i + 1; j < graph.lessons.length; j += 1) {
          const a = graph.lessons[i];
          const b = graph.lessons[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
          const force = 120 / (distance * distance);
          const fx = dx * force;
          const fy = dy * force;
          a.vx -= fx;
          a.vy -= fy;
          b.vx += fx;
          b.vy += fy;
        }
      }

      graph.lessons.forEach((lesson) => {
        lesson.vx *= 0.76;
        lesson.vy *= 0.76;
        lesson.x = Math.min(width - 80, Math.max(80, lesson.x + lesson.vx));
        lesson.y = Math.min(height - 80, Math.max(80, lesson.y + lesson.vy));
      });
    }
  }

  function attachDrag(group, lesson) {
    let dragging = false;

    group.addEventListener("pointerdown", (event) => {
      dragging = true;
      group.setPointerCapture(event.pointerId);
    });

    group.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const cursor = point.matrixTransform(svg.getScreenCTM().inverse());
      lesson.x = cursor.x;
      lesson.y = cursor.y;
      lesson.vx = 0;
      lesson.vy = 0;
      renderSvg();
    });

    group.addEventListener("pointerup", () => {
      dragging = false;
    });
  }
}());
