# Learn Kubernetes: design log (DADA, Adaptive, Lite)

## Traversal Plan
- **Mode:** Adaptive (beginners). **Run type:** Lite, stated: one move (the whole redesign and expansion), one panel round, because the person asked for "a dada lite" again.
- **Brief (the person's words):** "Nice diagrams, a great landing page, expand."
- **R0 premortem of the inherited site:** the nav linked to `resources.html` and `contact.html`, which did not exist; the hero and "visual" images were three raster files of unknown provenance (one a logo) with the page's whole message in a stock-looking picture; five thin pages, three of them near-empty prose around a YAML block; the components page said the runtime is "e.g., Docker", which has not been true since Kubernetes 1.24; no diagram of anything.
- **Seed and Breaker:** Kubernetes means helmsman, so the site is a chart-room; the Breaker is the first screen drawn as one chart that summarises the whole site (a link per lesson), not a headline and a stock picture.
- **First screen rule (measured):** the landing chart's bottom edge is at y=774 at 1280x800 and y=786 at 375x812, both above the fold, from two purpose-drawn variants (960x470 and 340x522) so no text falls below 10.5px at a phone.
- **Frontier:** closed after one round; DEFERRED items below.

## Decision Record (the one move)
Replaced every page. Nine pages: landing and eight lessons (how it works, architecture, objects, deploy, services, scaling, rolling updates, practice), seven hand-drawn SVG diagrams, four labs (component explorer, Service label flip, scaling with kill-a-pod, a rolling-update stepper that implements maxSurge and maxUnavailable). Deleted the three raster images and the dead nav links. Fixed the runtime fact. Dark mode, reduced motion, forced colours, a phone menu as a closed disclosure.

## Panel Report (R1, WHOLE, six seats; the data-graphic panel adds Tufte; one agent per reference, three at a time)
| Seat | Observed | Verdict |
|---|---|---|
| Debord | landing YAML said `replicas: 3` over nine drawn pods; "diagram you can touch" claimed for all eight lessons; pills floated away from what they name; "Deployment web" printed under each node; "drawn so it sticks" promises retention | OBJECT |
| Shklovsky | the chart-room concept never reached the page; pills read as a menu; the Service label flip was the strongest moment and was small; Service-type rows clipped text; scaling lab had tiny pods in empty boxes | OBJECT |
| Tufte | deploy labels ran edge to edge; the dashed Service line reached one pod of three; the deploy chain drew a hand-off the text denies; 11px text at phone width; two pod encodings; the API server drawn as parent of its peers | OBJECT |
| Holmes | links inside `role=img`; scaling dropped focus; Services pods had two encodings; groups without a role; jargon unglossed on the first screen | OBJECT |
| Mace | focus lost after a kill; forced-colours focus used fixed colours; pill Tab order not lesson order; some lone links under 24px | OBJECT |
| Cairo | every technical claim matched the docs; the rolling-update stepper checked at all 45 replica/surge/unavailable settings, never breaking its own rules; but `kubectl set image` named a Deployment the site never defines; percentage rounding unsaid | OBJECT |

## Resolutions
- Debord: ADAPT all (replicas 9 over nine pods; lede says what is true; leader lines tie each pill to its part; one bracket label for the Deployment; "drawn step by step").
- Shklovsky 1, 3, 4, 5: ADAPT. A compass rose on the chart, a chart scale-bar rule under every lesson's kicker, bigger Service pods, a killed pod leaves a dashed ghost that is redrawn on the least-loaded node. Shklovsky 2 (draw the pod as a ship): OVERRULE, the metaphor stays in the name and the marks, because a literal ship would cost the diagram its accuracy for a beginner. Shklovsky 3's exit animation: DEFERRED.
- Tufte: ADAPT all (labels widened, three dashed connectors, "each step watches the API server" on the deploy chain, 520-wide figures at 18-19px type, one pod glyph, double-headed arrows for "talks to").
- Holmes: ADAPT all (hero SVGs are `role=group`, a "new words" line under the chart, focus returns to a pod, one signal per Services pod, `role=group` on lab areas).
- Mace: ADAPT (focus restored, `Highlight` in forced colours, pill DOM order is lesson order). Lone-link sizes: inline links in sentences stay (WCAG 2.5.8 inline exception).
- Cairo: ADAPT (commands use `simple-app`; percentages round surge up and unavailable down). Lab names `web-svc` and `simple-app-service` left different: the lab is conceptual.

## Anchor Ledger
Debord: the spectacle. Shklovsky: art as technique. Tufte: graphical integrity. Holmes: mismatch. Mace: universal design. Cairo: how charts lie.

## Step 2g: figures re-measured at the final state
Chart bottom 774 and 786 px; no horizontal scroll on nine pages at 1280, 375 light and 375 dark; 0 console errors; scaling lab 7 replicas spread 3,2,2 and a killed pod replaced; Services lab endpoint list matches the labels; rolling stepper 4 settings re-driven after the edits.

## Stop test (Lite)
S1 Frontier: no OPEN items. S2: every seat objected, every finding adopted, overruled or deferred with a reason; the objecting seats were **not re-judged**: not met. S3, S4: not run (Lite). S5: dotted pair Debord-Shklovsky seated, findings answered: met. The run is incomplete against the full stop conditions by the Lite choice; resume by re-seating Shklovsky, Tufte and Holmes on the final build.

## Carry-Forward Ledger
- A figure's printed numbers must agree with the drawing it sits in (replicas 3 over nine pods).
- A label placed beside a part must be joined to it, or it reads as a menu.
- A diagram for the narrow screen is a second drawing, not a smaller one.
- Links inside an image role are not reachable by a screen reader: use a group.
- A diagram of a system that coordinates through one hub must not draw a chain of calls.

## Follow-up (after the person's review)
The person called it a solid A minus and asked for slightly more Kubernetes blue and less visible styling. Done: Kubernetes blue (#326ce5) header, tables and accents, a blue-tinted page and a blue control plane in place of gold; the dot grid, ruler, compass, double rules, offset shadows and serif headings removed. The grade is kept in the dada ledger, not here.
