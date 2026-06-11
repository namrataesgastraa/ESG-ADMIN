import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const confirmDelete = async (title = 'Are you sure?', text = "You won't be able to revert this!") => {
  const result = await MySwal.fire({
    title,
    text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#7C3AED', // Astraa Violet color
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    customClass: {
      popup: 'rounded-xl',
      confirmButton: 'px-5 py-2.5 rounded-lg font-semibold',
      cancelButton: 'px-5 py-2.5 rounded-lg font-semibold'
    }
  });

  return result.isConfirmed;
};

// Also add a quick Toast utility for the success/error messages
export const toast = {
  success: (msg: string) => {
    MySwal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: msg,
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  },
  error: (msg: string) => {
    MySwal.fire({
      toast: true,
      position: 'top-end',
      icon: 'error',
      title: msg,
      showConfirmButton: false,
      timer: 3000,
    });
  }
};