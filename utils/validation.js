var validator = require("validator");

// salary
const validate = { 
  checkNumber(salaryInput) {
    if (validator.isDecimal(salaryInput)) return true;
    return "Please enter the salary in the right format: 10000.00"; 
  },

  // manager
  isEqual(entry1, entry2) { 
    if (entry1 === entry2) return true;
  },
};

module.exports = validate;