import swal from "sweetalert"

const customAlert = (message) => {
    if(message.includes('success')) {
        swal(message, '', 'success');
    }
    else if(message.includes('already') || message.includes('Incorrect')) {
        swal(message, '', 'warning');
    }
    else {
        swal(message, '', 'error');
    }
}

export default customAlert;