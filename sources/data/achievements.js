import labData from "./lab.js";
import projectsData from "./projects.js";

export default [
  ["startDrive", "Let’s Drive!", "Start driving the car.", 1],
  ["exploreWorld", "Explorer", "Explore every area of the map.", 10, true],
  [
    "projects",
    "Project Showcase",
    "Check every project in the <strong>projects</strong> area.",
    projectsData.length,
    true,
  ],
  [
    "lab",
    "Experiment Zone",
    "Check every experiment in the <strong>lab</strong> area.",
    labData.length,
    true,
  ],

  ["distanceDriven", "First Ride", "Drive <strong>1 km</strong>.", 1],
  ["distanceDriven", "Road Trip", "Drive <strong>10 km</strong>.", 10],
  ["distanceDriven", "Long Journey", "Drive <strong>100 km</strong>.", 100],

  ["speed", "Need for Speed", "Reach a speed of <strong>100 km/h</strong>.", 1],

  [
    "goHigh",
    "Sky Rider",
    "Reach <strong>15 meters</strong> high with your car.",
    1,
  ],

  ["frontFlip", "Front Flip", "Do a front flip and land on your wheels.", 1],

  ["backFlip", "Back Flip", "Do a back flip and land on your wheels.", 1],

  ["drift", "Drift King", "Perform a clean drift.", 1],

  ["jump", "Jump Master", "Perform a long jump with the vehicle.", 1],

  ["raceFinish", "Finish Line", "Finish a race.", 1],

  [
    "raceFast",
    "Speed Demon",
    "Finish a race in less than <strong>30 seconds</strong>.",
    1,
  ],

  ["leaderboard", "Top Driver", "Reach the leaderboard.", 1],

  ["weatherSnow", "Snow Driver", "Drive during snowy weather.", 1],

  ["weatherRain", "Rain Driver", "Drive during rainy weather.", 1],

  ["lightning", "Lightning Strike", "Get hit by lightning while driving.", 1],

  ["crash", "Crash Test", "Crash the car.", 1],

  ["reset", "Reset Vehicle", "Reset the vehicle position.", 1],

  ["debug", "Developer Mode", "Access the debug UI.", 1],

  ["hacker", "Secret Achievement", "This one cannot be achieved.", 1],
];
