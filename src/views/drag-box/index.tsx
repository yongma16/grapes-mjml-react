// @ts-ignore
import { forwardRef, useEffect, useImperativeHandle, useState,useCallback } from 'react';
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import {getListStyle,getItems,getRightItems,reorder,getItemStyle} from './const'


const ReactDragDemo=(props:any,ref:any)=> {

    const [items,setItems] =useState(getItems(10))
    const [rightItems,setRightItems] =useState(getRightItems(10,10))
    // using useCallback is optional
    const onBeforeCapture = useCallback((e:any) => {
        console.log('onBeforeCapture',e)
        /*...*/
    }, []);
    const onBeforeDragStart = useCallback(() => {
        /*...*/
    }, []);
    const onDragStart = useCallback(() => {
        /*...*/
    }, []);
    const onDragUpdate = useCallback(() => {
        /*...*/
    }, []);
    const onDragEnd = useCallback(() => {
        // the only one that is required
    }, []);

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
                <DragDropContext onBeforeCapture={onBeforeCapture} onDragEnd={onDragLeftEnd} >
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
                               // renderClone={(provided:any, snapshot:any, rubric:any) => {
                               //     return  <div
                               //         {...provided.droppableProps}
                               //         ref={provided.innerRef}
                               //         style={getListStyle(snapshot.isDraggingOver)}
                               //         className='drag-box-custom'
                               //       >
                               //           {rightItems.map((item, index) => (
                               //             <Draggable key={item.id} draggableId={item.id} index={index}>
                               //                 {(providedItem:any, snapshotItem:any) => (
                               //                   <div
                               //                     ref={providedItem.innerRef}
                               //                     {...providedItem.draggableProps}
                               //                     {...providedItem.dragHandleProps}
                               //                     style={getItemStyle(
                               //                       snapshotItem.isDragging,
                               //                       providedItem.draggableProps.style
                               //                     )}
                               //                   >
                               //                       {item.content}
                               //                   </div>
                               //                 )}
                               //             </Draggable>
                               //           ))}
                               //           {provided.placeholder}
                               //       </div>
                               // }}
                    >
                        {(provided:any, snapshot:any) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                                className='drag-box-custom'
                            >
                                {rightItems.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index} >
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
