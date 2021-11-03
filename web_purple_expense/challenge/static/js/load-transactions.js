$(document).ready(function() {
	loadTransactions();
});

async function loadTransactions() {

	await fetch(`/api/transactions/${user_uid}`, {
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => response.json())
		.then((userData) => populateTable(userData))
		.catch((error) => console.log(error));
}

function populateTable(userData) {

	let totalIncome = 0;
	let totalExpense = 0;
	$("#totalInc").text(totalIncome);
	$("#totalExp").text(totalExpense);

	$('#transaction-listing tbody').empty();
	$("#empty-table-msg").show();
	$("#transaction-listing").hide();

	if (userData.transactions.length !== 0) {
		let transList = userData.transactions;

		for (entry in transList) {
			transInfo = transList[entry];

			rowData = `<tr id="${transInfo.id}_row">`;

			if (transInfo.type == "Expense") {
				rowData += "<td>💸 Expense</td>";
				totalExpense += parseInt(transInfo.amount);
			} else  {
				rowData += "<td>💵 Income</td>";
				totalIncome += parseInt(transInfo.amount);
			}

			rowData += `<td>${transInfo.description}</td>`;
			rowData += `<td>${transInfo.amount}</td>`;
			rowData += `<td>
                              <button type="button" class="btn btn-sm btn-danger btn-icon-text" onclick="delTransData('${transInfo.id}')">
                                  <i class="mdi mdi-delete btn-icon"></i>                          
                              </button>
                        </td>
                </tr>`;

			$('#transaction-listing > tbody:last-child').append(rowData);
		}
		$("#totalInc").text(totalIncome);
		$("#totalExp").text(totalExpense);
		$("#empty-table-msg").hide();
		$("#transaction-listing").show();
	}

}