import { useLocation } from 'react-router-dom';

// custom hook to get the current pathname in React

const usePath = () => {
    const location = useLocation();
    return location.pathname;
}

export default usePath;