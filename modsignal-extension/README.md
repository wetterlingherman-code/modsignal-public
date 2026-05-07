# ModSignal Extension Prototype

A prototype Chrome-extension inspired moderation support tool developed for the course *Datadriven verksamhetsutveckling* at the University of Gothenburg.

---

## Overview

ModSignal is a moderation support prototype focused on helping moderators identify escalating discussions and prioritize moderation workload in Reddit-like communities.

The prototype explores how data-driven tools and machine learning-inspired risk signals can support moderation workflows without limiting freedom of expression.

---

## Core Features

- Interactive Reddit-like discussion interface
- Floating moderation extension overlay
- Priority queue for moderation cases
- Escalation and risk indicators
- Highlighted discussion branches
- Compact moderator workflow
- Dataset-driven mock environment
- Swedish moderation-oriented UI

---

## Dataset

The prototype currently uses transformed data from:

```python
from datasets import load_dataset

ds = load_dataset("alexandrainst/scandi-reddit", "da")
```

The dataset is processed into moderation-oriented prototype cases such as:

- escalation score
- risk level
- moderation priority
- discussion clustering

---

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- HuggingFace Datasets

---

## Purpose

This project was created as part of a university project exploring:

- political polarization
- online discussion climates
- moderation workflows
- data-driven decision support

The goal is not to automate moderation decisions, but to support moderators in prioritizing potentially escalating discussions.

---

## Status

Current state:

- MVP prototype
- interactive frontend
- local dataset integration
- visual moderation workflow demo

---

## Running the project

```bash
npm install
npm run dev
```

---

## Project Structure

```text
modsignal-extension/
├── public/
├── scripts/
├── src/
├── package.json
└── vite.config.js
```

---

## Disclaimer

This is an academic prototype intended for exploration and testing purposes.

It is not a production moderation system.
