import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const showSuccessAlert = (message: string) => {
  return Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success'
  });
};

export const showErrorAlert = (message: string) => {
  return Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error'
  });
};
