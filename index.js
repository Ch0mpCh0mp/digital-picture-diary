// ===============================
// 🌍 GLOBALE VARIABLEN / ELEMENTE
// ===============================

const getForm = document.getElementById("dailyMood");
const getImage = document.getElementById("imageUpload");
const moodInput = document.querySelector("#moodOfTheDay");
const noteInput = document.querySelector("#noteOfTheDay");
const entriesContainer = document.getElementById("entries");

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
  console.log("🎯 renderEntry aufgerufen für", entry.date);

  const entryDiv = document.createElement("div");
  entryDiv.classList.add("entry");

  entry.entries.forEach((singleEntry, index) => {
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

  const imageList = [];
  let filesLoaded = 0;

  allFiles.forEach((file) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      imageList.push(event.target.result);
      filesLoaded++;

      if (filesLoaded === allFiles.length) {
        const today = new Date();
        const todayDate = today.toISOString().split("T")[0];

        const entry = {
          images: imageList,
          mood: mood,
          note: note,
          time: today.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        const stored = getStoredEntries();
        const index = stored.findIndex((e) => e.date === todayDate);

        if (index !== -1) {
          stored[index].entries.push(entry);
        } else {
          stored.push({ date: todayDate, entries: [entry] });
        }

        saveEntries(stored);
        entriesContainer.innerHTML = "";
        renderEntry(
          stored.find((e) => e.date === todayDate),
          true
        );
        getForm.reset();
      }
    };

    reader.readAsDataURL(file);
  });

  console.log("images total:", imageList.length);
  console.log(
    "storage size (chars):",
    JSON.stringify(getStoredEntries()).length
  );
});

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
  const today = new Date().toISOString().split("T")[0];
  const todayEntry = entries.find((entry) => entry.date === today);
  if (todayEntry) {
    renderEntry(todayEntry, true);
  }
});

document.getElementById("clearButton").addEventListener("click", () => {
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
