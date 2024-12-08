import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom";



export default function LoginDisabled() {

    const {isLoggedIn} = useSelector(state => state.user);

    if(isLoggedIn) {
        return <Navigate to={"/"} />
    } else{
        return <Outlet />
    }
}
