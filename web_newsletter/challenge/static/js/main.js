document.getElementById('form').addEventListener('submit', e => {
	e.preventDefault();

	fetch('/api/enroll', {
		method: 'POST',
		body: JSON.stringify({
			'email': document.querySelector('input[type=text]').value
		}),
		headers: {'Content-Type': 'application/json'}
    })
    .then(resp => { 
        return resp.text(); 
    })
    .then(data => {
		document.getElementById('output').innerHTML = data;
	});
});