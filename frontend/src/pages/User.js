import { useContext } from 'react';
import { AuthenticationContext } from './../App';

export default function User(){
    let auth= useContext(AuthenticationContext);
    let user = auth.currentUser;
    return <h1>{user.displayName}</h1>
}