# Learn Kubernetes

A visual guide: eight short lessons, each built around a hand-drawn diagram, four with a lab you can operate (a component explorer, a Service label flip, scaling with kill-a-pod, and a rolling-update stepper). No build step, no dependencies: open `index.html`.

Kubernetes means "helmsman", so the pages are charts you steer by.

| Page | What |
|---|---|
| `index.html` | One chart of the whole site, every label a link |
| `introduction.html` | Desired state and the reconcile loop |
| `components.html` | Control plane and node components (explorer) |
| `objects.html` | Pods, ReplicaSets, Deployments, labels |
| `deploy.html` | A Deployment and a Service, and what happens on apply |
| `services.html` | ClusterIP, NodePort, LoadBalancer (label lab) |
| `scaling.html` | Replicas and self-healing (lab) |
| `rolling-updates.html` | maxSurge and maxUnavailable (stepper) |
| `tutorials.html` | Run it locally, and a kubectl cheat sheet |

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

An independent guide, not affiliated with the Kubernetes project or the Linux Foundation. See `DESIGN-LOG.md` for how this redesign was made and judged, and `CONTRIBUTING.md` to send a change.
