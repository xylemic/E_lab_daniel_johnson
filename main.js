function toggleMenu() {
  const sideMenu = document.querySelector('.side_menu');
  const closeBtn = document.querySelector('.close');

  if (sideMenu.style.left === '0%') {
    sideMenu.style.left = '-100%';
  } else {
    sideMenu.style.left = '0%';
  }

  closeBtn.addEventListener('click', () => {
    sideMenu.style.left = '-100%';
  });
}

// first input field: Medicine Class
const medicineClassInput = document.getElementById('medicine-class');
const medicineClassSuggestionsList = document.getElementById('medicine-class-suggestions');
const medicineNameInput = document.getElementById('medicine-name');
const medicineDose = document.getElementById('dose');
let selectedClassId = null; // store the selected medicine class ID

medicineClassInput.addEventListener('focus', () => {
  medicineClassInput.classList.add('loading');

  fetch('https://cliniqueplushealthcare.com.ng/prescriptions/drug_class')
    .then(response => response.json())
    .then(data => {
      // medicineClassSuggestionsList.innerHTML = '';
      medicineClassInput.classList.remove('loading');
      data.forEach(drugClass => {
        const suggestionItem = document.createElement('li');
        suggestionItem.textContent = drugClass.name;
        medicineClassSuggestionsList.appendChild(suggestionItem);

        // adding click event for selecting a medicine class
        suggestionItem.addEventListener('click', () => {
          medicineClassInput.value = drugClass.name; // sets selected class name
          selectedClassId = drugClass.id; // store the selected medicine class ID
          medicineClassSuggestionsList.style.display = 'none'; // hide suggestions

          // move focus to the second input field (Medicine Name)
          medicineNameInput.focus();
        });
      });
      medicineClassSuggestionsList.style.display = 'block'; // show suggestions
    })
    .catch(error => console.error('Error fetching drug classes:', error));
});

// hide suggestions when medicine class field loses focus
medicineClassInput.addEventListener('blur', () => {
  setTimeout(() => {
    medicineClassSuggestionsList.style.display = 'none'; // hide suggestions
  }, 200);
});

// second input field: Medicine Name
const medicineNameSuggestionsList = document.getElementById('medicine-name-suggestions');

// fetch drug names when focus moves to Medicine Name, 
//using the selectedClassId that holds the id of the currently selected med class
medicineNameInput.addEventListener('focus', () => {
  if (selectedClassId) {
    const apiUrl = `https://cliniqueplushealthcare.com.ng/prescriptions/get_drug_class_by_id/${selectedClassId}`; // uses selected class id in the API

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // check if the response data is valid
        if (!data || data.length === 0) {
          console.error('No drug data received:', data);
          medicineNameSuggestionsList.innerHTML = '<li>No results found</li>'; // display a message if no results
          return;
        }

        // medicineNameSuggestionsList.innerHTML = '';
        data.forEach(drug => {
          // adds a check to ensure the drug name exists
          if (drug && drug.medicine_name) {
            const suggestionItem = document.createElement('li');
            suggestionItem.textContent = drug.medicine_name;
            // suggestionItem.classList.add('suggestion-item');
            medicineNameSuggestionsList.appendChild(suggestionItem);

            // adding click event for selecting a medicine name
            suggestionItem.addEventListener('click', () => {
              medicineNameInput.value = drug.medicine_name;
              medicineNameSuggestionsList.style.display = 'none';

              medicineDose.focus();
            });
          } else {
            console.error('Invalid drug data:', drug);
          }
        });
        medicineNameSuggestionsList.style.display = 'block'; // show suggestions
      })
      .catch(error => console.error('Error fetching drug names:', error));
  } else {
    console.warn('No medicine class selected.');
  }
});

// hide suggestions when medicine name field loses focus
medicineNameInput.addEventListener('blur', () => {
  setTimeout(() => {
    medicineNameSuggestionsList.style.display = 'none';
  }, 200);
});

document.getElementById('add_prescription_button').addEventListener('click', function () {
  const medicineClass = document.getElementById('medicine-class').value;
  const medicineName = document.getElementById('medicine-name').value;
  const dose = document.getElementById('dose').value;
  const interval = document.getElementById('interval').value;
  const durationNumber = document.getElementById('duration-number').value;
  const durationPeriod = document.getElementById('duration-period').value;
  const instructions = document.getElementById('instructions').value;

  // validate if all required fields are filled
  if (!medicineClass || !medicineName || !dose || !interval || !durationNumber || !instructions) {
    alert("Please fill in all fields.");
    return;
  }

  // create a new table row
  const tableBody = document.getElementById('prescription-table-body');
  const row = document.createElement('tr');

  // serial number (SN)
  const snCell = document.createElement('td');
  snCell.textContent = tableBody.rows.length;
  row.appendChild(snCell);

  // medicine name
  const medicineNameCell = document.createElement('td');
  medicineNameCell.textContent = medicineName;
  row.appendChild(medicineNameCell);

  // medicine class
  const medicineClassCell = document.createElement('td');
  medicineClassCell.textContent = medicineClass;
  row.appendChild(medicineClassCell);

  // dose & Frequency
  const doseFreqCell = document.createElement('td');
  doseFreqCell.textContent = `${ dose } - ${ interval }`;
  row.appendChild(doseFreqCell);

  // duration
  const durationCell = document.createElement('td');
  durationCell.textContent = `${ durationNumber }/${durationPeriod}`;
  row.appendChild(durationCell);

  // instructions
  const instructionsCell = document.createElement('td');
  instructionsCell.textContent = instructions;
  row.appendChild(instructionsCell);

  // action (remove button)
  const actionCell = document.createElement('td');
  const removeButton = document.createElement('button');
  removeButton.classList.add('action-btn');
  removeButton.textContent = 'Remove';
  removeButton.addEventListener('click', function () {
    row.remove();
  });
  actionCell.appendChild(removeButton);
  row.appendChild(actionCell);

  // add the row to the table body
  tableBody.appendChild(row);

  // clear the form after adding the row
  document.getElementById('medicine-class').value = '';
  document.getElementById('medicine-name').value = '';
  document.getElementById('dose').value = '';
  document.getElementById('interval').value = 'Select frequency';
  document.getElementById('duration-number').value = '';
  document.getElementById('duration-period').value = '7';

  // remove "No prescribed drugs yet" message if present
  const emptyMessage = document.querySelector('.empty-message');
  if (emptyMessage) {
    emptyMessage.remove();
  }
});

const donePrescriptionBtn = document.getElementById("done-prescription");
const remarkSection = document.getElementById("remark-section");

donePrescriptionBtn.addEventListener("click", function () {
  remarkSection.style.display = "flex";
});

const suggestionClose = document.querySelector('.suggestions-list span');

suggestionClose.addEventListener('click', () => {
  medicineClassSuggestionsList.style.display = 'none';
  medicineNameSuggestionsList.style.display = 'none';
});

