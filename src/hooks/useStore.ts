import { useSelector } from 'react-redux';
import store, { RootState } from '../store';


export default function useStore(){
    const dispatch = store.dispatch
    const states = useSelector((state:RootState) => state )
    return {states , dispatch}
}