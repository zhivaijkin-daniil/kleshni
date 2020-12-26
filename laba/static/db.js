function submitForm(e){
    e.preventDefault();
    let form = document.querySelector('form').elements;
    console.log(form);
    fetch('/save-form', {
        method: 'POST',
        headers: {
            'Content-Type':'application/x-www-form-urlencoded'
        },
        body: JSON.stringify({
            'input-0': form.namedItem('ans0').value,
            'input-1':form.namedItem('ans1').value,
            'input-2':form.namedItem('ans2').value,
        })
    })
        .then(res => res.text())
        .then(res => console.log(res));
    alert('Результаты отправлены!');
}

document.querySelector('form').addEventListener('submit', submitForm);
