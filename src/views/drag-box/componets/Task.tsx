
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
// @ts-ignore
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const Task=(props:any,ref:any)=> {

    const onDragEnd=(result:any)=>{
        console.log('onDragEnd demo',result);
    };

    const getHtml=()=>{

    };
    useImperativeHandle(ref, () => ({
        getHtml:getHtml,
    }));

// 这里就是拖拽组件了
    // @ts-ignore
    return <>
        <div style={{border:'1x solid #333333',margin:'10px'}} draggable>
            test
        </div>
    </>
};


export default forwardRef(Task);
