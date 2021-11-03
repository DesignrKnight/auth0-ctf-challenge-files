$(document).ready(function() {

	// attach event
	$("#submit-btn").on('click', addSubmission);

});


async function addSubmission() {

	$("#submit-btn").prop("disabled", true); // disable multiple submission

	// prepare alert
	let card = $("#resp-msg");
	card.attr("class", "alert alert-info");
	card.hide();

	// validate
	let name = $("#name").val();
	let email = $("#email").val();
	let website = $("#website").val();
	let message = $("#message").val();


	if ($.trim(name) === '' | $.trim(email) === '' | $.trim(message) === '') {
		$("#submit-btn").prop("disabled", false);
		card.text("Please fill out all the fields first!");
		card.show();
		return;
	}

	const data = {
		name: name,
		email: email,
		website: website,
		message: message
	};

	await fetch(`/api/submit_ticket`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then((response) => response.json()
			.then((resp) => {
				if (response.status == 200) {
					card.text(resp.message);
					card.attr("class", "alert alert-success");
					card.show();
					return;
				}
				card.text(resp.message);
				card.attr("class", "alert alert-danger");
				card.show();
			}))
		.catch((error) => {
			card.text(error);
			card.attr("class", "alert alert-danger");
			card.show();
		});

	$("#submit-btn").prop("disabled", false);
}