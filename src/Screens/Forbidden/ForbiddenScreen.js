import { Navigate } from "react-router-dom";

export default function ForbiddenScreen({ Auth }) {
    if (Auth && Auth.role === "admin")
        return <Navigate to={"/profile"} replace />;
    return (
        <div style={{width:"100%", height:"calc(100vh - 120px)",display:'flex', justifyContent:'center',alignItems:"center"}}>
            <h2 className="text-danger" style={{textDecorationLine:"line-through"}}>
                <span className="fs-3">⚠️Permission Denided For User </span>
                <span className="fs-5">(only Admin Can saw the Users List)</span>
            </h2>
            
        </div>
    );
}
