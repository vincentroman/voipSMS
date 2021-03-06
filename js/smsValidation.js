/**************************************************
	Validate DID
	
	Make sure that a phone number is in the format:
		1231231234
	
	This is the format that voip.ms takes in their API.
*/

function validateDID(did) {
    var re = new RegExp("^\\d+$");
	    return re.test(did);
}


/**************************************************
	Validate date
	
	Makes sure a date is in the format "yyyy-mm-dd"
*/
function validateDate(date) {
	if(/\d{4}-\d{2}-\d{2}/.test(date))
		return (true);
	
	return (false)
}

/**************************************************
	Validate new SMS
	
	When the user wants to text a new DID (sms.php, smsConversation.php),
	make sure that the phone number they're texting is valid.
*/
function validateNewSMS() {
	var form = document.forms['newSMS'];
	var errorMessage = document.getElementById('formErrorMessage_newSMS');
	
	// Clear error classes from inputs
	form['target'].classList.remove("formError");
	errorMessage.classList.remove('error');
	
	// Clear the error div
	errorMessage.innerHTML = "";
	
	// -- Begin processing form --
	// Making sure values aren't empty
	// Making sure the contact DID is in the right format (dddddddddd)
	if(!validateDID(form['target'].value)) {
		// Writing error
		errorMessage.innerHTML = "Contact phone number is not in the right format. ";
		errorMessage.innerHTML += "Example format: '1231231234'";

		// Stylin' CSS
		errorMessage.classList.add('error');
		form['target'].classList.add('formError');

		// You shall not pass validation
		return false;
	}
	
	return true;
}

/**************************************************
	Validate Conversation Search 

	Make sure that when the user searches for a conversation...
		- $limit is positive
		- To/from dates are valid format (if entered at all)
			- This means "yyyy-mm-dd"
*/
function validateConversationSearch() {
    var errors = [];
	var form = document.forms['conversationSearch'];
	var errorMessage = document.getElementById('formErrorMessage_conversationSearch');
	
	// Clear error classes from inputs
	errorMessage.classList.remove('alert');
	errorMessage.classList.remove('alert-danger');
	
	// Clear the error div
	errorMessage.innerHTML = "";
	
	// -- Begin processing form --
	// Making sure the limit is valid
	if(form['limit'].value < 1) {
		errors.push("Limit must be positive.");
	}

	// Making sure the to/from dates are valid
	if(form['from'].value != "") {
		if(!validateDate(form['from'].value)) {
			errors.push("From date must be in format 'yyyy-mm-dd'.");
		}
	}
	
	if(form['to'].value != "") {
		if(!validateDate(form['to'].value)) {
			errors.push("To date must be in format 'yyyy-mm-dd'.");
		}
	}

	// -- Writing errors --
	var numErrors = errors.length;
	if(numErrors > 0) {
		// Loop though errors and write them to the error message div
		errorMessage.innerHTML = "<strong>Error</strong>: " +
			"Something went wrong while searching for a conversation:";
		
		for(var i = 0; i < numErrors; i++) {
			errorMessage.innerHTML += "<br />";
			errorMessage.innerHTML += errors[i];
		}
		
		errorMessage.classList.add('alert');
		errorMessage.classList.add('alert-danger');
		return false;
	}
	
	return true;
}

/**************************************************
	Validate Conversation Filter 

	Make sure that when the user filters through a conversation...
		- $limit is positive
		- To/from dates are valid format (if entered at all)
			- This means "yyyy-mm-dd"
	
	Aww jeez Rick, lookit all this redundant code, sh-shouldn't we refactor?
	There's no time to refactor, Morty! We've gotta- we've gotta submit before midnight Morty!
*/
function validateConversationFilter() {
    var errors = [];
	var form = document.forms['conversationFilter'];
	var errorMessage = document.getElementById('formErrorMessage_conversationFilter');
	
	// Clear error classes from inputs
	errorMessage.classList.remove('error');
	form['limit'].classList.remove("formError");
	form['from'].classList.remove("formError");
	form['to'].classList.remove("formError");
	
	// Clear the error div
	errorMessage.innerHTML = "";
	
	// -- Begin processing form --
	// Making sure the limit is valid
	if(form['limit'].value < 1) {
		errors.push("Limit must be positive.");
		form['limit'].classList.add("formError");
	}

	// Making sure the to/from dates are valid
	if(form['from'].value != "") {
		if(!validateDate(form['from'].value)) {
			errors.push("From date must be in format 'yyyy-mm-dd'.");
			form['from'].classList.add("formError");
		}
	}
	
	if(form['to'].value != "") {
		if(!validateDate(form['to'].value)) {
			errors.push("To date must be in format 'yyyy-mm-dd'.");
			form['to'].classList.add("formError");
		}
	}

	// Making sure contact DID is valid
	if(!validateDID(form['target'].value)) {
			errors.push("Contact phone number is not in the right format. Example format: '1231231234'");
			form['target'].classList.add("formError");
	}
	
	// -- Writing errors --
	var numErrors = errors.length;
	if(numErrors > 0) {
		// Loop though errors and write them to the error message div
		errorMessage.innerHTML = "Errors found while searching for a conversation:";
		
		for(var i = 0; i < numErrors; i++) {
			errorMessage.innerHTML += "<br />";
			errorMessage.innerHTML += errors[i];
		}
		
		errorMessage.classList.add('error');
		return false;
	}
	
	return true;
}


/**************************************************
	Validate Send SMS

	Make sure that when the user sends an SMS...
		- The message is between 0-160 characters.
		- The $form['target'] is a valid DID
			- IE: The user didn't heck up my dang form
*/
function validateSendSMS() {
    var errors = [];
	var form = document.forms['sendSMS'];
	var errorMessage = document.getElementById('formErrorMessage_sendSMS');
	
	// Clear error classes from inputs
	errorMessage.classList.remove('error');
	form['message'].classList.remove("formError");
	
	// Clear the error div
	errorMessage.innerHTML = "";
	
	// -- Begin processing form --
	// Making sure the limit is valid
	if(form['message'].value < 1 || form['message'].value >= 160) {
		errors.push("Message must be between 1-160 characters.");
		form['message'].classList.add("formError");
	}

	// Making sure contact DID is valid
	if(!validateDID(form['target'].value)) {
		errors.push("Contact phone number is not in the right format. Example format: '1231231234'");
	}

	// -- Writing errors --
	var numErrors = errors.length;
	if(numErrors > 0) {
		// Loop though errors and write them to the error message div
		errorMessage.innerHTML = "Errors found while sending your SMS:";
		
		for(var i = 0; i < numErrors; i++) {
			errorMessage.innerHTML += "<br />";
			errorMessage.innerHTML += errors[i];
		}
		
		errorMessage.classList.add('error');
		return false;
	}
	
	return true;
}
