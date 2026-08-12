(() => {
  const assignments = Array.isArray(window.PRESIDENTIAL_YEARBOOK_ASSIGNMENTS)
    ? window.PRESIDENTIAL_YEARBOOK_ASSIGNMENTS
    : [];
  const periodSelect = document.querySelector("#reveal-period");
  const studentSelect = document.querySelector("#reveal-student");
  const selectedStudent = document.querySelector("#selected-student");
  const revealButton = document.querySelector("#reveal-president-button");
  const revealCard = document.querySelector("#president-reveal-card");
  const message = document.querySelector("#reveal-message");

  if (!periodSelect || !studentSelect || !selectedStudent || !revealButton || !revealCard || !message) return;

  const clearReveal = () => {
    revealCard.hidden = true;
    revealCard.classList.remove("is-revealed");
    revealCard.replaceChildren();
    message.textContent = "";
  };

  const selectedAssignment = () => assignments.find(assignment =>
    assignment.period === periodSelect.value && assignment.student === studentSelect.value
  );

  const updateStudentState = () => {
    clearReveal();
    const assignment = selectedAssignment();
    selectedStudent.textContent = assignment ? assignment.student : "Select your name to continue.";
    revealButton.disabled = !assignment;
  };

  const populateStudents = () => {
    clearReveal();
    studentSelect.replaceChildren();
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = periodSelect.value ? "SELECT YOUR NAME" : "CHOOSE A PERIOD FIRST";
    studentSelect.append(placeholder);
    assignments
      .filter(assignment => assignment.period === periodSelect.value)
      .sort((a, b) => a.student.localeCompare(b.student))
      .forEach(assignment => {
        const option = document.createElement("option");
        option.value = assignment.student;
        option.textContent = assignment.student;
        studentSelect.append(option);
      });
    studentSelect.disabled = !periodSelect.value;
    selectedStudent.textContent = periodSelect.value
      ? "Select your name to continue."
      : "Choose your CP Government period first.";
    revealButton.disabled = true;
  };

  const revealPresident = () => {
    const assignment = selectedAssignment();
    if (!assignment) {
      message.textContent = "Select your class period and name before revealing your president.";
      return;
    }

    const number = document.createElement("p");
    number.className = "reveal-president-number";
    number.textContent = `PRESIDENT #${assignment.presidentNumber}`;
    const name = document.createElement("h3");
    name.textContent = assignment.president;
    const term = document.createElement("p");
    term.className = "reveal-president-term";
    term.textContent = assignment.term;
    const status = document.createElement("p");
    status.className = "reveal-status";
    status.textContent = assignment.status;
    const link = document.createElement("a");
    link.className = "reveal-library-link";
    link.href = assignment.libraryUrl;
    link.textContent = "OPEN CP PRESIDENTIAL LIBRARY →";

    revealCard.replaceChildren(number, name, term, status, link);
    revealCard.hidden = false;
    requestAnimationFrame(() => revealCard.classList.add("is-revealed"));
    message.textContent = `${assignment.student}, your permanent Portrait Day assignment is ready.`;
    revealCard.focus();
  };

  periodSelect.addEventListener("change", populateStudents);
  studentSelect.addEventListener("change", updateStudentState);
  revealButton.addEventListener("click", revealPresident);
  populateStudents();
})();
