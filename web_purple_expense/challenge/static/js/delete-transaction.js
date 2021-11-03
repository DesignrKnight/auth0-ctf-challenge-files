async function delTransData(pRowId) {

	const data = {
		transId: pRowId
	};

	await fetch("/api/transactions/delete", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then((response) => response.json()
			.then((resp) => {
				if (response.status == 200) {
					loadTransactions();
					return;
				}
			}))
		.catch((error) => {
			console.log(error);
		});

	toggleInputs(false); // enable inputs
}