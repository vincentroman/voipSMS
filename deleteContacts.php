<?php
session_start();
require_once('sql/dbQueries.php');

/**************************************************
	Delete Marked Contacts

	Given the results of the delete contacts form from contactsList.php,
	process the array of "to-be-deleted" contacts.

	Pretty much delete the contact if they exist, and belong to the user.
*/
function deleteMarkedContacts() {
	// -- Validation --
	// Making sure we're logged in
	if(!isset($_SESSION['auth'])) {
		echo "<div class='alert alert-danger'>Error: You must be logged in to do that!</div>";
		return;
	}
			
	// Making sure the form was submitted properly
	if($_SERVER['REQUEST_METHOD'] != "POST") {
		echo "<div class='alert alert-danger'>Error: The form wasn't filled out properly</div>";
		return;
	}

	// Making sure that there were entries in the form
	if(!isset($_POST['contactID']))  {
		echo "<div class='alert alert-danger'>Error: No contacts selected for deletion</div>";
		return;
	}

	// Looping through all the contacts
	$errors = array();

	foreach($_POST['contactID'] as $contactID) {
		$contact = getContact($_SESSION['auth_info']['userID'], $contactID);				

		// Making sure that we own the contact before it's deleted
		if($contact['status'] == "not_found") {
			$errors[] = "No contact with ID {$contactID} doesn't exist.";
		} else if($contact['status'] == "not_found") {
			$errors[] = "Contact {$contactID} doesn't belong to you.";
		} else if($contact['status'] != "success") {
			$errors[] = "Something went wrong when getting contact {$contactID}.";
		} else {
			// Begin processing delete operation
			deleteContact($contactID);
		}
	}

	// Show all the errors if any exist
	if(count($errors) > 0) {
		echo "<div class='alert alert-danger'>"; 
		echo "Something went wrong when deleting one or more contacts.";
		echo "<ul>";

		foreach($errors as $e) {
			echo "<li>$e</li>";
		}

		echo "</ul>";

		echo '<a class="alert-link" href="contactList.php">Back to contacts list.</a>';
		echo "</div>"; 

		return false;
	}

	return true;
}

/**************************************************
	Entry Point
*/
require_once("pageTop.php");
?>
	<title>voipSMS</title>
</head>
<body>
<?php 
	include_once("header.php");

	// Attempt to delete the contact. Print a success message if it worked
	if(deleteMarkedContacts()) {
		echo '
		<div class="alert alert-success">
			<strong>Success!</strong>
			<a class="alert-link" href="contactList.php">Back to contacts list.</a>
		</div>';
	}
?>
</body>
<?php require_once("pageBottom.php");?>
</html>
