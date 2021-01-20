const HOST = 'http://localhost:5000';
let guides = [];

//Список всех студентов
const getStudents = async () =>{
    return fetch(`${HOST}/guide`)
        .then((response) => response.json())
        .catch(() => []);
}

//Удаления студента с id
const deleteStudentById = async (id) => {
    return fetch(`${HOST}/guide/${id}`,{ method: 'DELETE',})
        .then((response) => response.json())
        .catch(() => []);

}

/*//Изменение студента с id
const updateStudentById = async (id) => {
    return fetch(`${HOST}/guide/${id}`,{method: 'PUT',})
        .then((response) => response.json())
        .catch(() => []);
}*/

const updateStudentById = async (id,firstName,lastName) => {
    return fetch(`${HOST}/guide/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify ({
            "firstName": firstName,
            "lastName": lastName
        }),
    })
        .then((response) => response.json())
        .catch(() => []);
}

//Создание нового студента
const createStudent = async (firstName, lastName) => {
    return fetch(`${HOST}/guide`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            firstName,
            lastName
        }),
    })
        .then((response) => response.text())
        .catch(() => []);
}

//Создание таблички
const renderElement = (student) => {
    const rootElement = document.createElement('tr');

    const idElement = document.createElement('td');
    idElement.innerText = student.id;

    const firstNameElement = document.createElement('td');
    firstNameElement.innerText = student.firstName;

    const lastNameElement = document.createElement('td');
    lastNameElement.innerText = student.lastName;

    const actions = document.createElement('td');

//кнопка удаления
    const delButton = document.createElement('input');
    delButton.type = 'submit';
    delButton.className = 'delete';
    delButton.value = 'Удалить';
    delButton.onclick = async () => {
        await deleteStudentById(student.id);
        guides = guides.filter((x) => x.id !== student.id);
        render();
    };

//кнопка редактирования
    const editButton = document.createElement('input');
    editButton.type = 'submit';
    editButton.className = 'change';
    editButton.value = 'Изменить';
    editButton.id = student.id;

    //нажатие на кнопку изменить
    editButton.onclick = () => {
        editButton.disabled = true ;  //чтобы не вылезало несколько полей сразу
        const place = document.getElementById('formForEdit');
        const editForm = document.createElement('form');
        const nameUpdate = document.createElement('input');
        const surnameUpdate = document.createElement('input');
        const updateButton = document.createElement('input');
        editForm.id = 'inputsForEditing';

        //поля формы для редактирования
        nameUpdate.type = 'text';
        surnameUpdate.type = 'text';
        updateButton.type = 'button';
        updateButton.value = 'Сохранить';
        //непосредственно нажатие на кнопку сохранить и изменение данных

        updateButton.onclick = updation;
            async function updation() {
                let id = editButton.id;
                let newName = nameUpdate.value;
                let newSurname = surnameUpdate.value;
                console.log(newName);
                const foundUser = guides.find((user) => user.id === id);
                foundUser.firstName = newName;
                foundUser.lastName = newSurname;
                await updateStudentById(id,newName,newSurname);
                render();

                editForm.innerHTML = '';
                editButton.disabled = false;
            }

        nameUpdate.required = true;
        nameUpdate.placeholder = 'новое имя';
        nameUpdate.id = 'newName';
        surnameUpdate.required = true;
        surnameUpdate.placeholder = 'новая фамилия';
        surnameUpdate.id = 'newSurname';

        place.append(editForm);
        editForm.append(nameUpdate);
        editForm.append(surnameUpdate);
        editForm.append(updateButton);
    };

    actions.append(delButton);
    actions.append(editButton);
    rootElement.append(idElement);
    rootElement.append(firstNameElement);
    rootElement.append(lastNameElement);
    rootElement.append(actions);

    return rootElement;
};

const render = () => {
    const listElement = document.getElementById('guide');
    listElement.innerHTML = '';

    console.log(guides);

    guides.forEach((guide) => {
        const element = renderElement(guide);
        listElement.append(element);
    })
}

const formElement = document.getElementById('form');
formElement.onsubmit = async (event) => {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    const id = await createStudent(firstName, lastName);
    guides.push({
        id,
        firstName,
        lastName,
    });

    render();
};

getStudents()
    .then((response) => {
        guides = response;
        render();
    })
    .catch(() => {
        console.log('Error!');
    })

