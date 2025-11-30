import { RuleBookData } from './types';

export const INITIAL_DATA: RuleBookData = {
  "meta": {
    "title": "Atharva's Ultimate Rule Book",
    "version": "1.0.0",
    "createdAt": "2025-11-29T00:00:00Z",
    "updatedAt": "2025-11-29T00:00:00Z"
  },
  "rules": [
    {
      "id": "rule-1",
      "title": "Health",
      "description": "Daily habits for physical and mental well-being",
      "order": 1,
      "createdAt": "2025-11-29T00:01:00Z",
      "updatedAt": "2025-11-29T00:01:00Z",
      "points": [
        {"id":"p1","text":"Eat a balanced meal every 4–5 hours","done":false,"order":1},
        {"id":"p2","text":"Exercise 30 min (cardio/strength)","done":false,"order":2},
        {"id":"p3","text":"Sleep 7–8 hours nightly","done":false,"order":3}
      ]
    },
    {
      "id": "rule-2",
      "title": "Learning",
      "description": "How I approach studying and skill growth",
      "order": 2,
      "createdAt": "2025-11-29T00:02:00Z",
      "updatedAt": "2025-11-29T00:02:00Z",
      "points": [
        {"id":"p4","text":"Study in 25/5 Pomodoro blocks","done":false,"order":1}
      ]
    }
  ]
};