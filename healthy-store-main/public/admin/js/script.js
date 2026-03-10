// Button status
const btnsStatus = document.querySelectorAll('[btn-status]')

if (btnsStatus.length > 0){
    btnsStatus.forEach(btn => {
        btn.addEventListener('click', () =>{
            let url = new URL(window.location.href)
            const status = btn.getAttribute('btn-status')

            if (status){
                url.searchParams.set('status', status)
            }else{
                url.searchParams.delete('status')
            }

            window.location.href = url.href
        })
    })
}
// End button status

// Form search
const formsSearch = document.querySelectorAll('#form-search')

if (formsSearch.length > 0) {
    formsSearch.forEach(item => {
        item.addEventListener('submit', (e) => {
        e.preventDefault()

        const url = new URL(window.location.href)
        const keyword = e.target.elements.keyword.value.trim()

        if (keyword) {
            url.searchParams.set('keyword', keyword)
        } else {
            url.searchParams.delete('keyword')
        }

        window.location.href = url.href
    })
    })
}


// End form search

// Pagination
const btnsPagination = document.querySelectorAll('[btn-pagination]')

if (btnsPagination.length > 0) {

    btnsPagination.forEach(btn => {
        btn.addEventListener('click', () => {

            let url = new URL(window.location.href)

            const page = btn.getAttribute('btn-pagination')

            url.searchParams.set('page', page)
            window.location.href = url.href
        })
    })
}

// End Pagination

// Checkbox multi
const checkboxMulti = document.querySelector('[checkbox-multi]')
if (checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='check-all']")
    const inputIds = checkboxMulti.querySelectorAll("input[name='id']")
    
    inputCheckAll.addEventListener("click", () => {
        inputIds.forEach(input => input.checked = inputCheckAll.checked);
    })


    inputIds.forEach(input => {
        input.addEventListener('click', ()=> {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length
            inputCheckAll.checked = (countChecked === inputIds.length);
        })  
    })
}
// End Checkbox multi

// End Form change multi

// Show alert
const alerts = document.querySelectorAll('[show-alert]');
if (alerts.length > 0){
    alerts.forEach(alert => {
        const time = parseInt(alert.getAttribute('data-time')) || 3000;

        const btnClose = alert.querySelector('[close-alert]');

        setTimeout(()=>{
            alert.classList.add('alert-hide');
        }, time);

        if (btnClose){
            btnClose.addEventListener('click', () => {
                alert.classList.add('alert-hide');
            })
        } 
    })
}

// End Show alert

// Upload image preview
const uploadImageContainer = document.querySelector('[upload-image]');

if (uploadImageContainer) {
    const uploadImageInput = uploadImageContainer.querySelector('[upload-image-input]');
    const uploadImagePreview = uploadImageContainer.querySelector('[upload-image-preview]');
    const uploadImageRemove = uploadImageContainer.querySelector('[upload-image-remove]');
    const removeFlag = uploadImageContainer.querySelector('[upload-image-remove-flag]');

    const oldImage = uploadImagePreview.getAttribute('data-old');

    if (oldImage) {
        uploadImagePreview.style.display = 'block';
        uploadImageRemove.style.display = 'block';
    } else {
        uploadImagePreview.style.display = 'none';
        uploadImageRemove.style.display = 'none';
    }

    uploadImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];

        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            uploadImagePreview.style.display = 'block';
            uploadImageRemove.style.display = 'block';
        }
    });

    uploadImageRemove.addEventListener('click', () => {

        uploadImageInput.value = '';

        uploadImagePreview.src = '';
        uploadImagePreview.style.display = 'none';
        uploadImageRemove.style.display = 'none';
        
        if (oldImage) {
            removeFlag.value = "1";
    }
    });
}
// End upload image preview

// Sort
const sort = document.querySelector('[sort]')

if (sort){
    const sortSelect = sort.querySelector("[sort-select]");
    const btnClearSort = sort.querySelector("[sort-clear]");

    const url = new URL(window.location.href);

    sortSelect.addEventListener("change",  (e) => {
        const value = e.target.value;
        url.searchParams.set("sort", value);
        window.location.href = url.href;
    });

    btnClearSort.addEventListener("click", function () {
        url.searchParams.delete("sort");
        window.location.href = url.href;
    })
    // Add selected for option
    const sortKey = url.searchParams.get("sort")
    
    if (sortKey){
        const optionSelected = sortSelect.querySelector(`option[value='${sortKey}']`)
        optionSelected.selected = true
    }

}
