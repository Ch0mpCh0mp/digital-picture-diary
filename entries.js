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
  const weekday = d.toLocaleDateString("de-DE", { weekday: "short" }).toUpperCase();
  const day = String(d.getDate()).padStart(2, "0");
  return { weekday, day };
}

// ===============================
// 📦 EINTRAG RENDERN
// ===============================

function renderDayBlock(dayEntry) {
  const wrapper = document.createElement("article");
  wrapper.classList.add("entry");

  // Linke Seite (Datum)
  const left = document.createElement("div");
  left.classList.add("left");

  const dateElement = document.createElement("time");
  dateElement.classList.add("daydate");
  dateElement.dateTime = dayEntry.date;
  const { weekday, day } = formatDay(dayEntry.date);
  dateElement.innerHTML = `<strong>${weekday}</strong><br>${day}`;
  left.appendChild(dateElement);

  // Mitte (alle Einträge des Tages)
  const middle = document.createElement("div");
  middle.classList.add("middle");

  dayEntry.entries.forEach((entry) => {
    const note = document.createElement("p");
    note.textContent = entry.note;

    const info = document.createElement("div");
    info.classList.add("middleBottom");

    const time = document.createElement("p");
    time.classList.add("time");
    time.textContent = entry.time;

    const mood = document.createElement("p");
    mood.classList.add("whatsHappening");
    mood.textContent = entry.mood;

    info.appendChild(time);
    info.appendChild(mood);
    middle.appendChild(note);
    middle.appendChild(info);
  });

  // Rechte Seite (letztes Bild des Tages)
  const right = document.createElement("div");
  right.classList.add("right");
  const lastEntry = dayEntry.entries[dayEntry.entries.length - 1];
  if (lastEntry.image) {
    const img = document.createElement("img");
    img.src = lastEntry.image;
    right.appendChild(img);
  }

  // Zusammensetzen
  wrapper.appendChild(left);
  wrapper.appendChild(middle);
  wrapper.appendChild(right);
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
  Object.keys(groupedByMonth).sort().forEach((monthKey) => {
    const monthEntries = groupedByMonth[monthKey];
    const monthName = getMonthName(monthEntries[0].date);

    const heading = document.createElement("h2");
    heading.textContent = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    getEntries.appendChild(heading);

    // Innerhalb des Monats: nach Datum sortieren
    monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));
    monthEntries.forEach((dayEntry) => {
      const block = renderDayBlock(dayEntry);
      getEntries.appendChild(block);
    });
  });
});