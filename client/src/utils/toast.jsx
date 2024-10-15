import { toast } from 'react-hot-toast';

function toastMessage(type, messages) {
    if (type === 'success') {
        toast.success(messages);
    } else if (type === 'error') {
        toast.error(messages);
    } else {
        toast(messages);
    }
}

export default toastMessage;