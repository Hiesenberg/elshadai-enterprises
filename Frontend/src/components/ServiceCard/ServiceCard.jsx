import "./ServiceCard.css";

function ServiceCard(props){
    return(
        <div className="service-card">
            <div className="service-icon">
                {props.icon}
            </div>

            <h3>{props.title}</h3>
            <p>{props.description}</p>

            <span className="view-work">View our work →</span>
        </div>
    )
}
export default ServiceCard;