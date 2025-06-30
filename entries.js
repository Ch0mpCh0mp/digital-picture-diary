// ===============================
// 🌍 GLOBALE VARIABLEN / ELEMENTE
// ===============================

const getEntries = document.querySelector(".entries");

// ===============================
// 🔧 HILFSFUNKTIONEN
// ===============================

function getStoredEntries() {
  return JSON.parse(localStorage.getItem("diaryEntries")) || [];
}

function getMonthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthName(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
}

function formatDay(dateStr) {
  const d = new Date(dateStr);
  const weekday = d
    .toLocaleDateString("de-DE", { weekday: "short" })
    .toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { weekday, day };
}

// ===============================
// 📦 EINTRAG RENDERN
// ===============================

function renderEntry(entry) {
  const container = document.createElement("div");
  container.classList.add("entryGroup");

  entry.entries.forEach((singleEntry) => {
    const entryDiv = document.createElement("div");
    entryDiv.classList.add("entry");

    // 🔹 LINKS
    const left = document.createElement("div");
    left.classList.add("left");

    const { weekday, day } = formatDay(entry.date);

    const daySpan = document.createElement("div");
    daySpan.classList.add("day");
    daySpan.textContent = weekday;

    const dateSpan = document.createElement("div");
    dateSpan.classList.add("date");
    dateSpan.textContent = day;

    left.appendChild(daySpan);
    left.appendChild(dateSpan);

    // 🔹 MITTE
    const middle = document.createElement("div");
    middle.classList.add("middle");

    const mood = document.createElement("div");
    mood.textContent = singleEntry.mood;

    const note = document.createElement("div");
    note.textContent = singleEntry.note;

    const middleBottom = document.createElement("div");
    middleBottom.classList.add("middleBottom");
    middleBottom.textContent = singleEntry.time;

    middle.appendChild(mood);
    middle.appendChild(note);
    middle.appendChild(middleBottom);

    // 🔹 RECHTS
    const right = document.createElement("div");
    right.classList.add("right");

    const img = document.createElement("img");
    img.src = singleEntry.images[0];
    img.alt = "Day Image";

    right.appendChild(img);

    // 🔹 Zusammensetzen
    entryDiv.appendChild(left);
    entryDiv.appendChild(middle);
    entryDiv.appendChild(right);
    container.appendChild(entryDiv);
  });

  return container;
}

function renderDayBlock(entry) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("dayBlock");

  const content = renderEntry(entry);
  wrapper.appendChild(content);

  return wrapper;
}

// ===============================
// 🧭 INITIALISIERUNG BEIM LADEN
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const entries = getStoredEntries();

  // Nach Monat gruppieren
  const groupedByMonth = {};
  entries.forEach((entry) => {
    const monthKey = getMonthKey(entry.date);
    if (!groupedByMonth[monthKey]) groupedByMonth[monthKey] = [];
    groupedByMonth[monthKey].push(entry);
  });

  // Sortierte Monatsgruppen anzeigen
  Object.keys(groupedByMonth)
    .sort()
    .forEach((monthKey) => {
      const monthEntries = groupedByMonth[monthKey];
      const monthName = getMonthName(monthEntries[0].date);

      const heading = document.createElement("h2");
      heading.textContent =
        monthName.charAt(0).toUpperCase() + monthName.slice(1);
      getEntries.appendChild(heading);

      // Innerhalb des Monats: nach Datum sortieren
      monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
      monthEntries.forEach((dayEntry) => {
        const block = renderDayBlock(dayEntry);
        getEntries.appendChild(block);
      });
    });
});
