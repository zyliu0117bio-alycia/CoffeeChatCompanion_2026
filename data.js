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
      "customPhoto": null,
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
          "tags": ["open", "fun"]
        },
        {
          "id": "q-schrod-2",
          "text": "You published the wave equation in 1926 and won the Nobel in 1933 — but Heisenberg published matrix mechanics first in 1925. Did you see wave mechanics as genuinely distinct?",
          "note": "Wave mechanics and matrix mechanics were later proven equivalent by Schrödinger himself.",
          "tags": ["deep", "methodology"]
        },
        {
          "id": "q-schrod-3",
          "text": "'What is Life?' predicted that genetic material is an aperiodic crystal — and 9 years later Watson and Crick found DNA. When you heard about the double helix, did you think 'I called it'?",
          "note": "He predicted the concept but not the specific structure.",
          "tags": ["deep", "conceptual"]
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
