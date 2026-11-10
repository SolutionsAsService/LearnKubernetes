// Learn Kubernetes: four small labs, no dependencies. Every page reads without this file.
// The models are deliberately simple and each lab says so; they show the idea, not the scheduler.
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var NODES = ['node-a', 'node-b', 'node-c'];
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  // ---- SCALING: replicas spread over three nodes; click a pod to kill it and watch the ReplicaSet replace it.
  var sc = $('[data-lab=scale]');
  if (sc) {
    var slider = $('input[type=range]', sc), out = $('output', sc), stat = $('.status', sc), grid = $('.cluster', sc);
    var pods = [], ghosts = [], seq = 0, timers = [];
    var load = function (n) { return pods.filter(function (p) { return p.node === n; }).length; };
    var place = function () { var best = 0; NODES.forEach(function (n, i) { if (load(n) < load(NODES[best])) best = i; }); return NODES[best]; };
    var add = function () { pods.push({ id: ++seq, node: place() }); };
    var render = function (msg) {
      var want = +slider.value; out.textContent = want;
      grid.textContent = '';
      NODES.forEach(function (n) {
        var box = el('div', 'cnode'); box.appendChild(el('h4', null, n));
        var wrap = el('div', 'pods');
        pods.filter(function (p) { return p.node === n; }).forEach(function (p) {
          var b = el('button', 'pod ghost', 'pod-' + p.id); b.type = 'button'; b.setAttribute('aria-label', 'Kill pod ' + p.id + ' on ' + n);
          b.addEventListener('click', function () { kill(p); }); wrap.appendChild(b);
        });
        ghosts.filter(function (g) { return g.node === n; }).forEach(function () { wrap.appendChild(el('span', 'pod ghost-pod', 'new pod')); });
        box.appendChild(wrap); grid.appendChild(box);
      });
      stat.textContent = msg || ('Desired replicas: ' + want + '. Running pods: ' + pods.length + '.');
    };
    var kill = function (p) {
      pods = pods.filter(function (x) { return x !== p; }); ghosts.push({ node: p.node });
      render('Pod ' + p.id + ' died. Desired ' + slider.value + ', running ' + pods.length + '. The ReplicaSet is creating a replacement.');
      var first = $('.cluster button.pod', sc); if (first) first.focus();
      timers.push(setTimeout(function () { ghosts = []; while (pods.length < +slider.value) add(); render('Replacement created. Desired ' + slider.value + ', running ' + pods.length + '.'); }, 1100));
    };
    slider.addEventListener('input', function () {
      timers.forEach(clearTimeout); timers = []; ghosts = [];
      while (pods.length < +slider.value) add();
      while (pods.length > +slider.value) pods.pop();
      render();
    });
    for (var i = 0; i < 3; i++) add(); slider.value = 3; render();
  }

  // ---- ROLLING UPDATE: step through the maxSurge / maxUnavailable rules, simplified (no readiness delays).
  var ro = $('[data-lab=roll]');
  if (ro) {
    var selS = $('[name=surge]', ro), selU = $('[name=unavail]', ro), selR = $('[name=replicas]', ro);
    var board = $('.pods', ro), cap = $('.status', ro), nextB = $('[data-next]', ro), backB = $('[data-back]', ro), resetB = $('[data-reset]', ro);
    var frames = [], at = 0;
    var build = function () {
      var R = +selR.value, S = +selS.value, U = +selU.value; frames = []; at = 0;
      if (S === 0 && U === 0) { frames = null; return; }
      var oldR = R, newR = 0, newP = 0, pa = [], snap = function (text, term) { frames.push({ text: text, old: oldR, term: term || 0, nr: newR, np: newP }); };
      snap('Start: ' + R + ' pods running the old version (v1).');
      for (var guard = 0; guard < 30 && !(oldR === 0 && newR === R); guard++) {
        var create = Math.max(0, Math.min(R - newR - newP, R + S - (oldR + newR + newP)));
        if (create > 0) { newP += create; snap('Surge: create ' + create + ' new pod' + (create > 1 ? 's' : '') + ' (v2). They are starting, not ready.'); }
        var ready = oldR + newR, kill = Math.max(0, Math.min(oldR, ready - (R - U)));
        if (kill > 0) { oldR -= kill; snap('Terminate ' + kill + ' old pod' + (kill > 1 ? 's' : '') + '. At least ' + (R - U) + ' ready pods are kept serving.', kill); }
        if (newP > 0) { newR += newP; newP = 0; snap('The new pods become ready and start taking traffic.'); }
      }
      snap('Done: ' + R + ' pods run v2, none run v1.');
    };
    var draw = function () {
      board.textContent = '';
      if (!frames) { cap.textContent = 'maxSurge and maxUnavailable cannot both be 0: Kubernetes rejects it, because no pod could ever be added or removed.'; nextB.disabled = backB.disabled = true; return; }
      var f = frames[at], add = function (cls, label, n) { for (var i = 0; i < n; i++) board.appendChild(el('span', 'pod ' + cls, label)); };
      add('old', 'v1', f.old); add('old dying', 'v1', f.term); add('new', 'v2', f.nr); add('new pending', 'v2', f.np);
      cap.textContent = 'Step ' + (at + 1) + ' of ' + frames.length + ': ' + f.text;
      backB.disabled = at === 0; nextB.disabled = at === frames.length - 1;
    };
    $$('select', ro).forEach(function (s) { s.addEventListener('input', function () { build(); draw(); }); });
    nextB.addEventListener('click', function () { if (at < frames.length - 1) { at++; draw(); } });
    backB.addEventListener('click', function () { if (at > 0) { at--; draw(); } });
    resetB.addEventListener('click', function () { at = 0; draw(); });
    build(); draw();
  }

  // ---- SERVICES: a Service selects pods by label; flip a pod's label and watch the endpoints change.
  var sv = $('[data-lab=svc]');
  if (sv) {
    var list = $('.pods', sv), bar = $('.svcbar', sv), st = $('.status', sv);
    var labels = ['web', 'web', 'web', 'batch', 'web'];
    var drawS = function () {
      list.textContent = ''; var hits = [];
      labels.forEach(function (l, i) {
        var m = l === 'web', b = el('button', 'pod ghost' + (m ? ' match' : ''), 'pod-' + (i + 1) + '\napp=' + l);
        b.type = 'button'; b.style.whiteSpace = 'pre'; b.setAttribute('aria-label', 'Pod ' + (i + 1) + ', app=' + l + '. Change label.');
        b.addEventListener('click', function () { labels[i] = m ? 'batch' : 'web'; drawS(); list.children[i].focus(); });
        list.appendChild(b); if (m) hits.push('pod-' + (i + 1));
      });
      bar.textContent = 'Service web-svc  selector: app=web';
      st.textContent = hits.length ? 'Endpoints (' + hits.length + '): ' + hits.join(', ') + '. Traffic goes only to these.' : 'No pod matches the selector, so the Service has no endpoints and requests fail.';
    };
    drawS();
  }

  // ---- COMPONENTS: choose a part, see it on the diagram and read what it does.
  var pt = $('[data-lab=parts]');
  if (pt) {
    var T = {
      api: ['kube-apiserver', 'The front door. Every other component, and kubectl, talks to the cluster by talking to the API server. It validates requests and is the only component that reads and writes etcd.'],
      etcd: ['etcd', 'A consistent key-value store holding all cluster state: what you asked for and what exists. Lose it without a backup and you lose the cluster\'s memory.'],
      sched: ['kube-scheduler', 'Watches for pods with no node and picks one, weighing resource requests, constraints and spread. It only decides; the kubelet does the starting.'],
      ctrl: ['kube-controller-manager', 'Runs the control loops: the Deployment, ReplicaSet and node controllers each compare desired state with observed state and act to close the gap.'],
      kubelet: ['kubelet', 'The agent on every node. It takes the pods assigned to its node and asks the container runtime to run them, then reports their health back.'],
      proxy: ['kube-proxy', 'Programs the node\'s network rules so a Service\'s stable address reaches the pods behind it.'],
      runtime: ['Container runtime', 'Actually runs the containers, through the Container Runtime Interface. containerd and CRI-O are the common ones; Docker Engine is no longer called directly since Kubernetes 1.24.']
    };
    var shown = $('.explain', pt), btns = $$('button[data-part]', pt);
    var pick = function (k) {
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-part') === k ? 'true' : 'false'); });
      $$('[data-part]', document).forEach(function (g) { if (g.tagName.toLowerCase() === 'g') g.classList.toggle('on', g.getAttribute('data-part') === k); });
      shown.textContent = ''; var h = el('h3', null, T[k][0]); shown.appendChild(h); shown.appendChild(el('p', null, T[k][1]));
    };
    btns.forEach(function (b) { b.addEventListener('click', function () { pick(b.getAttribute('data-part')); }); });
    pick('api');
  }
})();
