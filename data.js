/**
 * Coffee Chat Companion — Demo Data
 * Seed data with demo contact (Erwin Schrödinger).
 * Stored to localStorage on first load if no data exists.
 */

const SEED_DATA = {
  "contacts": [
    {
      "id": "contact-schrodinger-demo",
      "name": "Erwin Schrödinger",
      "nameZh": "薛定谔",
      "title": "Theoretical Physicist / Cat Enthusiast",
      "institution": "University of Dublin (formerly University of Zurich)",
      "researchField": "Quantum Mechanics — Wave Equation & Cat Thought Experiments",
      "email": "",
      "department": "School of Theoretical Physics",
      "relationship": "Coffee chat legend",
      "status": "completed",
      "coffeeType": "espresso",
      "customCoffeeName": null,
      "customCoffeeImage": null,
      "customPhoto": "data:image/jpeg;base64,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",
      "photoUrl": null,
      "tags": [
        "quantum mechanics",
        "wave equation",
        "cat",
        "philosophy of science",
        "Schrödinger equation"
      ],
      "createdAt": "2026-10-30T00:00:00.000Z",
      "lastTalkDate": "1935-08-12",
      "research": {
        "summary": "Erwin Schrödinger (1887-1961) was an Austrian-Irish physicist who developed the Schrödinger equation — the foundational equation of quantum mechanics that describes how the quantum state of a system evolves over time. He won the 1933 Nobel Prize in Physics (shared with Paul Dirac). He is perhaps equally famous among non-physicists for 'Schrödinger's cat,' a thought experiment he proposed in 1935 to illustrate the absurdity of applying the Copenhagen interpretation of quantum superposition to macroscopic objects.",
        "careerPath": [
          "1906-1910: Ph.D. in Physics, University of Vienna",
          "1921-1927: Professor, University of Zurich — developed wave equation",
          "1927-1933: Professor, University of Berlin (succeeding Max Planck)",
          "1933: Nobel Prize in Physics (shared with Dirac)",
          "1939-1956: Professor, Dublin Institute for Advanced Studies",
          "1944: Published 'What is Life?' — influenced Watson and Crick"
        ],
        "researchLines": [
          {
            "title": "The Schrödinger Equation (1926)",
            "detail": "The wave equation governing quantum evolution: iℏ∂Ψ/∂t = ĤΨ. Published in four papers in 1926, replacing matrix mechanics with wave mechanics."
          },
          {
            "title": "Schrödinger's Cat (1935)",
            "detail": "A thought experiment illustrating the absurdity of applying quantum superposition to macroscopic objects. The cat is simultaneously alive and dead until observed."
          },
          {
            "title": "'What is Life?' (1944)",
            "detail": "Proposed that genetic material must be an 'aperiodic crystal' — directly influencing Watson and Crick's discovery of DNA structure."
          }
        ],
        "industryExperience": "Pure academic career. His 'What is Life?' lectures arguably launched molecular biology as we know it.",
        "awards": [
          "1933: Nobel Prize in Physics (shared with Paul Dirac)",
          "1937: Max Planck Medal"
        ],
        "keyPapers": [
          "Schrödinger E. Quantisierung als Eigenwertproblem (I-IV). Annalen der Physik, 1926.",
          "Schrödinger E. Die gegenwärtige Situation in der Quantenmechanik. Die Naturwissenschaften, 1935.",
          "Schrödinger E. What is Life? Cambridge University Press, 1944."
        ]
      },
      "questions": [
        {
          "id": "q-schrod-1",
          "text": "So... about the cat — do you feel guilty? Do you ever think about how the internet turned your reductio ad absurdum into the world's most famous physics meme?",
          "note": "He designed the cat experiment to mock the Copenhagen interpretation.",
          "tags": [
            "open",
            "fun"
          ]
        },
        {
          "id": "q-schrod-2",
          "text": "You published the wave equation in 1926 and won the Nobel in 1933 — but Heisenberg published matrix mechanics first in 1925. Did you see wave mechanics as genuinely distinct?",
          "note": "Wave mechanics and matrix mechanics were later proven equivalent by Schrödinger himself.",
          "tags": [
            "deep",
            "methodology"
          ]
        },
        {
          "id": "q-schrod-3",
          "text": "'What is Life?' predicted that genetic material is an aperiodic crystal — and 9 years later Watson and Crick found DNA. When you heard about the double helix, did you think 'I called it'?",
          "note": "He predicted the concept but not the specific structure.",
          "tags": [
            "deep",
            "conceptual"
          ]
        }
      ],
      "talkRecords": [
        {
          "id": "talk-schrod-1",
          "date": "1935-08-12",
          "location": "A café in Dublin (he insisted on the outdoor table, 'for the cat')",
          "topics": "Quantum superposition, the cat experiment, and whether physicists take their own theories too seriously",
          "notes": "Schrödinger arrived 15 minutes late, carrying a cardboard box with air holes. When asked if there was a cat inside, he replied: 'That depends on whether you look.' He then opened the box to reveal it was empty and laughed for a solid 30 seconds.\n\nHe explained the cat thought experiment over three espressos, growing more animated with each one. 'The point is NOT the cat,' he kept saying, slamming the table. 'The point is that if you take the Copenhagen interpretation seriously, you must accept that a macroscopic object can be in two states at once. This is obviously absurd.'\n\nWhen I asked if he felt responsible for generations of physics students being confused about cats, he said: 'I wrote one paper. One! And now I am the cat man. I discovered the fundamental equation of quantum mechanics and I am the cat man. This is what fame does.'",
          "insights": "1. Schrödinger did not intend the cat as a serious proposal — it was a critique that got wildly misunderstood.\n2. He is somewhat bitter that the cat overshadowed the wave equation in popular culture.\n3. He genuinely cares about the philosophy of quantum mechanics.\n4. The man can drink an alarming amount of espresso."
        }
      ],
      "followups": [
        {
          "id": "fu-schrod-1",
          "text": "Read 'What is Life?' properly and think about whether negentropy is actually a useful concept for modern biology",
          "done": false
        },
        {
          "id": "fu-schrod-2",
          "text": "Look up Schrödinger's 1935 paper — the original cat paper, not the memes",
          "done": false
        }
      ]
    }
  ]
};
