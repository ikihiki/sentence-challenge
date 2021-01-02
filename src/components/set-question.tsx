import { DefaultButton, TextField } from "@fluentui/react";
import { observer } from "mobx-react";
import { useCallback } from "react";
import { QuestionService } from "../models/question";


interface IProp {
    service: QuestionService;
}


export const SetQuestion = observer(({ service }: IProp) => {
    const current = service.currentQuestion;
    if (!current) {
        return <div>loading...</div>
    }
    const check = useCallback(() => {
        current.check();
        if (current.collect) {
            service.next();
        }
    }, [current, service]);
    
    return (
        <div>
            <div>{current.Japanese}</div>
            <div>{current.hint.map((hint,index) => <span key={index} style={{ visibility: hint.visible ? 'visible' : 'hidden' }} >{hint.word} </span>)}</div>
            <div>
                <TextField
                    value={current.input}
                    onChange={(evt, value) => current.input = value || ''}
                    onKeyUp={(e) => {
                        if (e.key !== 'Enter' || (e.key === 'Enter' && (e.shiftKey === true || e.ctrlKey === true || e.altKey === true))) { // Enterキー除外
                            return false;
                        }
                        check();
                    } }
                />
            </div>
            <DefaultButton
                onClick={()=>check()}>Check</DefaultButton>
        </div>
    );
})