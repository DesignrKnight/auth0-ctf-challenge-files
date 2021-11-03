$(document).ready(function() {
	loadNotes();
	// attach event
	$("#add-btn").on('click', addNote);

});

function deleteAcc(){
	fetch(`/api/delete`)
		.then(() => {
			window.location.href = '/logout';
		});
}

async function delNote(rowId, noteId) {

	const data = {
		noteId: noteId
	};

	await fetch("/api/notes/delete", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
		.then(() => $(`#${rowId}`).remove());
}

async function loadNotes() {

	await fetch(`/api/notes`, {
			method: 'GET',
			credentials: 'include'
		})
		.then((response) => response.json())
		.then((userData) => populateNotes(userData))
		.catch((error) => console.log(error));
}

function htmlEncode(str){
  return String(str).replace(/[^\w. ]/gi, function(c){
     return '&#'+c.charCodeAt(0)+';';
  });
}

function populateNotes(userData) {

	if (userData.length !== 0) {
		for (entry in userData) {
			noteInfo = userData[entry];
			r = (Math.random() + 1).toString(36).substring(7);
			rowData = `<div class="p-2 bd-highlight" id="${r}_row">
		      <div class="card border-secondary" style="max-width: 20rem; min-width: 20rem">
		        <div class="c-header">
		          <div class="text-right">
		            <button type="button" class="btn-close" onclick="delNote('${r}_row','${noteInfo.id}')">
		          </div>
		        </div>
		        <div class="card-body pt-0">
		          <h4 class="card-title">${htmlEncode(noteInfo.note_title)}</h4>
		          <p class="card-text">${htmlEncode(noteInfo.note_content)}</p>
		        </div>
		      </div>
		    </div>`;
			$('#notesContainer').append(rowData);
		}
	}

}

async function addNote() {

	$("#add-btn").prop("disabled", true); // disable multiple submission

	// alert message
	let card = $("#resp-msg");
	card.hide();

	const data = {
		note_title: $("#note_title").val(),
		note_content: $("#note_content").val()
	};

	await fetch('/api/notes/add', {
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
					data['id'] = resp.id;
					populateNotes([data]);
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

	$("#add-btn").prop("disabled", false);
}
