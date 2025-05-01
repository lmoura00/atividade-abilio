import {useContext} from 'react';
import { ProfileContext } from '../context/profile-context';

export function useProfile() {
    const context = useContext(ProfileContext);

    return context;
}