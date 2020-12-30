
import Axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';


export default function loginCall(loginToken){
    const navigate = useNavigate();
    Axios.post("http://localhost:5000/api/login_user",{}, {
        headers: {
            'Authorization': `Basic ${loginToken}`
        }
        }).then(function (response) {
        if (response.status == '201') {
            navigate('/app/dashboard', { replace: true });
            if ('token' in response.data){
            window.localStorage.setItem('token', response.data['token']);
            window.localStorage.setItem('user_id', response.data['user_id']);
            //TODO add error handeling
        }}
        })
};

export default function logout() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('user_id');
    console.log("logout run")
  };

export default function unauthorizedError(errorMessage) {
    
}