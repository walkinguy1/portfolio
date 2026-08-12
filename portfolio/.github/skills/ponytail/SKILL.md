---
name: ponytail
description: "Use when you need the smallest correct coding change: read the touched code first, prefer reuse and stdlib/native features, and avoid unrequested abstractions."
---

# Ponytail

Use this skill when working on coding tasks where the goal is the smallest correct change, not the most elaborate design.

## Core rule

Read the code the change actually touches before choosing a solution. Trace the real flow, then pick the smallest rung that solves the problem.

## Decision ladder

1. Does this need to exist?
   - If no, skip it.
2. Is it already in this codebase?
   - Reuse it.
3. Does the standard library do it?
   - Use stdlib.
4. Does the native platform do it?
   - Use that.
5. Is there already an installed dependency that does it?
   - Use it before adding anything new.
6. Is one line enough?
   - Prefer one line.
7. Otherwise:
   - Make the minimum change that works.

## Guardrails

- Never remove trust-boundary validation.
- Never cut data-loss protection.
- Never weaken security checks.
- Never strip accessibility behavior.
- Do not add speculative abstractions, factories, wrappers, or config unless the request requires them.
- Do not introduce new dependencies when the codebase already has a good local or native option.
- Keep the change inside the smallest relevant surface area.

## Working method

- Inspect the caller, callee, and the nearest tests or checks.
- Form one falsifiable hypothesis about how the code works or fails.
- Make the smallest edit that tests that hypothesis.
- Validate with the cheapest relevant command, test, or compile check.
- If validation fails, repair the same local slice before widening scope.

## Review mode

If the task is a review rather than an implementation, focus on over-engineering first:

- Flag dead code, needless layers, reinvented stdlib, and speculative features.
- Prefer delete, shrink, or replace with built-in behavior.
- Keep each finding short and concrete.
- Preserve correctness and the guardrails above.

## Completion check

The change is done when:

- the implementation is minimal,
- the request is satisfied,
- nearby behavior is unchanged unless requested,
- and the chosen validation passes or any remaining risk is stated clearly.
