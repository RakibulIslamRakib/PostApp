window.addEventListener('DOMContentLoaded',getPosts);

function getPosts(){
    try{
    	let url = 'https://jsonplaceholder.typicode.com/posts'
    	fetch(url).then((response)=>response.json()).then((posts)=>{
    		addPosts(posts);
    	})
    }catch(err){
    	console.log(err);
    	alert('Check your network connection and try again latter');
    }
};


function addPosts(posts) {
	let dynamicTable = document.getElementById('dynamicTable');
	for(let post = 0; post<posts.length;post++){
	  let newRow = dynamicTable.insertRow();
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
  	  deletBtn.setAttribute('class','btn btn-danger btn-sm');
  	  updateBtn.setAttribute('class','btn btn-warning btn-sm');

      detailsBtn.appendChild(txtDetails);
      detailsBtn.addEventListener('click',function(){detailsView(posts[post].id)});
      deletBtn.appendChild(txtDelet);
      deletBtn.addEventListener('click',function(){deletAlert(posts[post].id)});
      updateBtn.appendChild(txtUpdate);
      updateBtn.addEventListener('click',function(){updateView(posts[post].id)});

	  newCell1.innerHTML = posts[post].id;
	  newCell2.innerHTML = posts[post].title;
	  newCell3.appendChild(detailsBtn);
	  newCell3.appendChild(updateBtn);
	  newCell3.appendChild(deletBtn);
	}
};


function deletAlert(id){
	if(confirm('Are you sure you want to delete?')){
		deletPost(id);
	}
};

function deletPost(id){
	try{
		let url = 'https://jsonplaceholder.typicode.com/posts/'+id;
		fetch(url, {
  		method: 'DELETE',
});
    let td = event.target.parentNode; 
    let tr = td.parentNode; // the row to be removed
    tr.parentNode.removeChild(tr);
	}catch(err){
		alert(err);
	}

};

function detailsView(id){
	alert('details view clicked');
};

function updateView(id){
	alert('update view clicked');
};

