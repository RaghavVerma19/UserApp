document.addEventListener("DOMContentLoaded", fetchData);


// Define the API endpoint
const apiEndpoint = "http://localhost:8080/userapp/api/users"; // Adjust this endpoint as per your Spring Boot API

// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        populateTable(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data from the server.");
    }
}

// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById("user-table-body");

    // Clear any existing rows
    tableBody.innerHTML = "";

    // Loop through the data and create table rows
    data.forEach(user => {
        const row = document.createElement("tr");

        // Create cells for user data
        const idCell = document.createElement("td");
        idCell.textContent = user.id;

        const fnameCell = document.createElement("td");
        fnameCell.textContent = user.firstName;
		
		const lnameCell = document.createElement("td");
		lnameCell.textContent = user.lastName;

        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;
		
		const editBtnCell = document.createElement("td");
		        const editButton = document.createElement("button");
		        editButton.textContent = "Edit";
		        editButton.onclick = () => editUser(user.id);
		        editBtnCell.appendChild(editButton);
				
				const delButton = document.createElement("button");
				delButton.textContent = "Delete";
				delButton.onclick  = () => deleteUser(user.id);
				editBtnCell.appendChild(delButton);
		
        // Append cells to the row
        row.appendChild(idCell);
        row.appendChild(fnameCell);
		row.appendChild(lnameCell);
        row.appendChild(emailCell);
		row.appendChild(editBtnCell);
        // Append the row to the table body
        tableBody.appendChild(row);
		console.log("row");
    });
}

async function editUser(userId) {
    // Fetch the current user details
    try {
        const response = await fetch(`${apiEndpoint}/${userId}`);
        if (!response.ok) {
            throw new Error(`Error fetching user data: ${response.status}`);
        }
        // Show a modal to edit the user details
        const modalContent = `
            <div id="editModal">
                <h2>Edit User</h2>
                <label>First Name:</label><input type="text" id="firstName"><br>
                <label>Last Name:</label><input type="text" id="lastName"><br>
                <label>Email:</label><input type="text" id="email"><br>
                <button onclick="updateUser(${userId})">Save</button>
                <button onclick="closeEditModal()">Cancel</button>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalContent);
    } catch (error) {
        console.error("Error editing user:", error);
        alert("Failed to load user details for editing.");
    }
}

function closeEditModal() {
    const modal = document.getElementById("editModal");
    if (modal) modal.remove();
}

async function updateUser(userId) {
    // Get updated data from the modal inputs
    const updatedUser = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("email").value,
    };

    try {
        const response = await fetch(`${apiEndpoint}/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedUser),
        });

        if (!response.ok) {
            throw new Error(`Error updating user: ${response.status}`);
        }

        alert("User updated successfully!");
        closeEditModal();
        fetchData(); // Reload the table
    } catch (error) {
        console.error("Error updating user:", error);
        alert("Failed to update user.");
    }
}

async function deleteUser(userId){
	try{
		let dlt = confirm("Are you sure to delete the user?");
		if(dlt){
			const response = await fetch(`${apiEndpoint}/${userId}`,{
		method : "DELETE"
		});
		if(!response.ok){
			alert("An error occured please wait..");
		}
		alert("User deleted successfully!");
		fetchData();
		}
	}
	catch{
		console.error("Error deleting the user");
		alert("Failed to delete the user");
	}
}
		
function createModal(){
	
	const createWindow= 
	`<div id="createModal" style="display:block">
	                <h2>Create User</h2>
					<label for="idCreate">ID</label><input type="number" id="idCreate"><br>
	                <label>First Name:</label><input type="text" id="firstNameCreate"><br>
	                <label>Last Name:</label><input type="text" id="lastNameCreate"><br>
	                <label>Email:</label><input type="text" id="emailCreate"><br>
	                <button onclick="createUser()">Save</button>
	                <button onclick="closeCreateModal()">Cancel</button>
	            </div>`;
	document.body.insertAdjacentHTML("beforeend",createWindow);
				
}
function closeCreateModal(){
	const createModalDiv=document.getElementById("createModal");
	if(createModalDiv) createModalDiv.remove();
}

/*async function createUser(){
	const createdUser = {
			id:document.getElementById("idCreate").value,
			firstName: document.getElementById("firstNameCreate").value,
			lastName: document.getElementById("lastNameCreate").value,
			email: document.getElementById("emailCreate").value,	
		};
		try{
			const response =  await fetch(`${apiEndpoint}`,{
				
				method:"POST",
				headers:{
					"Content-Type":"application/json"
				},
				body:JSON.stringify(createdUser),
			});
			
			if(!response.ok){
				closeCreateModal();
				throw new error("Couldn't create user, plaese try again later");
			}
			alert("User created successfully");
			closeCreateModal();
			fetchData();
		}
		try{
			const response = await axios.post(`${apiEndpoint}`,createdUser);
			if(!response.ok){
				closeCreateModal();
				throw new error("couldn't create user.");
			}
			alert("user created");
			closeCreateModal();
			fetchData();
		}
		catch{
			closeCreateModal();
			console.error("Error in creating user,wait for some time");
			alert("Couldn't create user, please try again later..");
		}
}*/

function createUser() {
    // Get user data from inputs
	if($("#firstNameCreate").val() == ''){
		alert("Please enter first name");
		return false;
	}
    const createdUser = {
        id: $("#idCreate").val(),
        firstName: $("#firstNameCreate").val(),
        lastName: $("#lastNameCreate").val(),
        email: $("#emailCreate").val(),
    };

    // Make AJAX POST request
    $.ajax({
        url: apiEndpoint, 
        method: "POST",   
        contentType: "application/json", 
        data: JSON.stringify(createdUser),
        success: function (response) {
           
            alert("User created successfully!");
            closeCreateModal();
            fetchData(); 
        },
        error: function (xhr, status, error) {
            
			closeCreateModal();
            console.error("Error creating user:", xhr.responseText || error);
            alert("Couldn't create user. Please try again.");
        },
    });
}

