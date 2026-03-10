// Change Status
const buttonsChangeStatus = document.querySelectorAll('[data-btn-change-status]');
if (buttonsChangeStatus.length > 0) {
    const formChangeStatus = document.getElementById('form-change-status');
    const path = formChangeStatus.getAttribute('data-path');

    buttonsChangeStatus.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const id = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-status');
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

            formChangeStatus.action = `${path}/${newStatus}/${id}?_method=PATCH`;
            formChangeStatus.submit();
        });
    });
}
// End Change Status

// Delete Category
const buttonsDelete = document.querySelectorAll('[data-btn-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteCategory = document.getElementById('form-delete-category');
    const path = formDeleteCategory.getAttribute('data-path');
    
    buttonsDelete.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const isConfirmed = confirm('Bạn có chắc chắn muốn xóa danh mục này không?');
            if (isConfirmed) {
                const id = button.getAttribute('data-id');
                formDeleteCategory.action = `${path}/${id}?_method=DELETE`;
                formDeleteCategory.submit();
            }
        });
    });
}
// End Delete Category

// Form change multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti){
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const checkBoxMulti = document.querySelector('[checkbox-multi]');
        const inputsChecked = checkBoxMulti.querySelectorAll("input[name='id']:checked");
        
        const typeSelect = e.target.elements.type.value;

        if (typeSelect === 'delete-all'){
            const confirmDelete = confirm('Bạn có chắc chắn muốn xóa các danh mục đã chọn không?');
            if (!confirmDelete) return;
        }

        if (inputsChecked.length === 0){
            alert('Vui lòng chọn ít nhất một danh mục!');
            return;
        }

        const ids = [];
        const inputIds = formChangeMulti.querySelector("input[name='ids']");

        inputsChecked.forEach((input) => {
            const id = input.value;
            
            if (typeSelect === 'change-position'){
                const position = input.closest('tr').querySelector("input[name='position']").value;
                ids.push(`${id}-${position}`);
            }else{
                ids.push(id);
            }
        });

        inputIds.value = ids.join(',');
        
        formChangeMulti.submit();
    });
}