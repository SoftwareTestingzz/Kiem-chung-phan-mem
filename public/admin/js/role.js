// Delete Role
const buttonsDelete = document.querySelectorAll('[data-btn-delete]');
if (buttonsDelete.length > 0) {
    const formDeleteRole= document.querySelector('#form-delete-role');
    const path = formDeleteRole.getAttribute('data-path');
    
    buttonsDelete.forEach(button => {
        button.addEventListener('click', (e) => {
            const isConfirmed = confirm('Bạn có chắc chắn muốn xóa nhóm quyền này không?');
            if (isConfirmed) {
                const id = button.getAttribute('data-id');

                const action = `${path}/${id}?_method=DELETE`;
                formDeleteRole.action = action;
                formDeleteRole.submit();
            }  
        });
    });    
}
// End Delete Role

// Permissions
const tablePermissions = document.querySelector('[table-permissions]')

if (tablePermissions){
    const btnSubmit = document.querySelector('[btn-submit]')

    btnSubmit.addEventListener('click', () => {
        const permissions = []

        const rows = tablePermissions.querySelectorAll('[data-name]')
        rows.forEach(row => {
            const name = row.getAttribute('data-name')
            const inputs = row.querySelectorAll('input')

            if (name == 'id'){
                inputs.forEach(input => {
                    const id = input.value
                    permissions.push({
                        id: id,
                        permissions: []
                    })
                })
            }else{
                inputs.forEach((input, index) => {
                    const checked = input.checked
                    if (checked){
                        permissions[index].permissions.push(name)
                    }
                })
            }

        })

        if (permissions.length){
            const formChangePermissions = document.querySelector('#form-change-permissions')
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']")

            inputPermissions.value = JSON.stringify(permissions)
            formChangePermissions.submit()
        }
    })
}
// End Permissions

// Permissions data default
const dataRecords = document.querySelector('[data-records]')
if (dataRecords){
    const records = JSON.parse(dataRecords.getAttribute('data-records'))

    const tablePermissions = document.querySelector('[table-permissions]')

    records.forEach((record, index) => {
        const permissions = record.permissions

        permissions.forEach(permission => {
            const row = tablePermissions.querySelector(`[data-name='${permission}']`)
            const input = row.querySelectorAll('input')[index]

            input.checked = true
        })
    })

}
// End Permissions data default