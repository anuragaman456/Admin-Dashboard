let users = []; // To store the fetched users
let currentPage = 1;
const usersPerPage = 10;

async function fetchData() {
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    users = await response.json();
    renderTable();
}

function renderTable() {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const displayUsers = users.slice(startIndex, endIndex);

    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    displayUsers.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><input type="checkbox" onclick="selectRow(${index})"></td>
            <td>${user.id}</td>
            <td contenteditable="false">${user.name}</td>
            <td contenteditable="false">${user.email}</td>
            <td contenteditable="false">${user.role}</td>
            <td>
                <button onclick="editRow(${index})" class="edit-btn">Edit</button>
                <button onclick="saveRow(${index})" class="save-btn">Save</button>
                <button onclick="deleteRow(${index})" class="delete-btn">Delete</button>
                <button onclick="editContent(${index})" class="edit-btn">Edit Content</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(users.length / usersPerPage);
    document.getElementById('currentPage').innerText = `Page ${currentPage} of ${totalPages}`;
}

function changePage(direction) {
    const totalPages = Math.ceil(users.length / usersPerPage);

    switch (direction) {
        case 'first-page':
            currentPage = 1;
            break;
        case 'previous-page':
            currentPage = Math.max(currentPage - 1, 1);
            break;
        case 'next-page':
            currentPage = Math.min(currentPage + 1, totalPages);
            break;
        case 'last-page':
            currentPage = totalPages;
            break;
    }

    renderTable();
}

function search() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredUsers = users.filter(user =>
        Object.values(user).some(value =>
            value.toLowerCase().includes(searchTerm)
        )
    );

    currentPage = 1;
    users = filteredUsers;
    renderTable();
}

function editRow(index) {
    const row = document.querySelector(`#userTable tbody tr:nth-child(${index + 1})`);
    const cells = row.querySelectorAll('td:not(:first-child)');
    const editBtn = row.querySelector('.edit-btn');
    const saveBtn = row.querySelector('.save-btn');

    cells.forEach(cell => {
        cell.contentEditable = true;
        cell.style.backgroundColor = '#f0f0f0';
    });

    editBtn.style.display = 'none';
    saveBtn.style.display = 'inline-block';
}

function saveRow(index) {
    const row = document.querySelector(`#userTable tbody tr:nth-child(${index + 1})`);
    const cells = row.querySelectorAll('td:not(:first-child)');
    const editBtn = row.querySelector('.edit-btn');
    const saveBtn = row.querySelector('.save-btn');

    cells.forEach(cell => {
        cell.contentEditable = false;
        cell.style.backgroundColor = '';
    });

    editBtn.style.display = 'inline-block';
    saveBtn.style.display = 'none';

    // Save changes in memory (not persisted)
    const user = users[(currentPage - 1) * usersPerPage + index];
    if (user) {
        user.name = cells[1].innerText;
        user.email = cells[2].innerText;
        user.role = cells[3].innerText;
    }
}

function deleteRow(index) {
    users.splice((currentPage - 1) * usersPerPage + index, 1);
    renderTable();
}

function deleteSelected() {
    const selectedRows = document.querySelectorAll('#userTable tbody tr.selected');
    selectedRows.forEach(row => {
        const index = row.rowIndex - 1;
        users.splice((currentPage - 1) * usersPerPage + index, 1);
    });

    renderTable();
}

function selectRow(index) {
    const row = document.querySelector(`#userTable tbody tr:nth-child(${index + 1})`);
    row.classList.toggle('selected');
}

function editSelected() {
    const selectedRows = document.querySelectorAll('#userTable tbody tr.selected');
    selectedRows.forEach(row => {
        const index = row.rowIndex - 1;
        editRow(index);
    });
}

function editContent(index) {
    const row = document.querySelector(`#userTable tbody tr:nth-child(${index + 1})`);
    const cells = row.querySelectorAll('td:not(:first-child)');

    cells.forEach(cell => {
        cell.contentEditable = true;
        cell.style.backgroundColor = '#f0f0f0';
    });
}

fetchData();
