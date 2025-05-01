import { useContext } from 'react';
import { AuthContext } from '../context/profile-context';

export function useAuth() {
    const context = useContext(AuthContext);

    
    return context;
}