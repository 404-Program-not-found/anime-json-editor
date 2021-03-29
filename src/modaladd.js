var modalWrap = null;

function createModalEdit (target_dom){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${target_dom.querySelector("#textTitle").textContent}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">ID</label>
                        </div>
                        <div class="col-auto">
                            <input id="IDInput" class="form-control" value=${target_dom.id}>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">Content Tag</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="tag-select"></select>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">Show Changes/Slow burner?</label>
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" value="" id="slowbuner">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Save changes</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(element in ["normal", "shounen", "shoujo", "ecchi"]){
        var opt = document.createElement("option");
        opt.value= index;
        opt.innerHTML = ["normal", "shounen", "shoujo", "ecchi"][element]; // whatever property it hastar
        if (target_dom.classList.contains(opt.innerHTML)){
            var selectedIndex = index
        }
        // then append it to the select element
        if (target_dom.classList.contains("changes")){modalWrap.querySelector("#slowbuner").checked = true}
        modalWrap.querySelector("#tag-select").appendChild(opt);
        index++;
        }
    modalWrap.querySelector('#saveBtn').onclick = function() {editSave(target_dom);}
    document.getElementsByClassName('content')[0].append(modalWrap)
    modalWrap.querySelector("#tag-select").value = selectedIndex
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function createModalAdd (){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Element...</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <button type="button" class="btn btn-dark btn-small modal-btn" id="addCardBtn" data-bs-dismiss="modal"><i class="fas fa-id-badge"></i>Card</button>
                <button type="button" class="btn btn-dark btn-small modal-btn" id="addBtnBtn" data-bs-dismiss="modal" onclick="createBtnAdd();"><i class="fas fa-link"></i>Button</button>
                <button type="button" class="btn btn-dark btn-small modal-btn" id="addBtnBtn" data-bs-dismiss="modal" onclick="createPageAdd();"><i class="fas fa-pager"></i>Page</button>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
            </div>
        </div>
    </div>
    `;
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function createPageAdd (){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add page</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="IDInput" class="col-form-label">Page ID</label>
                        </div>
                        <div class="col-auto">
                            <input id="IDInput" class="form-control">
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Create Page</button>
            </div>
            </div>
        </div>
    </div>
    `;
    modalWrap.querySelector('#saveBtn').onclick = function() {pageAdd();}
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function movePageModal (step){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Go to page</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="link-select" class="col-form-label">Go to</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="link-select"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Go to page</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(element in json_file.pages){
        if(step !== json_file.pages[element]){
        var opt = document.createElement("option");
        opt.value = index;
        opt.innerHTML = json_file.pages[element]; // whatever property it has
        modalWrap.querySelector("#link-select").appendChild(opt);
        index++;
        }
    }
    modalWrap.querySelector('#saveBtn').onclick = function() {pageMove();}
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function delPageModal (){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Delete page</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Are you sure you want to delete this page?
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-danger" data-bs-dismiss="modal" id="saveBtn">Delete Page</button>
            </div>
            </div>
        </div>
    </div>
    `;
    modalWrap.querySelector('#saveBtn').onclick = function() {pageDel();}
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function createModalBtnEdit (target_dom, json_file, step){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Edit Button</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="BtnNameInput" class="col-form-label">Button label</label>
                        </div>
                        <div class="col-auto">
                            <input id="BtnNameInput" class="form-control">
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="link-select" class="col-form-label">Linked to</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="link-select"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Save changes</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(element in json_file.pages){
        if(step !== json_file.pages[element]){
        var opt = document.createElement("option");
        opt.value = index;
        opt.innerHTML = json_file.pages[element]; // whatever property it has
        if (target_dom.id == opt.innerHTML){
            var selectedIndex = index
        }
        modalWrap.querySelector("#link-select").appendChild(opt);
        index++;
        }
    }
    modalWrap.querySelector("#BtnNameInput").value = target_dom.textContent
    modalWrap.querySelector('#saveBtn').onclick = function() {buttonSave(target_dom);}
    document.getElementsByClassName('content')[0].append(modalWrap)
    modalWrap.querySelector("#link-select").value = selectedIndex
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function generateToast(title, desc){
    $('.toast.fade.hide').remove();
    var toast = document.createElement("div")
    toast.className = "toast"
    toast.setAttribute('role', 'alert')
    toast.innerHTML = `
    <div class="toast-header">
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
        ${desc}
    </div>
    `
    document.getElementById("toastPlacement").appendChild(toast)
    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function(toastEl) {
      return new bootstrap.Toast(toastEl)
    });
   toastList.forEach(toast => toast.show()); 
}

function createBtnAdd(){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Add Button</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="BtnNameInput" class="col-form-label">Button label</label>
                        </div>
                        <div class="col-auto">
                            <input id="BtnNameInput" class="form-control">
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="link-select" class="col-form-label">Linked to</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="link-select"></select>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Add button</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(element in json_file.pages){
        var opt = document.createElement("option");
        opt.value = index;
        opt.innerHTML = json_file.pages[element]; // whatever property it has
        modalWrap.querySelector("#link-select").appendChild(opt);
        index++;
    }
    modalWrap.querySelector('#saveBtn').onclick = function() {add_button()}
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}

function createCardModal (anime_file){
    if(modalWrap !== null){
        modalWrap.remove()
    }
    modalWrap = document.createElement('div')
    modalWrap.innerHTML = `
    <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Create Card</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="ID-select" class="col-form-label">ID</label>
                        </div>
                        <div class="col-auto">
                            <input class="form-select" id="ID-select" list="datalistOptions" placeholder="Type to search for existing ids, or write a new ID"></select>
                        </div>
                        <datalist id="datalistOptions"></datalist>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="cardTitleInput" class="col-form-label">Card Title</label>
                        </div>
                        <div class="col-auto">
                            <input id="cardTitleInput" class="form-control">
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="cardDescInput" class="col-form-label">Card Description</label>
                        </div>
                        <div class="col-auto">
                            <input id="cardDescInput" class="form-control">
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="formFile" class="form-label">Image</label>
                        </div>
                        <div class="col-auto">
                        <input class="form-control" type="file" id="formFile" accept="image/*">
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="tag-select" class="col-form-label">Content Tag</label>
                        </div>
                        <div class="col-auto">
                            <select class="form-select" id="tag-select"></select>
                        </div>
                    </div>
                    <div class="row g-3 align-items-center my-1">
                        <div class="col-auto">
                            <label for="slowbuner" class="col-form-label">Show Changes/Slow burner?</label>
                        </div>
                        <div class="col-auto">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="slowbuner">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal" id="saveBtn">Create</button>
            </div>
            </div>
        </div>
    </div>
    `;
    var index = 1;
    for(var element in ["normal", "shounen", "shoujo", "ecchi"]){
        var opt = document.createElement("option");
        opt.value= index;
        opt.innerHTML = ["normal", "shounen", "shoujo", "ecchi"][element]; // whatever property it hastar
        // then append it to the select element
        modalWrap.querySelector("#tag-select").appendChild(opt);
        index++;
        }
    var index = 1;
    for(var element in anime_file){
        var opt = document.createElement("option");
        opt.value = element; // whatever property it hastar
        // then append it to the select element
        modalWrap.querySelector("#datalistOptions").appendChild(opt);
        index++;
    }
    modalWrap.querySelector('#saveBtn').onclick = function() {createNewCard();}
    document.getElementsByClassName('content')[0].append(modalWrap)
    var modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
}