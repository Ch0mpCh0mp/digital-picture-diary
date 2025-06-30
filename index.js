// ===============================
// 🌍 GLOBALE VARIABLEN / ELEMENTE
// ===============================

const getForm = document.getElementById("dailyMood");
const getImage = document.getElementById("imageUpload");
const dateInput = document.getElementById("entryDate");
const moodInput = document.querySelector("#moodOfTheDay");
const noteInput = document.querySelector("#noteOfTheDay");
const entriesContainer = document.getElementById("entries");
const clearBtn = document.getElementById("clearButton");

// ===============================
// 🔧 HILFSFUNKTIONEN
// ===============================

function formatDate(dateString) {
  let d = new Date(dateString);
  return d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function renderEntry(entry, isToday = false) {
  console.log("renderEntry aufgerufen für", entry.date);

  const entryDiv = document.createElement("div");
  entryDiv.classList.add("entry");

  const entriesToRender = isToday
    ? [entry.entries[entry.entries.length - 1]]
    : entry.entries;

  entriesToRender.forEach((singleEntry, index) => {
    const container = document.createElement("div");
    container.classList.add("singleEntry");

    const img = document.createElement("img");
    console.log("Bilder:", singleEntry.images);
    img.src = singleEntry.images[singleEntry.images.length - 1]; // letztes Bild

    const h3 = document.createElement("h3");
    h3.textContent = "Mood: " + singleEntry.mood;

    const p = document.createElement("p");
    p.textContent = "Note: " + singleEntry.note;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("deleteEntry");
    deleteButton.setAttribute("data-date", entry.date);
    deleteButton.setAttribute("data-index", index);
    deleteButton.textContent = "🗑️";

    container.appendChild(img);
    container.appendChild(h3);
    container.appendChild(p);
    container.appendChild(deleteButton);

    entryDiv.appendChild(container);
  });

  entriesContainer.appendChild(entryDiv);
}

function getStoredEntries() {
  return JSON.parse(localStorage.getItem("diaryEntries")) || [];
}

function saveEntries(entries) {
  localStorage.setItem("diaryEntries", JSON.stringify(entries));
}

// ===============================
// 🖱️ EVENT-HANDLER
// ===============================

getForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const allFiles = Array.from(getImage.files);
  const mood = moodInput.value.trim();
  const note = noteInput.value.trim();

  if (allFiles.length === 0 || !mood || !note) {
    alert("Please fill out all fields and upload a picture.");
    return;
  }

  // Nur Dateinamen, keine Base64
  const imageList = allFiles.map((file) => "img/" + file.name);

  const chosenDate = dateInput.value || new Date().toISOString().split("T")[0];
  console.log("chosenDate", chosenDate);
  const now = new Date();

  const entry = {
    images: imageList,
    mood: mood,
    note: note,
    time: now.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  const stored = getStoredEntries();
  const index = stored.findIndex((e) => e.date === chosenDate);

  if (index !== -1) {
    stored[index].entries.push(entry);
  } else {
    stored.push({ date: chosenDate, entries: [entry] });
  }

  saveEntries(stored);
  entriesContainer.innerHTML = "";
  renderEntry(
    stored.find((e) => e.date === chosenDate),
    true
  );
  getForm.reset();

  console.log("images total:", imageList.length);
  console.log(
    "storage size (chars):",
    JSON.stringify(getStoredEntries()).length
  );
});

console.log("storage size (chars):", JSON.stringify(getStoredEntries()).length);

entriesContainer.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteEntry")) {
    const date = event.target.dataset.date;
    const index = parseInt(event.target.dataset.index);

    const stored = getStoredEntries();
    const entryForDate = stored.find((entry) => entry.date === date);

    if (entryForDate) {
      entryForDate.entries.splice(index, 1); // Entferne EINEN Eintrag

      // Falls keine Einträge mehr für diesen Tag / gesamten Tag löschen
      if (entryForDate.entries.length === 0) {
        const updated = stored.filter((e) => e.date !== date);
        saveEntries(updated);
      } else {
        saveEntries(stored);
      }

      entriesContainer.innerHTML = "";
      const today = new Date().toISOString().split("T")[0];
      const todayEntry = getStoredEntries().find((e) => e.date === today);
      if (todayEntry) {
        renderEntry(todayEntry, true);
      }
    }
  }
});

// ===============================
// 🧭 INITIALISIERUNG BEIM LADEN
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const entries = getStoredEntries();
  const currentPage = window.location.pathname;

  if (currentPage.includes("entries.html")) {
    // Alle Einträge anzeigen
    entries
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .forEach((entry) => renderEntry(entry));
  } else {
    // Nur der heutige Eintrag für index.html
    const today = new Date().toISOString().split("T")[0];
    const todayEntry = entries.find((e) => e.date === today);
    if (todayEntry) {
      renderEntry(todayEntry, true);
    }
  }
});

clearBtn.addEventListener("click", () => {
  const sicher = confirm("Möchtest du wirklich alle Einträge löschen?");
  if (!sicher) return;

  localStorage.removeItem("diaryEntries");
  entriesContainer.innerHTML = "";
});

function clearOldEntry() {
  localStorage.removeItem("diaryEntries");
  entriesContainer.innerHTML = "";
}

// ====================================================================
//                 CODE ZUM BEARBEITEN; NACHHER LÖSCHEN
// ====================================================================
