/* =====================================================================
   High on Intelligence — The Universe Wing
   universe.js — real-time 3D starfield (three.js r152, vendored)
   36 cataloged bright stars + a procedural Milky Way band + deep field.
   Drag to orbit · scroll to zoom · click a star · focus from the list.
   ===================================================================== */

"use strict";

(function () {
  const canvas = document.getElementById("universeCanvas");
  if (!canvas) return;
  const SPHERE_R = 240;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (e) {
    const fb = document.getElementById("webglFallback");
    if (fb) fb.hidden = false;
    canvas.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const fitCanvas = () => {
    const w = canvas.parentElement.clientWidth;
    const h = Math.max(420, Math.min(620, Math.round(w * 0.72)));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x05060f);

  const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 5000);
  camera.position.set(0, 0, 430);

  /* ---------- deep field (background faint stars) ---------- */
  const deepCount = 2400;
  const deepPos = new Float32Array(deepCount * 3);
  for (let i = 0; i < deepCount; i++) {
    const r = 900 + Math.random() * 900;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    deepPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    deepPos[i * 3 + 1] = r * Math.cos(phi);
    deepPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const deepGeo = new THREE.BufferGeometry();
  deepGeo.setAttribute("position", new THREE.BufferAttribute(deepPos, 3));
  const deepMat = new THREE.PointsMaterial({ color: 0xbcccff, size: 2.1, sizeAttenuation: true, transparent: true, opacity: 0.8 });
  scene.add(new THREE.Points(deepGeo, deepMat));

  /* ---------- Milky Way band (tilted great circle) ---------- */
  const bandGroup = new THREE.Group();
  bandGroup.rotation.z = 0.42;      /* tilt of the galactic plane */
  bandGroup.rotation.x = 0.18;
  const bandCount = 2600;
  const bandPos = new Float32Array(bandCount * 3);
  const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
  for (let i = 0; i < bandCount; i++) {
    const t = Math.random() * Math.PI * 2;
    const spread = Math.abs(gauss()) * 130 + 12;
    const r = 980;
    bandPos[i * 3]     = Math.cos(t) * r + gauss() * 40;
    bandPos[i * 3 + 1] = gauss() * spread;
    bandPos[i * 3 + 2] = Math.sin(t) * r + gauss() * 40;
  }
  const bandGeo = new THREE.BufferGeometry();
  bandGeo.setAttribute("position", new THREE.BufferAttribute(bandPos, 3));
  const bandMat = new THREE.PointsMaterial({ color: 0xd6c4ff, size: 3.4, sizeAttenuation: true, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false });
  bandGroup.add(new THREE.Points(bandGeo, bandMat));
  scene.add(bandGroup);

  /* ---------- glow sprite texture (radial gradient) ---------- */
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d");
  const grad = gctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.25, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.7, "rgba(255,255,255,0.08)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const glowTex = new THREE.CanvasTexture(glowCanvas);

  /* ---------- the 36 cataloged bright stars ---------- */
  const starGroup = new THREE.Group();
  scene.add(starGroup);
  const pickables = [];

  STARS.forEach(s => {
    const v = raDecToVector(s.ra, s.dec, SPHERE_R);
    const color = new THREE.Color(spectralColor(s.spectral));
    const r = starRadius(s.mag);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(r, 18, 18),
      new THREE.MeshBasicMaterial({ color })
    );
    mesh.position.set(v.x, v.y, v.z);
    mesh.userData = { star: s, baseR: r, phase: Math.random() * Math.PI * 2 };
    starGroup.add(mesh);
    pickables.push(mesh);

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, color, transparent: true, blending: THREE.AdditiveBlending,
      depthWrite: false, opacity: 0.85
    }));
    const glowScale = r * 9;
    sprite.scale.set(glowScale, glowScale, 1);
    sprite.position.set(v.x, v.y, v.z);
    sprite.userData = { star: s, baseGlow: glowScale, phase: mesh.userData.phase };
    starGroup.add(sprite);
  });

  /* equatorial reference ring (celestial equator) */
  const ringGeo = new THREE.RingGeometry(SPHERE_R, SPHERE_R + 1.2, 128);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI / 2;
  scene.add(ring);

  /* ---------- interaction: drag to orbit, wheel to zoom ---------- */
  let dragging = false, lastX = 0, lastY = 0, velY = 0, velX = 0;
  let rotY = 0.0, rotX = 0.08;
  let autoRotate = true;
  let focusAnim = null;

  const applyRotation = () => {
    starGroup.rotation.y = rotY;
    starGroup.rotation.x = rotX;
    ring.rotation.z = 0;
  };
  applyRotation();

  canvas.addEventListener("pointerdown", e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; velY = velX = 0; focusAnim = null;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    rotY += dx * 0.005;
    rotX = Math.max(-0.85, Math.min(0.85, rotX + dy * 0.003));
    velY = dx * 0.005; velX = dy * 0.003;
    applyRotation();
  });
  const endDrag = () => { dragging = false; canvas.style.cursor = "grab"; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    camera.position.z = Math.max(190, Math.min(720, camera.position.z + e.deltaY * 0.35));
  }, { passive: false });

  /* ---------- raycasting: click a star ---------- */
  const raycaster = new THREE.Raycaster();
  const pointerNDC = new THREE.Vector2();
  let downPos = null;
  canvas.addEventListener("pointerdown", e => { downPos = [e.clientX, e.clientY]; });
  canvas.addEventListener("pointerup", e => {
    if (!downPos) return;
    const moved = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
    downPos = null;
    if (moved > 6) return; /* it was a drag, not a click */
    const rect = canvas.getBoundingClientRect();
    pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointerNDC, camera);
    const hits = raycaster.intersectObjects(pickables, false);
    if (hits.length) showStar(hits[0].object.userData.star);
  });

  const siName = document.getElementById("siName");
  const siMeta = document.getElementById("siMeta");
  const siMag = document.getElementById("siMag");
  const siDist = document.getElementById("siDist");
  const siSpec = document.getElementById("siSpec");
  const siFact = document.getElementById("siFact");
  const siEmpty = document.getElementById("siEmpty");
  const siBody = document.getElementById("siBody");

  function showStar(s) {
    if (siEmpty) siEmpty.hidden = true;
    if (siBody) siBody.hidden = false;
    siName.textContent = s.name;
    siMeta.textContent = s.constellation + " · RA " + s.ra.toFixed(2) + "h · Dec " + (s.dec >= 0 ? "+" : "") + s.dec.toFixed(2) + "°";
    siMag.textContent = s.mag.toFixed(2);
    siDist.textContent = s.dist + " ly";
    siSpec.textContent = s.spectral;
    siFact.textContent = s.fact;
    markActiveInList(s.name);
  }

  /* ---------- star list + search ---------- */
  const listEl = document.getElementById("starList");
  const searchEl = document.getElementById("starSearch");
  let listButtons = [];

  function markActiveInList(name) {
    listButtons.forEach(b => b.classList.toggle("active", b.dataset.name === name));
  }
  function buildList(filter) {
    const q = (filter || "").trim().toLowerCase();
    const items = STARS.filter(s => !q || [s.name, s.constellation, s.spectral].join(" ").toLowerCase().includes(q));
    listEl.innerHTML = items.map(s => `
      <button class="star-item" data-name="${s.name}">
        <span class="star-dot" style="background:${spectralColor(s.spectral)}"></span>
        <span class="star-item-name">${s.name}</span>
        <span class="star-item-meta">mag ${s.mag.toFixed(2)}</span>
      </button>`).join("") || '<div class="star-empty">No star matches “' + q + '”.</div>';
    listButtons = [...listEl.querySelectorAll(".star-item")];
    listButtons.forEach(b => b.addEventListener("click", () => {
      const star = STARS.find(s => s.name === b.dataset.name);
      if (star) { showStar(star); focusStar(star); }
    }));
  }
  if (searchEl) searchEl.addEventListener("input", e => buildList(e.target.value));

  /* ---------- camera focus animation ---------- */
  function focusStar(s) {
    const v = raDecToVector(s.ra, s.dec, SPHERE_R);
    let target = Math.atan2(v.x, v.z);
    let delta = target - rotY;
    while (delta > Math.PI) delta -= Math.PI * 2;
    while (delta < -Math.PI) delta += Math.PI * 2;
    focusAnim = { from: rotY, to: rotY + delta, t0: performance.now(), dur: 900 };
  }

  /* ---------- buttons ---------- */
  const btnReset = document.getElementById("btnReset");
  const btnAuto = document.getElementById("btnAuto");
  if (btnReset) btnReset.addEventListener("click", () => { rotY = 0; rotX = 0.08; camera.position.z = 430; applyRotation(); });
  if (btnAuto) btnAuto.addEventListener("click", () => {
    autoRotate = !autoRotate;
    btnAuto.textContent = autoRotate ? "Auto-rotate: ON" : "Auto-rotate: OFF";
    btnAuto.classList.toggle("primary", autoRotate);
  });

  /* ---------- resize + render loop ---------- */
  window.addEventListener("resize", fitCanvas);
  fitCanvas();
  buildList("");

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    if (focusAnim) {
      const k = Math.min(1, (performance.now() - focusAnim.t0) / focusAnim.dur);
      const ease = 1 - Math.pow(1 - k, 3);
      rotY = focusAnim.from + (focusAnim.to - focusAnim.from) * ease;
      applyRotation();
      if (k >= 1) focusAnim = null;
    } else if (!dragging) {
      rotY += velY; rotX = Math.max(-0.85, Math.min(0.85, rotX + velX));
      velY *= 0.94; velX *= 0.94;
      if (autoRotate) rotY += 0.0011;
      applyRotation();
    }

    /* twinkle */
    starGroup.children.forEach(obj => {
      if (obj.isMesh && obj.userData.phase !== undefined) {
        const s = 1 + 0.10 * Math.sin(t * 2.1 + obj.userData.phase);
        obj.scale.setScalar(s);
      } else if (obj.isSprite) {
        const s = obj.userData.baseGlow * (1 + 0.14 * Math.sin(t * 1.7 + obj.userData.phase));
        obj.scale.set(s, s, 1);
      }
    });

    renderer.render(scene, camera);
  }
  animate();

  /* ---------- stats strip ---------- */
  const nearest = STARS.reduce((a, b) => (a.dist < b.dist ? a : b));
  const furthest = STARS.reduce((a, b) => (a.dist > b.dist ? a : b));
  const brightest = STARS.reduce((a, b) => (a.mag < b.mag ? a : b));
  const setStat = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setStat("statStars", STARS.length);
  setStat("statNearest", nearest.name + " · " + nearest.dist + " ly");
  setStat("statBrightest", brightest.name + " · " + brightest.mag.toFixed(2));
  setStat("statFurthest", furthest.name + " · " + furthest.dist + " ly");
})();
