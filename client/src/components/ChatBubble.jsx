import TimeAgo from 'react-timeago'
import style from './ChatBubble.module.css'

export default function ChatBubble({ isSelf, data }){

    return(
        <div className={isSelf ? style.containerLeft : style.containerRight}>
            <p>{data.text}</p>
            <p className={style.time} style={{ textAlign: isSelf ? "start" : "end" }}>
                <TimeAgo date={data.createdAt.toString()} minPeriod={10}/>
            </p>
        </div>
    )
}