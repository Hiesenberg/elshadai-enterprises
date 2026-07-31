import "./ServiceCard.css";

function ServiceCard(props){
    return(
        <div className="service-card">
            <div className="service-icon">
                {props.icon}
            </div>
            
                <h3>{props.title}</h3>
            
         
                <p>{props.description}</p>
            </div>
        
    )
}
export default ServiceCard;