// @ts-ignore
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
//
// import Task from './componets/Task'
const getData=()=>{
    let res=[]
    for(let i=0;i<10;++i){
        res.push({
            id:i
        })
    }
    return res
}
// fake data generator
const getItems = (count:number) =>{
    let res=[]
    for(let i=0;i<count;++i){
        res.push({
                id: `item-${i}`,
                content: `item ${i}`
        })
    }
    return res
}
    // Array.from({ length: count }, (v, k) => k).map(k => ({
    //     id: `item-${k}`,
    //     content: `item ${k}`
    // }));

// fake data generator
const getRightItems = (count:number,start:number) =>{
    let res=[]
    for(let i=start;i<count+start;++i){
        res.push({
            id: `item-${i}`,
            content: `item ${i}`
        })
    }
    return res
}

// a little function to help us with reordering the result
const reorder = (list:any, startIndex:number, endIndex:number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging:boolean, draggableStyle:any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver:boolean) => {
    console.log('isDraggingOver',isDraggingOver)
    return ({
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid,
        width: 250
    })
};



const ReactDragDemo=(props:any,ref:any)=> {

    const [items,setItems] =useState(getItems(10))
    const [rightItems,setRightItems] =useState(getRightItems(10,10))

    const onDragLeftEnd=(result:any)=>{
        console.log('result left',result)
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const itemsContent:any = reorder(
           items,
            result.source.index,
            result.destination.index
        );

        setItems(itemsContent)
    };

    const onDragRightEnd=(result:any)=>{
        console.log('result right',result)
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const itemsContent:any = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setRightItems(itemsContent)
    };
    const getHtml=()=>{

    };
    useImperativeHandle(ref, () => ({
        getHtml:getHtml,
    }));

    useEffect(()=>{
        console.log('items',items)
    },[items])

// 这里就是拖拽组件了
    // @ts-ignore
    return <>
        <div className='drag-container-box'>
            <div className='drag-container-box-left'>
                <DragDropContext onDragEnd={onDragLeftEnd} >
                    <Droppable droppableId="droppable-id-test-left">
                        {(provided:any, snapshot:any) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className='drag-box-custom'
                            >
                                {items.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(providedItem:any, snapshotItem:any) => (
                                            <div
                                                ref={providedItem.innerRef}
                                                {...providedItem.draggableProps}
                                                {...providedItem.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshotItem.isDragging,
                                                    providedItem.draggableProps.style
                                                )}
                                            >
                                                {item.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
            <div className='drag-container-box-right'>
                <DragDropContext onDragEnd={onDragRightEnd}>
                    <Droppable droppableId="droppable-id-test-right"
                    //            renderClone={(provided, snapshot, rubric) => (
                    //   <Item
                    //     provided={provided}
                    //     isDragging={snapshot.isDragging}
                    //     item={column.items[rubric.source.index]}
                    //   />
                    // )}
                    >
                        {(provided:any, snapshot:any) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className='drag-box-custom'
                            >
                                {rightItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled>
                                        {(providedItem:any, snapshotItem:any) => (
                                            <div
                                                ref={providedItem.innerRef}
                                                {...providedItem.draggableProps}
                                                {...providedItem.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshotItem.isDragging,
                                                    providedItem.draggableProps.style
                                                )}
                                            >
                                                {item.content}
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>

    </>
};


export default forwardRef(ReactDragDemo);
