/* =====================================================================
   High on Intelligence — The Living Earth
   earth.js — real-time interactive 3D Earth (three.js r152, vendored)
   · NASA Blue Marble (day) + specular + normal + Black Marble (night)
   · Sun direction: ISS API solar coords (live) · closed-form fallback
   · ISS NORAD 25544 — live telemetry from api.wheretheiss.at (CORS, no key)
   Note: camera orbits for interaction; the globe keeps its GMST orientation.
   Orientation is GMST-derived — educational, not navigational.
   ===================================================================== */

"use strict";

(function () {
  const canvas = document.getElementById("earthCanvas");
  if (!canvas) return;

  const R = 100;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    const fb = document.getElementById("webglFallback");
    if (fb) fb.hidden = false;
    canvas.style.display = "none";
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x03040c);
  const camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 8000);

  const ORBIT_R = 330;
  let viewRot = 0, viewTilt = 0.15; /* camera orbit angle + height tilt */
  const placeCamera = () => {
    camera.position.set(
      Math.sin(viewRot) * ORBIT_R,
      30 + viewTilt * 150,
      Math.cos(viewRot) * ORBIT_R
    );
    camera.lookAt(0, 0, 0);
  };
  placeCamera();

  /* ---------- deep star field ---------- */
  const starCount = 2800;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 1500 + Math.random() * 1400;
    const t = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    sp[i * 3] = r * Math.sin(ph) * Math.cos(t);
    sp[i * 3 + 1] = r * Math.cos(ph);
    sp[i * 3 + 2] = r * Math.sin(ph) * Math.sin(t);
  }
  const sg = new THREE.BufferGeometry();
  sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xdbe6ff, size: 2.4, transparent: true, opacity: 0.9 })));

  /* ---------- lights ---------- */
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.9);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x334455, 0.55));

  /* ---------- Earth ---------- */
  const earthGroup = new THREE.Group();
  scene.add(earthGroup);

  const texLoader = new THREE.TextureLoader();
  const dayMap = texLoader.load("assets/earth/earth_atmos_2048.jpg");
  const specMap = texLoader.load("assets/earth/earth_specular_2048.jpg");
  const normMap = texLoader.load("assets/earth/earth_normal_2048.jpg");
  const nightMap = texLoader.load("assets/earth/earth_lights_2048.png");

  const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(R, 64, 64),
    new THREE.MeshPhongMaterial({
      map: dayMap,
      specularMap: specMap,
      specular: new THREE.Color(0x2f3b4f),
      shininess: 14,
      normalMap: normMap,
      normalScale: new THREE.Vector2(0.6, 0.6)
    })
  );
  earthGroup.add(earthMesh);

  /* Night lights — additive shader masked to the dark hemisphere */
  const nightUniforms = {
    lightsMap: { value: nightMap },
    sunDir: { value: new THREE.Vector3(1, 0, 0) }
  };
  const nightMesh = new THREE.Mesh(
    new THREE.SphereGeometry(R * 1.004, 64, 64),
    new THREE.ShaderMaterial({
      uniforms: nightUniforms,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexShader: `
        varying vec2 vUv; varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform sampler2D lightsMap; uniform vec3 sunDir;
        varying vec2 vUv; varying vec3 vWorldNormal;
        void main() {
          float f = dot(normalize(vWorldNormal), normalize(sunDir));
          float night = smoothstep(0.12, -0.28, f);
          gl_FragColor = vec4(texture2D(lightsMap, vUv).rgb * night * 1.7, 1.0);
        }`
    })
  );
  earthGroup.add(nightMesh);

  /* Atmosphere — soft additive limb glow behind the planet */
  const glowCanvas = document.createElement("canvas");
  glowCanvas.width = glowCanvas.height = 128;
  const gctx = glowCanvas.getContext("2d");
  const grad = gctx.createRadialGradient(64, 64, 28, 64, 64, 64);
  grad.addColorStop(0, "rgba(110,170,255,0)");
  grad.addColorStop(0.66, "rgba(110,170,255,0)");
  grad.addColorStop(0.82, "rgba(125,185,255,0.6)");
  grad.addColorStop(1, "rgba(80,140,255,0)");
  gctx.fillStyle = grad;
  gctx.fillRect(0, 0, 128, 128);
  const atmo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(glowCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  atmo.scale.set(R * 2.45, R * 2.45, 1);
  earthGroup.add(atmo);

  /* ---------- ISS marker + trail ---------- */
  const issCanvas = document.createElement("canvas");
  issCanvas.width = issCanvas.height = 64;
  const ictx = issCanvas.getContext("2d");
  const igrad = ictx.createRadialGradient(32, 32, 0, 32, 32, 32);
  igrad.addColorStop(0, "rgba(255,225,130,1)");
  igrad.addColorStop(0.4, "rgba(255,215,106,0.6)");
  igrad.addColorStop(1, "rgba(255,215,106,0)");
  ictx.fillStyle = igrad;
  ictx.fillRect(0, 0, 64, 64);
  const issSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(issCanvas), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  issSprite.scale.set(9, 9, 1);
  earthGroup.add(issSprite);

  const TRAIL_MAX = 150;
  const trailPts = [];
  const trailGeo = new THREE.BufferGeometry();
  const trailLine = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: 0xffd76a, transparent: true, opacity: 0.65, blending: THREE.AdditiveBlending }));
  earthGroup.add(trailLine);

  /* ---------- math ---------- */
  const latLonToVec = (latDeg, lonDeg, radius) => {
    const phi = latDeg * Math.PI / 180, lam = lonDeg * Math.PI / 180;
    return new THREE.Vector3(
      radius * Math.cos(phi) * Math.cos(lam),
      radius * Math.sin(phi),
      radius * Math.cos(phi) * Math.sin(lam)
    );
  };
  const dayOfYear = d => Math.floor((d - new Date(Date.UTC(d.getUTCFullYear(), 0, 0))) / 86400000);
  const sunFromClock = d => {
    const decl = -23.44 * Math.cos((2 * Math.PI / 365.24) * (dayOfYear(d) + 10));
    const hourUtc = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
    const lon = (((12 - hourUtc) * 15) % 360 + 540) % 360 - 180;
    return { lat: decl, lon };
  };

  let sunPos = sunFromClock(new Date());

  const UP = new THREE.Vector3(0, 1, 0);
  const updateSun = () => {
    const jd = Date.now() / 86400000 + 2440587.5;
    const gmst = (280.46061837 + 360.985647366286 * (jd - 2451545.0)) * Math.PI / 180;
    earthGroup.rotation.y = gmst + Math.PI;
    const v = latLonToVec(sunPos.lat, sunPos.lon, 1000).applyAxisAngle(UP, earthGroup.rotation.y);
    sunLight.position.copy(v);
    nightUniforms.sunDir.value.copy(v.clone().normalize());
  };
  const updateISS = d => {
    const v = latLonToVec(d.latitude, d.longitude, R * 1.055);
    issSprite.position.copy(v);
    trailPts.push(v.clone());
    if (trailPts.length > TRAIL_MAX) trailPts.shift();
    if (trailPts.length >= 2) trailGeo.setFromPoints(trailPts);
  };

  /* ---------- interaction ---------- */
  let dragging = false, lastX = 0, lastY = 0, velY = 0, velX = 0;
  let autoOrbit = true, idleFrames = 0;
  canvas.style.cursor = "grab";

  canvas.addEventListener("pointerdown", e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY; velY = velX = 0; idleFrames = 0;
    canvas.setPointerCapture(e.pointerId); canvas.style.cursor = "grabbing";
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    viewRot += dx * 0.005;
    viewTilt = Math.max(-0.85, Math.min(1.1, viewTilt + dy * 0.004));
    velY = dx * 0.005; velX = dy * 0.004;
    placeCamera(); idleFrames = 0;
  });
  const endDrag = () => { dragging = false; canvas.style.cursor = "grab"; };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    viewTilt = viewTilt; /* height handled by pointer; wheel = dolly via FOV-free zoom */
    camera.position.setLength(Math.max(180, Math.min(720, camera.position.length() + e.deltaY * 0.35)));
    camera.lookAt(0, 0, 0);
  }, { passive: false });

  /* ---------- HUD ---------- */
  const $id = id => document.getElementById(id);
  const hud = {
    utc: $id("hudUtc"), doy: $id("hudDoy"), decl: $id("hudDecl"), subsolar: $id("hudSubsolar"),
    issLat: $id("issLat"), issLng: $id("issLng"), issAlt: $id("issAlt"),
    issVel: $id("issVel"), issVis: $id("issVis"), issTime: $id("issTime"), issState: $id("issState")
  };

  const tickClock = () => {
    const now = new Date();
    sunPos = sunFromClock(now);
    if (hud.utc) hud.utc.textContent = now.toISOString().slice(11, 19) + " UTC";
    if (hud.doy) hud.doy.textContent = "Day " + dayOfYear(now) + " / " + now.getUTCFullYear();
    if (hud.decl) hud.decl.textContent = "δ " + sunPos.lat.toFixed(2) + "°";
    if (hud.subsolar) hud.subsolar.textContent = sunPos.lat.toFixed(1) + "°, " + sunPos.lon.toFixed(1) + "°";
    updateSun();
  };

  /* ---------- ISS telemetry ---------- */
  let issFails = 0;
  const fetchISS = async () => {
    try {
      const r = await fetch("https://api.wheretheiss.at/v1/satellites/25544", { cache: "no-store" });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const d = await r.json();
      issFails = 0;
      if (typeof d.solar_lat === "number") sunPos = { lat: d.solar_lat, lon: d.solar_lon };
      updateISS(d);
      updateSun();
      if (hud.issLat) hud.issLat.textContent = d.latitude.toFixed(2) + "°";
      if (hud.issLng) hud.issLng.textContent = d.longitude.toFixed(2) + "°";
      if (hud.issAlt) hud.issAlt.textContent = Math.round(d.altitude) + " km";
      if (hud.issVel) hud.issVel.textContent = Math.round(d.velocity).toLocaleString() + " km/h";
      if (hud.issVis) hud.issVis.textContent = String(d.visibility).toUpperCase();
      if (hud.issTime) hud.issTime.textContent = new Date(d.timestamp * 1000).toISOString().slice(11, 19) + " UTC";
      if (hud.issState) { hud.issState.textContent = "● LIVE"; hud.issState.className = "iss-state live"; }
    } catch (e) {
      issFails++;
      if (hud.issState) { hud.issState.textContent = issFails > 2 ? "○ TELEMETRY OFFLINE" : "… retrying"; hud.issState.className = "iss-state off"; }
    }
  };

  /* ---------- buttons ---------- */
  const btnNight = document.getElementById("btnNight");
  if (btnNight) btnNight.addEventListener("click", () => {
    nightMesh.visible = !nightMesh.visible;
    btnNight.textContent = nightMesh.visible ? "Night lights: ON" : "Night lights: OFF";
    btnNight.classList.toggle("primary", nightMesh.visible);
  });
  const btnReset = document.getElementById("btnReset");
  if (btnReset) btnReset.addEventListener("click", () => { viewRot = 0; viewTilt = 0.15; placeCamera(); });
  const btnAuto = document.getElementById("btnAuto");
  if (btnAuto) btnAuto.addEventListener("click", () => {
    autoOrbit = !autoOrbit;
    btnAuto.textContent = autoOrbit ? "Auto-orbit: ON" : "Auto-orbit: OFF";
    btnAuto.classList.toggle("primary", autoOrbit);
  });

  /* ---------- resize + loop ---------- */
  const fit = () => {
    const w = canvas.parentElement.clientWidth;
    const h = Math.max(420, Math.min(660, Math.round(w * 0.72)));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    placeCamera();
  };
  window.addEventListener("resize", fit);
  fit();

  updateSun();
  tickClock();
  fetchISS();
  setInterval(fetchISS, 4000);
  setInterval(tickClock, 1000);

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    if (!dragging) {
      viewRot += velY; velY *= 0.94; velX *= 0.94;
      viewTilt = Math.max(-0.85, Math.min(1.1, viewTilt + velX));
      idleFrames++;
      if (autoOrbit && idleFrames > 150) viewRot += 0.0009;
    }
    placeCamera();
    issSprite.material.rotation = t * 0.8;
    renderer.render(scene, camera);
  }
  animate();
})();
