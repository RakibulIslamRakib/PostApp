
const searchBar = document.getElementById('searchBar');
const url = 'https://jsonplaceholder.typicode.com/posts';

window.addEventListener('DOMContentLoaded',getPosts);

function getPosts(){
	fetch(url).then((response)=>response.json())
	.then((posts)=>{
		for(let post = 0;post<posts.length;post++){
			addPosts(posts[post]);
		}
	})
	.catch((err)=>{alert(`${err.name} occurs! Check your internet connection`)})
};


function addPosts(post) {
	let dynamicTable = document.getElementById('dynamicTable');
	let tableBody = dynamicTable.querySelector('#myTableBody');
  let newRow = tableBody.insertRow();
  let newCell1 = newRow.insertCell(0);
  let newCell2 = newRow.insertCell(1);
  let newCell3 = newRow.insertCell(2);
  let detailsBtn = document.createElement("BUTTON");
  let deletBtn = document.createElement("BUTTON");
  let updateBtn = document.createElement("BUTTON");
  let txtDetails = document.createTextNode("Details");
  let txtDelet = document.createTextNode("Delete");
  let txtUpdate = document.createTextNode("Update");

  detailsBtn.setAttribute('class','btn btn-success btn-sm');
  detailsBtn.setAttribute('data-toggle','modal');
  detailsBtn.setAttribute('data-target','#DetailsViewModal');
  deletBtn.setAttribute('class','btn btn-danger btn-sm');
  updateBtn.setAttribute('class','btn btn-warning btn-sm');
  updateBtn.setAttribute('data-toggle','modal');
  updateBtn.setAttribute('data-target','#editViewModal');
  newRow.setAttribute('data-post',JSON.stringify(post));

  detailsBtn.appendChild(txtDetails);
  detailsBtn.addEventListener('click',function(){detailsViewModal()});
  deletBtn.appendChild(txtDelet);
  deletBtn.addEventListener('click',function(){deletAlert(post.id)});
  updateBtn.appendChild(txtUpdate);
  updateBtn.addEventListener('click',function(){editModalView()});

  newCell1.innerHTML = post.id;
  newCell2.innerHTML = post.title;
  newCell3.appendChild(detailsBtn);
  newCell3.appendChild(updateBtn);
  newCell3.appendChild(deletBtn);

  newCell1.setAttribute('id','postId');
  newCell2.setAttribute('id','postTitle');
  newCell3.setAttribute('class','buttonsGroup');

};


function deletAlert(postId){
	if(confirm('Are you sure you want to delete?')){
		deletPost(postId);
	}
};

function deletPost(postId){
	try{
		fetch(`${url}/${postId}`, {
  		method: 'DELETE',
		});
    let td = event.target.parentNode; 
    let tr = td.parentNode; // the row to be removed
    tr.parentNode.removeChild(tr);
	}catch(err){
		alert(`${err.name} occurs ! Please Try Again`);
	}

};


function addNewPostFormFunc() {
	let addNewPostFromVar = document.querySelector('.addNewPostFormDiv');
	addNewPostFromVar.style.display = 'block';

	let postForm = document.getElementById('addNewPostForm');
	postForm.addEventListener('submit',function(e){addNewPost(e);})
}

function addNewPost(evt){
	evt.preventDefault();
	let addNewPostFromVar = document.querySelector('.addNewPostFormDiv');
	let postForm = document.getElementById('addNewPostForm');
	let formData = new FormData(postForm);
	let userId = formData.get('userId');
	let postTitle = formData.get('postTitle');
	let postDetails = formData.get('postDetails');

	addNewPostFromVar.style.display = 'none';

	fetch(url, {
	  method: 'POST',
	  body: JSON.stringify({
	    title: postTitle,
	    body: postDetails,
	    userId: userId,
	  }),
	  headers: {
	    'Content-type': 'application/json; charset=UTF-8',
	  },
	})
  .then((response) => response.json())
  .then((post) => {
  	addPosts(post);
  	alert('Post added successfully');
  })
  .catch((err)=>alert(`${err.name} occurs! Please Try Again!`))
}

function detailsViewModal(){
	let detailsBtn =  event.target;
	let tableRow = detailsBtn.parentNode.parentNode;
	let postObj = JSON.parse(tableRow.dataset.post);
	let detailsViewModal = document.getElementById('DetailsViewModal');
	let modalbodyTitle = detailsViewModal.querySelector('.card-title');
	let modalbodyPostId = detailsViewModal.querySelector('.postId');
	let modalbodyUserId = detailsViewModal.querySelector('.userId');
	let modalbodyDetails = detailsViewModal.querySelector('.card-text');
	let postTitle = tableRow.querySelector('#postTitle').innerHTML;
	let postId = tableRow.querySelector('#postId').innerHTML;
	let userId = postObj.userId;
	let postBody = postObj.body;

	modalbodyTitle.innerHTML = postTitle;
	modalbodyPostId.innerHTML = postId;
	modalbodyUserId.innerHTML = userId;
	modalbodyDetails.innerHTML = postBody;


};


function editModalView(){
	let editButton = event.target;
	let tableRow = editButton.parentNode.parentNode;
	let postObj = JSON.parse(tableRow.dataset.post);
	let editViewModal = document.getElementById('editViewModal');
	let postTitleEdit = editViewModal.querySelector('#postTitleEdit');
	let postDetailsEdit = editViewModal.querySelector('#postDetailsEdit');
	let saveUpdateButton = editViewModal.querySelector('#saveUpdateButton');
	let userId = postObj.userId;
	let postId = tableRow.querySelector('#postId').innerHTML;
	let postTitle = tableRow.querySelector('#postTitle').innerHTML;
	let postDetails = postObj.body;
	let tablePostTitle = tableRow.querySelector('#postTitle');
	//let tablePostDetails = tableRow.querySelector('#postBody');

	postTitleEdit.value = postTitle;
	postDetailsEdit.value = postDetails;

	saveUpdateButton.addEventListener('click',()=>{

		let newPostTitle = postTitleEdit.value;
		let newpostDetails = postDetailsEdit.value;

		editViewModal.querySelector('.close').click();
		fetch(`${url}/${postId}`, {
		  method: 'PUT',
		  body: JSON.stringify({
		    id: postId,
		    title: newPostTitle,
		    body: newpostDetails,
		    userId: userId
		  }),
		  headers: {
		    'Content-type': 'application/json; charset=UTF-8',
		  },
		}).then((response) =>
			response.json())
		.then((post) => {
				tableRow.dataset.post = JSON.stringify(post);
		  	tablePostTitle.innerHTML = post.title;
		  	alert('Successfully Updated');
		  })
		.catch((err)=>
			alert(`${err.name} occurs! Please try again`));
		});
};



const reduceFetch = (func,delay)=>{
  let timer;
  return function(...args){
    let that = this;
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(()=>{
      func(that,args);
    },delay);
  }
};

function dataFetch(field,args) {
	let dynamicTable = document.getElementById('dynamicTable');
	let rowCount = dynamicTable.rows.length;

  for (let i = rowCount - 1; i > 0; i--) {
    dynamicTable.deleteRow(i);
  }

	fetch(url).then((response)=>response.json())
	.then((posts)=>{

		if(searchBar.value === ''){
    	for(let post = 0;post<posts.length;post++){
    		addPosts(posts[post]);
    	}
   	}else{

			for(let post = 0; post < posts.length; post++){

				let postTitle = posts[post].title;
				let postTitleSmaller = (String(postTitle)).toLowerCase();
				let searchBarSmaller = (String(searchBar.value)).toLowerCase();
				let postDetails = posts[post].body;
				let postDetailsSmaller = (String(postDetails)).toLowerCase();

				if((postTitleSmaller.indexOf(searchBarSmaller) >-1)||(postDetailsSmaller.indexOf(searchBarSmaller) >-1) ){
						addPosts(posts[post]);
				}
			}
	}
	})
	.catch((err)=>{alert(`${err.name} occurs! Check your internet connection`)})
};

searchBar.addEventListener('keyup',reduceFetch(dataFetch,300));



