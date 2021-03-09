import jwt_decode from 'jwt-decode';

function Jwt(token) {
    try {
        return jwt_decode(token);
    } catch (e) {
        return null;
    }
}

function Sesion(props){
    const token = localStorage.getItem('token');
    var decoded = Jwt(token);
    
	if(props.history){
        if (!decoded || decoded.rol !== 'Maestro'){
            props.history.push('/');
        }else{
            return decoded
        }
    }
    return decoded
}

export default Sesion;