/**
 * Achievers University undergraduate school fees by programme and level.
 *
 * Source (official admissions fees page, per-programme itemised breakdown):
 * https://admission.achievers.edu.ng/fees.html
 *
 * Session: 2026/2027 (stated on page: "Returning Students — 2026/2027 Academic Session").
 * Each level total = tuition + sundry + clinical + ict + dipCert (page's own components).
 * Cells with unfilled tuition (0) or placeholder values are intentionally omitted
 * (kept empty rather than published understated). The page's "scholarship" field is
 * spurious (values like 70-100) and is dropped.
 */

export const ACHIEVERS_SLUG = "achievers-university";
export const ACHIEVERS_SESSION = "2026/2027";
export const ACHIEVERS_SOURCE = "https://admission.achievers.edu.ng/fees.html";

/** Universal one-time charges for fresh students (listed separately on the page). */
export const ACHIEVERS_FRESH_ONE_TIME = {
  acceptance: 50_000,
  matriculation: 10_000,
  idCard: 7_500,
};

export type AchieversLevel = {
  level: string;
  tuition: number;
  sundry: number;
  clinical: number;
  ict: number;
  dipCert: number;
  total: number;
  reconcile?: number;
};

export type AchieversProgramme = {
  name: string;
  college: string;
  duration_years: number;
  levels: AchieversLevel[];
};

export const ACHIEVERS_PROGRAMMES: AchieversProgramme[] = [
  {
    "name": "Medicine and Surgery",
    "college": "COLLEGE OF MEDICINE",
    "duration_years": 6,
    "levels": [
      {
        "level": "100L",
        "tuition": 5750000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 6210000
      },
      {
        "level": "200L",
        "tuition": 5500000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 5980000
      },
      {
        "level": "300L",
        "tuition": 5000000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 5560000
      },
      {
        "level": "400L",
        "tuition": 4500000,
        "sundry": 300000,
        "clinical": 300000,
        "ict": 0,
        "dipCert": 0,
        "total": 5100000
      }
    ]
  },
  {
    "name": "Pharmacy",
    "college": "FACULTY OF PHARMACEUTICAL SCIENCES",
    "duration_years": 6,
    "levels": [
      {
        "level": "100L",
        "tuition": 2350000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2810000
      },
      {
        "level": "200L",
        "tuition": 2350000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 2830000
      },
      {
        "level": "300L",
        "tuition": 2350000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2810000
      },
      {
        "level": "400L",
        "tuition": 2350000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2810000
      }
    ]
  },
  {
    "name": "Nursing Science",
    "college": "FACULTY OF NURSING SCIENCE",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 2000000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2460000
      },
      {
        "level": "200L",
        "tuition": 1800000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 2430000
      },
      {
        "level": "300L",
        "tuition": 1600000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2210000
      },
      {
        "level": "400L",
        "tuition": 1600000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2210000
      },
      {
        "level": "500L",
        "tuition": 1600000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2210000
      }
    ]
  },
  {
    "name": "Physiotherapy",
    "college": "FACULTY OF BASIC MEDICAL SCIENCES",
    "duration_years": 6,
    "levels": [
      {
        "level": "100L",
        "tuition": 2000000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2460000
      },
      {
        "level": "200L",
        "tuition": 2000000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 2480000
      },
      {
        "level": "300L",
        "tuition": 2000000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2460000
      },
      {
        "level": "400L",
        "tuition": 2000000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2560000
      }
    ]
  },
  {
    "name": "Medical Laboratory Science",
    "college": "FACULTY OF MEDICAL LABORATORY SCIENCE",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 1300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 1760000
      },
      {
        "level": "200L",
        "tuition": 1300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 1780000
      },
      {
        "level": "300L",
        "tuition": 1200000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 1810000
      },
      {
        "level": "400L",
        "tuition": 1200000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 1810000
      },
      {
        "level": "500L",
        "tuition": 1200000,
        "sundry": 300000,
        "clinical": 250000,
        "ict": 60000,
        "dipCert": 0,
        "total": 1810000
      }
    ]
  },
  {
    "name": "Biochemistry",
    "college": "FACULTY OF BASIC MEDICAL SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 0,
        "total": 635000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 655000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 0,
        "total": 635000
      }
    ]
  },
  {
    "name": "Public Health",
    "college": "FACULTY OF BASIC MEDICAL SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 600000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 1060000
      },
      {
        "level": "200L",
        "tuition": 600000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 1080000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 125000,
        "ict": 60000,
        "dipCert": 0,
        "total": 885000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 125000,
        "ict": 60000,
        "dipCert": 0,
        "total": 885000
      }
    ]
  },
  {
    "name": "Human Anatomy",
    "college": "FACULTY OF BASIC MEDICAL SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      },
      {
        "level": "200L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 780000
      },
      {
        "level": "300L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      },
      {
        "level": "400L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      }
    ]
  },
  {
    "name": "Human Physiology",
    "college": "FACULTY OF BASIC MEDICAL SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 0,
        "total": 735000
      },
      {
        "level": "200L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 755000
      },
      {
        "level": "300L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 0,
        "total": 735000
      },
      {
        "level": "400L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 75000,
        "ict": 60000,
        "dipCert": 0,
        "total": 735000
      }
    ]
  },
  {
    "name": "Law",
    "college": "FACULTY OF LAW",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 2100000,
        "sundry": 300000,
        "clinical": 60000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2520000
      },
      {
        "level": "200L",
        "tuition": 2100000,
        "sundry": 300000,
        "clinical": 60000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 2540000
      },
      {
        "level": "300L",
        "tuition": 1800000,
        "sundry": 300000,
        "clinical": 60000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2220000
      },
      {
        "level": "400L",
        "tuition": 1800000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2220000,
        "reconcile": 10000
      },
      {
        "level": "500L",
        "tuition": 1800000,
        "sundry": 300000,
        "clinical": 150000,
        "ict": 60000,
        "dipCert": 0,
        "total": 2310000
      }
    ]
  },
  {
    "name": "Civil & Environmental Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Computer Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 980000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Electrical & Electronics Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 980000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Mechanical Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 980000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Mechatronics Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 980000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Biomedical Engineering",
    "college": "FACULTY OF ENGINEERING AND TECHNOLOGY",
    "duration_years": 5,
    "levels": [
      {
        "level": "100L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 980000
      },
      {
        "level": "300L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "400L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      },
      {
        "level": "500L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 50000,
        "ict": 60000,
        "dipCert": 0,
        "total": 810000
      }
    ]
  },
  {
    "name": "Industrial Chemistry",
    "college": "FACULTY OF NATURAL AND APPLIED SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 680000
      }
    ]
  },
  {
    "name": "Computer Science",
    "college": "FACULTY OF NATURAL AND APPLIED SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 500000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 960000
      },
      {
        "level": "200L",
        "tuition": 400000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 880000
      },
      {
        "level": "300L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      },
      {
        "level": "400L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      }
    ]
  },
  {
    "name": "Geology",
    "college": "FACULTY OF NATURAL AND APPLIED SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 680000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 150000,
        "ict": 60000,
        "dipCert": 0,
        "total": 710000
      }
    ]
  },
  {
    "name": "Microbiology",
    "college": "FACULTY OF NATURAL AND APPLIED SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 680000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 100000,
        "ict": 60000,
        "dipCert": 0,
        "total": 660000
      }
    ]
  },
  {
    "name": "Accounting",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      }
    ]
  },
  {
    "name": "Business Administration",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      }
    ]
  },
  {
    "name": "Criminology and Security Studies",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 660000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      }
    ]
  },
  {
    "name": "International Relations",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      }
    ]
  },
  {
    "name": "Mass Communication",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 300000,
        "sundry": 300000,
        "clinical": 30000,
        "ict": 60000,
        "dipCert": 0,
        "total": 690000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 30000,
        "ict": 60000,
        "dipCert": 20000,
        "total": 610000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 30000,
        "ict": 60000,
        "dipCert": 0,
        "total": 590000
      },
      {
        "level": "400L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 30000,
        "ict": 60000,
        "dipCert": 0,
        "total": 590000
      }
    ]
  },
  {
    "name": "Political Science",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "100L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 0,
        "total": 560000
      },
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      }
    ]
  },
  {
    "name": "Public Administration",
    "college": "FACULTY OF SOCIAL AND MANAGEMENT SCIENCES",
    "duration_years": 4,
    "levels": [
      {
        "level": "200L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 0,
        "ict": 60000,
        "dipCert": 20000,
        "total": 580000
      },
      {
        "level": "300L",
        "tuition": 200000,
        "sundry": 300000,
        "clinical": 200000,
        "ict": 60000,
        "dipCert": 0,
        "total": 760000
      }
    ]
  }
];
