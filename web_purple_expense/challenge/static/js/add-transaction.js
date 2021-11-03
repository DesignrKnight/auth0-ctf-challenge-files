$(document).ready(function() {
	$("#addRecordBtn").on('click', addRecord);
	$("#cancelBtn").on('click', function() {
		$("#showFormBtn").click()
	});
});

function toggleInputs(state) {
	$("#cancelBtn").prop("disabled", state);
	$("#addRecordBtn").prop("disabled", state);
}

function clearInputs() {
	$("#newRecordDesc").val("");
	$("#newRecordAmount").val("");
}


async function addRecord() {

	toggleInputs(true);

	// prepare alert
	let card = $("#resp-msg");
	card.hide();


	let recType = $("#newRecordType").find(":selected").text();
	let recDesc = $("#newRecordDesc").val();
	let recAmount = $("#newRecordAmount").val();

	// validate
	if ($.trim(recType) === '' || $.trim(recDesc) === '' || $.trim(recAmount) === '') {
		toggleInputs(false);
		card.text("Please fill out all the required fields!");
		card.attr("class", "alert alert-danger");
		card.show();
		return;
	}

	const data = {
		recType: recType,
		recDesc: recDesc,
		recAmount: recAmount,
	};

	await fetch("/api/transactions/add", {
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
					loadTransactions(); // re populate transactions table
					clearInputs(); // clear form fields
					toggleInputs(false); // enable inputs
					window.setTimeout(function() {
						$("#showFormBtn").click(); // hide add form
						card.hide();
					}, 1000);
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

	toggleInputs(false); // enable inputs
}