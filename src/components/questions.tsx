import { DefaultButton, DetailsList, IColumn, SelectionMode, TextField } from "@fluentui/react";
import { observer } from "mobx-react";
import { Question, QuestionService } from "../models/question";

interface IProp {
    service: QuestionService;
}

const columns: IColumn[] = [
    {
        key: 'Id',
        name: 'Id',
        fieldName: 'Id',
        minWidth: 150,
        maxWidth: 150
    },
    {
        key: 'English',
        name: 'English',
        fieldName: 'English',
        minWidth: 500
    },
    {
        key: 'Japanese',
        name: 'Japanese',
        fieldName: 'Japanese',
        minWidth: 500
    },
    {
        key: 'LastCollectAnswerd',
        name: 'LastCollectAnswerd',
        fieldName: 'LastCollectAnswerd',
        minWidth: 150,
        maxWidth: 150
    }
]

export const Questions = observer(({ service }: IProp) => {

    return (
        <div>
            <DefaultButton text='Add' onClick={() => service.add()} />
            <DetailsList
                items={service.questions}
                columns={columns}
                selectionMode={SelectionMode.none}
                onRenderItemColumn={(item, index, column) => <ItemColumn service={service} item={item} index={index} column={column} />}
            />
        </div>);
})

const ItemColumn = observer(({ service, item, index, column }: { service: QuestionService, item?: Question, index?: number, column?: IColumn }) => {
    switch (column?.key) {
        case 'Id':
            return <span>{item?.Id}</span>;
        case 'English':
            return <TextField
                value={item?.English}
                onChange={(evt, newVal) => { if (item) { item.English = newVal || "" } }}
                onBlur={() => { if (item) { service.update(item.Id) } }}
            />;
        case 'Japanese':
            return <TextField
                value={item?.Japanese}
                onChange={(evt, newVal) => { if (item) { item.Japanese = newVal || "" } }}
                onBlur={() => { if (item) { service.update(item.Id) } }}
            />;
        case 'LastCollectAnswerd':
            return (
                <span> {item?.LastCollectAnswerd}</span>
            );
        default:
            return <span>?</span>;
    }
});