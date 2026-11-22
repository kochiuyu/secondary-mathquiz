# Planned mathematical drawing contracts

These are requirements for P2.2, not completed renderers. Every visual has a keyboard/text route and a print version. Visible labels must not overlap; test both scripts, narrow screens and rotated/reflected cases. Do not put a hidden solution into an unrevealed diagram's alternative text.

## Number line and signed movement

The retained model holds rational values, start, operand and operation. Select a rational tick interval that includes all displayed points and zero; map v to `left + (v−minimum)/(maximum−minimum) × width`. Never use equal pixel spacing for unequal values. Preserve a minimum gap between label boxes; extend bounds or move labels to separate rows when necessary. Clip neither arrowheads nor the zero label.

A movement has a labelled start and a directed arrow whose endpoint comes from the mathematical operation. Subtracting a negative uses the inverse movement; the arrow is not chosen by the operand's raw sign alone. In an unanswered endpoint task, hide the numerical endpoint label as appropriate while retaining enough scale to solve it. Its text alternative gives the start and requested movement rather than the answer. After reveal, annotate the exact endpoint and the inverse check.

## Two lines and a transversal

Represent each line by a point and a nonzero direction vector; require distinct intersections with the transversal and crossing angles bounded away from 0°/180°. Store sector identities as pairs of rays and interior/exterior plus side-of-transversal relations. Determine corresponding, alternate-interior and same-side-interior pairs from this topology, not from hard-coded screen quadrants or colours.

For GE03 construct the two target lines with identical direction vectors and record parallelism as an explicit given. For GE04 construct orientations consistent with the given pair of measures; add no parallel markers before the conclusion. Include a genuinely nonparallel near-miss. Rotation/reflection transforms all geometry and label anchors consistently while retaining or recomputing the ray-based pair identity. Validate the displayed measures against the chosen rays.

Use exact whole-degree metadata for expected answers. Trigonometric pixel coordinates may be floating approximations; they are display data, not the correctness test. Label arcs, parallel arrows and angle givens from the same semantic model. If the picture is schematic, state that angles must be deduced from givens rather than measured.

The accessible alternative names the lines, intersections, selected rays/positions, pair relation when supplied, and any stated parallel premise. It must support the same task. If a spatial identification exercise would be solved by naming the pair directly, instead describe its ray/side positions or provide a structured table alternative and record the adapted evidence mode.

## Triangles and exterior angles

Choose valid A,B,C with A+B+C=180° and all three positive. Place B=(0,0), C=(1,0), then intersect the ray from B at angle B above BC with the ray from C at angle 180°−C. Reject a nonfinite/intersection-too-small result before rendering. Scale uniformly to the viewport, leaving label and extension margins. Never label an arbitrary triangle with unrelated angle values.

For an exterior angle at C, extend BC beyond C along the same line, identify the exterior sector between CA and the extension, and use E=180°−C=A+B. The interior C sector must be visually distinct. For GE06 draw the auxiliary line through A parallel to BC and identify its alternate-angle pairs with AB/AC. The model solution reveals the proof correspondence only after the student response.

## Validation before availability

Check coordinates against semantic ray/angle data within a documented display tolerance, while marking from exact metadata. Check labels/bounds programmatically where practical, then inspect representative extreme, acute/obtuse, rotated/reflected, bilingual, 390px and A4 outputs. Rendering a diagram does not establish mathematical or accessibility review.
