document.addEventListener('DOMContentLoaded', () => {
  const birthdateInput = document.getElementById('birthdate');
  const calculateBtn = document.getElementById('calculate-btn');
  const resultSection = document.getElementById('result-section');
  const dogAgeSpan = document.getElementById('dog-age');
  const humanAgeSpan = document.getElementById('human-age');

  // Set max date to today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  birthdateInput.max = `${yyyy}-${mm}-${dd}`;

  // Load from localStorage if available
  const savedBirthdate = localStorage.getItem('dogCalculator_birthdate');
  if (savedBirthdate) {
    birthdateInput.value = savedBirthdate;
    // Small delay to ensure UI is ready, though not strictly necessary for simple DOM
    setTimeout(() => calculateBtn.click(), 0);
  }

  calculateBtn.addEventListener('click', () => {
    const birthdateVal = birthdateInput.value;

    if (!birthdateVal) {
      alert('請選擇狗狗的出生日期！');
      return;
    }

    const birthdate = new Date(birthdateVal);
    const now = new Date();

    if (birthdate > now) {
      alert('出生日期不能在未來！');
      return;
    }

    // Save to localStorage
    localStorage.setItem('dogCalculator_birthdate', birthdateVal);

    // Calculate difference in years (including partial years)
    const diffTime = Math.abs(now - birthdate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const dogAgeYears = diffDays / 365.25; // Account for leap years roughly

    // Calculate human age using UCSD formula: 16 * ln(dogAge) + 31
    // Note: This formula works best for dogs > 1 year.
    // For very young puppies, the natural log can be negative enough to make the result negative.
    let humanAgeYears = 0;
    if (dogAgeYears > 0) {
      humanAgeYears = 16 * Math.log(dogAgeYears) + 31;
    }

    // Clamp to 0 if the formula yields a negative result (for very young puppies < ~2 months)
    if (humanAgeYears < 0) humanAgeYears = 0;

    // Format numbers to 1 decimal place
    const formattedDogAge = dogAgeYears.toFixed(1);
    const formattedHumanAge = humanAgeYears.toFixed(1);

    // Update DOM
    dogAgeSpan.textContent = formattedDogAge;
    humanAgeSpan.textContent = formattedHumanAge;

    // Show result section with animation
    resultSection.classList.remove('hidden');
    resultSection.classList.add('show');
  });
});
