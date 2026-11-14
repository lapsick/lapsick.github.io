---
title: "Vibe Coding an Android App with Plan Mode"
slug: vibe-coding-washingapp
summary: How I used Codex Plan Mode and a single plan file to build a camera-based laundry app for my phone.
publishDate: 2026-11-14
tags: [ai, codex, android]
draft: false
---

I wanted an app for my Galaxy S23 that could look at one garment through the camera and suggest a gel for whites, colors, or darks.
I started in Codex Plan Mode, where a few questions helped me settle on an Android app that works offline and scans one item at a time.

I used no custom skills or rules for the project.
Plan Mode gave me a single deliverable, a [`plan.md`](https://github.com/lapsick/WashingApp/blob/master/PLAN.md) file that spelled out the camera flow, the Kotlin and CameraX stack, and what to test on the phone.
I gave Codex that same plan to implement, then tried the signed APK on my S23.

The first version recommended color gel for my white towels and shirts, even after an adjustment that passed the automated tests.
Measurements from the phone showed that the camera made the white fabric look much darker under my lighting.
That led to a calibration step that uses a known white garment as a reference for the rest of the batch.
The plan got me to something I could install, and testing it with my own laundry showed me what to change.

[WashingApp on GitHub](https://github.com/lapsick/WashingApp)
